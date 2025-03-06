"use strict";
/**
 * Authentication Router
 *
 * This router handles user authentication, including
 * registration, login, profile retrieval, and token management.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const server_1 = require("@trpc/server");
const trpc_1 = require("../trpc");
const auth_schema_1 = require("../schemas/auth.schema");
const user_model_1 = __importDefault(require("../models/user.model"));
const zod_1 = require("zod");
const jwt_1 = require("../utils/jwt");
exports.authRouter = (0, trpc_1.router)({
    /**
     * Register a new user
     */
    register: trpc_1.publicProcedure
        .meta({
        openapi: {
            method: 'POST',
            path: '/auth/register',
            tags: ['auth'],
            summary: 'Register a new user',
        },
    })
        .input(auth_schema_1.registerSchema)
        .output(auth_schema_1.authResponseSchema)
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ input }) {
        // Check if user already exists
        const userExists = yield user_model_1.default.findOne({
            $or: [{ email: input.email }, { username: input.username }]
        });
        if (userExists) {
            throw new server_1.TRPCError({
                code: 'BAD_REQUEST',
                message: 'User with this email or username already exists',
            });
        }
        // Create new user
        const user = yield user_model_1.default.create({
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
        const token = (0, jwt_1.generateToken)(user._id.toString());
        // Transform Mongoose document to response shape
        return {
            user: {
                id: user._id.toString(),
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
    })),
    /**
     * Login user
     */
    login: trpc_1.publicProcedure
        .meta({
        openapi: {
            method: 'POST',
            path: '/auth/login',
            tags: ['auth'],
            summary: 'Login a user',
        },
    })
        .input(auth_schema_1.loginSchema)
        .output(auth_schema_1.authResponseSchema)
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ input }) {
        // Find user by email
        const user = yield user_model_1.default.findOne({ email: input.email });
        if (!user) {
            throw new server_1.TRPCError({
                code: 'UNAUTHORIZED',
                message: 'Invalid email or password',
            });
        }
        // Check if password matches
        const isMatch = yield user.comparePassword(input.password);
        if (!isMatch) {
            throw new server_1.TRPCError({
                code: 'UNAUTHORIZED',
                message: 'Invalid email or password',
            });
        }
        // Generate token
        const token = (0, jwt_1.generateToken)(user._id.toString());
        // Transform Mongoose document to response shape
        return {
            user: {
                id: user._id.toString(),
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
    })),
    /**
     * Get current user profile
     */
    me: trpc_1.protectedProcedure
        .meta({
        openapi: {
            method: 'GET',
            path: '/auth/me',
            tags: ['auth'],
            summary: 'Get current user profile',
        },
    })
        .input(zod_1.z.void())
        .output(auth_schema_1.userProfileSchema)
        .query((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx }) {
        const user = yield user_model_1.default.findById(ctx.user.id).select('-passwordHash');
        if (!user) {
            throw new server_1.TRPCError({
                code: 'NOT_FOUND',
                message: 'User not found',
            });
        }
        // Transform Mongoose document to response shape
        return {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            age: user.age || null,
            preferences: user.preferences,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
    })),
    /**
     * Refresh auth token
     */
    refresh: trpc_1.protectedProcedure
        .meta({
        openapi: {
            method: 'POST',
            path: '/auth/refresh',
            tags: ['auth'],
            summary: 'Refresh authentication token',
        },
    })
        .input(zod_1.z.void())
        .output(auth_schema_1.refreshTokenSchema)
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx }) {
        // Generate new token
        const token = (0, jwt_1.generateToken)(ctx.user.id);
        return { token };
    })),
    /**
     * Change password
     */
    changePassword: trpc_1.protectedProcedure
        .meta({
        openapi: {
            method: 'POST',
            path: '/auth/change-password',
            tags: ['auth'],
            summary: 'Change user password',
        },
    })
        .input(auth_schema_1.changePasswordSchema)
        .output(zod_1.z.object({ success: zod_1.z.boolean() }))
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        const user = yield user_model_1.default.findById(ctx.user.id);
        if (!user) {
            throw new server_1.TRPCError({
                code: 'NOT_FOUND',
                message: 'User not found',
            });
        }
        // Verify current password
        const isMatch = yield user.comparePassword(input.currentPassword);
        if (!isMatch) {
            throw new server_1.TRPCError({
                code: 'BAD_REQUEST',
                message: 'Current password is incorrect',
            });
        }
        // Update password
        user.passwordHash = input.newPassword;
        yield user.save();
        return { success: true };
    })),
    /**
     * Request password reset
     */
    forgotPassword: trpc_1.publicProcedure
        .meta({
        openapi: {
            method: 'POST',
            path: '/auth/forgot-password',
            tags: ['auth'],
            summary: 'Request password reset',
        },
    })
        .input(auth_schema_1.forgotPasswordSchema)
        .output(zod_1.z.object({ success: zod_1.z.boolean() }))
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ input }) {
        const user = yield user_model_1.default.findOne({ email: input.email });
        // Always return success for security reasons
        if (!user) {
            return { success: true };
        }
        // In a real implementation, we would:
        // 1. Generate a reset token
        // 2. Save it to the user record with an expiration
        // 3. Send an email with the reset link
        return { success: true };
    })),
    /**
     * Reset password with token
     */
    resetPassword: trpc_1.publicProcedure
        .meta({
        openapi: {
            method: 'POST',
            path: '/auth/reset-password',
            tags: ['auth'],
            summary: 'Reset password with token',
        },
    })
        .input(auth_schema_1.resetPasswordSchema)
        .output(zod_1.z.object({ success: zod_1.z.boolean() }))
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ input }) {
        // In a real implementation, we would:
        // 1. Verify the reset token
        // 2. Check if it's expired
        // 3. Update the user's password
        // 4. Invalidate the token
        // For now, just return success
        return { success: true };
    })),
    /**
     * Logout (client-side)
     */
    logout: trpc_1.publicProcedure
        .meta({
        openapi: {
            method: 'POST',
            path: '/auth/logout',
            tags: ['auth'],
            summary: 'Logout user',
        },
    })
        .input(zod_1.z.void())
        .output(zod_1.z.object({ success: zod_1.z.boolean() }))
        .mutation(() => {
        // JWT is stateless, so we just return success
        // The client should remove the token from storage
        return { success: true };
    }),
});
