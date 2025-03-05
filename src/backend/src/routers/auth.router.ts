/**
 * Authentication Router
 * 
 * This router handles user authentication, including
 * registration, login, profile retrieval, and token management.
 */

import { TRPCError } from '@trpc/server';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { 
  registerSchema, 
  loginSchema, 
  authResponseSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  userProfileSchema
} from '../schemas/auth.schema';
import User from '../models/user.model';
import { IUser } from '../models/user.model';
import { z } from 'zod';
import { generateToken } from '../utils/jwt';

export const authRouter = router({
  /**
   * Register a new user
   */
  register: publicProcedure
    .meta({
      openapi: {
        method: 'POST',
        path: '/auth/register',
        tags: ['auth'],
        summary: 'Register a new user',
      },
    })
    .input(registerSchema)
    .output(authResponseSchema)
    .mutation(async ({ input }) => {
      // Check if user already exists
      const userExists = await User.findOne({ 
        $or: [{ email: input.email }, { username: input.username }] 
      });

      if (userExists) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'User with this email or username already exists',
        });
      }

      // Create new user
      const user = await User.create({
        username: input.username,
        email: input.email,
        passwordHash: input.password, // Will be hashed by pre-save hook
        firstName: input.firstName || null,
        lastName: input.lastName || null,
        age: input.age || null,
        preferences: {
          theme: 'light',
          fontSize: 16,
          readingLevel: 'middle grade',
          notificationSettings: {
            email: true,
            app: true
          }
        }
      });

      // Generate token
      const token = generateToken((user as IUser & { _id: any })._id.toString());

      // Transform Mongoose document to response shape
      return {
        user: {
          id: (user as IUser & { _id: any })._id.toString(),
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          age: user.age || null,
          preferences: user.preferences,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        },
        token
      };
    }),

  /**
   * Login user
   */
  login: publicProcedure
    .meta({
      openapi: {
        method: 'POST',
        path: '/auth/login',
        tags: ['auth'],
        summary: 'Login a user',
      },
    })
    .input(loginSchema)
    .output(authResponseSchema)
    .mutation(async ({ input }) => {
      // Find user by email
      const user = await User.findOne({ email: input.email });

      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid email or password',
        });
      }

      // Check if password matches
      const isMatch = await user.comparePassword(input.password);
      if (!isMatch) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid email or password',
        });
      }

      // Generate token
      const token = generateToken((user as IUser & { _id: any })._id.toString());

      // Transform Mongoose document to response shape
      return {
        user: {
          id: (user as IUser & { _id: any })._id.toString(),
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          age: user.age || null,
          preferences: user.preferences,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        },
        token
      };
    }),

  /**
   * Get current user profile
   */
  me: protectedProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/auth/me',
        tags: ['auth'],
        summary: 'Get current user profile',
      },
    })
    .input(z.void())
    .output(userProfileSchema)
    .query(async ({ ctx }) => {
      const user = await User.findById(ctx.user!.id).select('-passwordHash');
      
      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      // Transform Mongoose document to response shape
      return {
        id: (user as IUser & { _id: any })._id.toString(),
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        age: user.age || null,
        preferences: user.preferences,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };
    }),

  /**
   * Refresh auth token
   */
  refresh: protectedProcedure
    .meta({
      openapi: {
        method: 'POST',
        path: '/auth/refresh',
        tags: ['auth'],
        summary: 'Refresh authentication token',
      },
    })
    .input(z.void())
    .output(refreshTokenSchema)
    .mutation(async ({ ctx }) => {
      // Generate new token
      const token = generateToken(ctx.user!.id);
      
      return { token };
    }),

  /**
   * Change password
   */
  changePassword: protectedProcedure
    .meta({
      openapi: {
        method: 'POST',
        path: '/auth/change-password',
        tags: ['auth'],
        summary: 'Change user password',
      },
    })
    .input(changePasswordSchema)
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const user = await User.findById(ctx.user!.id);
      
      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      // Verify current password
      const isMatch = await user.comparePassword(input.currentPassword);
      if (!isMatch) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Current password is incorrect',
        });
      }

      // Update password
      user.passwordHash = input.newPassword;
      await user.save();

      return { success: true };
    }),

  /**
   * Request password reset
   */
  forgotPassword: publicProcedure
    .meta({
      openapi: {
        method: 'POST',
        path: '/auth/forgot-password',
        tags: ['auth'],
        summary: 'Request password reset',
      },
    })
    .input(forgotPasswordSchema)
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input }) => {
      const user = await User.findOne({ email: input.email });
      
      // Always return success for security reasons
      if (!user) {
        return { success: true };
      }

      // In a real implementation, we would:
      // 1. Generate a reset token
      // 2. Save it to the user record with an expiration
      // 3. Send an email with the reset link

      return { success: true };
    }),

  /**
   * Reset password with token
   */
  resetPassword: publicProcedure
    .meta({
      openapi: {
        method: 'POST',
        path: '/auth/reset-password',
        tags: ['auth'],
        summary: 'Reset password with token',
      },
    })
    .input(resetPasswordSchema)
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input }) => {
      // In a real implementation, we would:
      // 1. Verify the reset token
      // 2. Check if it's expired
      // 3. Update the user's password
      // 4. Invalidate the token

      // For now, just return success
      return { success: true };
    }),

  /**
   * Logout (client-side)
   */
  logout: publicProcedure
    .meta({
      openapi: {
        method: 'POST',
        path: '/auth/logout',
        tags: ['auth'],
        summary: 'Logout user',
      },
    })
    .input(z.void())
    .output(z.object({ success: z.boolean() }))
    .mutation(() => {
      // JWT is stateless, so we just return success
      // The client should remove the token from storage
      return { success: true };
    }),
}); 