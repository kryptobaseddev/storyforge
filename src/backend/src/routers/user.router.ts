/**
 * User Router
 * 
 * This router handles user-related operations, including
 * profile updates, password changes, and preference management.
 */

import { router, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import User, { IUser } from '../models/user.model';
import { 
  updateProfileSchema, 
  changePasswordSchema, 
  updatePreferencesSchema,
  userSchema,
  UserPreferences
} from '../schemas/user.schema';
import { Document } from 'mongoose';
import { z } from 'zod';

// Helper function to convert user document to response shape
const formatUserResponse = (user: IUser & Document) => {
  return {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    age: user.age || undefined,
    avatar: user.avatar || undefined,
    preferences: {
      theme: user.preferences.theme as "light" | "dark" | "system",
      fontSize: user.preferences.fontSize,
      readingLevel: user.preferences.readingLevel as "elementary" | "middle grade" | "young adult" | "adult",
      notificationSettings: user.preferences.notificationSettings
    },
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
};

// Empty schema for endpoints that don't need input parameters
const emptyInputSchema = z.object({}).strict();

export const userRouter = router({
  /**
   * Get current user profile
   */
  getProfile: protectedProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/users/profile',
        tags: ['users'],
        summary: 'Get current user profile',
      },
    })
    .input(emptyInputSchema)
    .output(userSchema)
    .query(async ({ ctx }) => {
      const user = await User.findById(ctx.user!.id).select('-passwordHash');
      
      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      return formatUserResponse(user);
    }),

  /**
   * Update user profile
   */
  updateProfile: protectedProcedure
    .meta({
      openapi: {
        method: 'PUT',
        path: '/users/profile',
        tags: ['users'],
        summary: 'Update user profile',
      },
    })
    .input(updateProfileSchema)
    .output(userSchema)
    .mutation(async ({ ctx, input }) => {
      // Check if email or username is already taken
      if (input.email || input.username) {
        const existingUser = await User.findOne({
          $and: [
            { _id: { $ne: ctx.user!.id } },
            { $or: [
              ...(input.email ? [{ email: input.email }] : []),
              ...(input.username ? [{ username: input.username }] : [])
            ]}
          ]
        });

        if (existingUser) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Email or username is already taken',
          });
        }
      }

      // Find and update user
      const user = await User.findById(ctx.user!.id);

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      // Update fields if provided
      if (input.firstName) user.firstName = input.firstName;
      if (input.lastName) user.lastName = input.lastName;
      if (input.username) user.username = input.username;
      if (input.email) user.email = input.email;
      if (input.age !== undefined) user.age = input.age;
      if (input.avatar) user.avatar = input.avatar;

      // Save updated user
      const updatedUser = await user.save();

      return formatUserResponse(updatedUser);
    }),

  /**
   * Change user password
   */
  changePassword: protectedProcedure
    .meta({
      openapi: {
        method: 'PUT',
        path: '/users/password',
        tags: ['users'],
        summary: 'Change user password',
      },
    })
    .input(changePasswordSchema)
    .output(userSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      // Find user
      const user = await User.findById(ctx.user!.id);

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      // Check if current password is correct
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

      return { id: user._id.toString() };
    }),

  /**
   * Get user preferences
   */
  getPreferences: protectedProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/users/preferences',
        tags: ['users'],
        summary: 'Get user preferences',
      },
    })
    .input(emptyInputSchema)
    .output(userSchema.pick({ preferences: true }))
    .query(async ({ ctx }) => {
      const user = await User.findById(ctx.user!.id).select('preferences');
      
      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      const preferences: UserPreferences = {
        theme: user.preferences.theme as "light" | "dark" | "system",
        fontSize: user.preferences.fontSize,
        readingLevel: user.preferences.readingLevel as "elementary" | "middle grade" | "young adult" | "adult",
        notificationSettings: user.preferences.notificationSettings
      };

      return { preferences };
    }),

  /**
   * Update user preferences
   */
  updatePreferences: protectedProcedure
    .meta({
      openapi: {
        method: 'PUT',
        path: '/users/preferences',
        tags: ['users'],
        summary: 'Update user preferences',
      },
    })
    .input(updatePreferencesSchema)
    .output(userSchema.pick({ preferences: true }))
    .mutation(async ({ ctx, input }) => {
      // Find user
      const user = await User.findById(ctx.user!.id);

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      // Update preferences if provided
      if (input.theme) user.preferences.theme = input.theme;
      if (input.fontSize) user.preferences.fontSize = input.fontSize;
      if (input.readingLevel) user.preferences.readingLevel = input.readingLevel;
      if (input.notificationSettings) {
        user.preferences.notificationSettings = {
          ...user.preferences.notificationSettings,
          ...input.notificationSettings
        };
      }

      // Save updated user
      await user.save();

      const preferences: UserPreferences = {
        theme: user.preferences.theme as "light" | "dark" | "system",
        fontSize: user.preferences.fontSize,
        readingLevel: user.preferences.readingLevel as "elementary" | "middle grade" | "young adult" | "adult",
        notificationSettings: user.preferences.notificationSettings
      };

      return { preferences };
    }),
}); 