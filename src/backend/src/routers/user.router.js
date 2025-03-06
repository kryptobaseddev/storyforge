"use strict";
/**
 * User Router
 *
 * This router handles user-related operations, including
 * profile updates, password changes, and preference management.
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
exports.userRouter = void 0;
const trpc_1 = require("../trpc");
const server_1 = require("@trpc/server");
const user_model_1 = __importDefault(require("../models/user.model"));
const user_schema_1 = require("../schemas/user.schema");
const zod_1 = require("zod");
// Helper function to convert user document to response shape
const formatUserResponse = (user) => {
    return {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        age: user.age || undefined,
        avatar: user.avatar || undefined,
        preferences: {
            theme: user.preferences.theme,
            fontSize: user.preferences.fontSize,
            readingLevel: user.preferences.readingLevel,
            notificationSettings: user.preferences.notificationSettings
        },
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };
};
// Empty schema for endpoints that don't need input parameters
const emptyInputSchema = zod_1.z.object({}).strict();
exports.userRouter = (0, trpc_1.router)({
    /**
     * Get current user profile
     */
    getProfile: trpc_1.protectedProcedure
        .meta({
        openapi: {
            method: 'GET',
            path: '/users/profile',
            tags: ['users'],
            summary: 'Get current user profile',
        },
    })
        .input(emptyInputSchema)
        .output(user_schema_1.userSchema)
        .query((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx }) {
        const user = yield user_model_1.default.findById(ctx.user.id).select('-passwordHash');
        if (!user) {
            throw new server_1.TRPCError({
                code: 'NOT_FOUND',
                message: 'User not found',
            });
        }
        return formatUserResponse(user);
    })),
    /**
     * Update user profile
     */
    updateProfile: trpc_1.protectedProcedure
        .meta({
        openapi: {
            method: 'PUT',
            path: '/users/profile',
            tags: ['users'],
            summary: 'Update user profile',
        },
    })
        .input(user_schema_1.updateProfileSchema)
        .output(user_schema_1.userSchema)
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        // Check if email or username is already taken
        if (input.email || input.username) {
            const existingUser = yield user_model_1.default.findOne({
                $and: [
                    { _id: { $ne: ctx.user.id } },
                    { $or: [
                            ...(input.email ? [{ email: input.email }] : []),
                            ...(input.username ? [{ username: input.username }] : [])
                        ] }
                ]
            });
            if (existingUser) {
                throw new server_1.TRPCError({
                    code: 'CONFLICT',
                    message: 'Email or username is already taken',
                });
            }
        }
        // Find and update user
        const user = yield user_model_1.default.findById(ctx.user.id);
        if (!user) {
            throw new server_1.TRPCError({
                code: 'NOT_FOUND',
                message: 'User not found',
            });
        }
        // Update fields if provided
        if (input.firstName)
            user.firstName = input.firstName;
        if (input.lastName)
            user.lastName = input.lastName;
        if (input.username)
            user.username = input.username;
        if (input.email)
            user.email = input.email;
        if (input.age !== undefined)
            user.age = input.age;
        if (input.avatar)
            user.avatar = input.avatar;
        // Save updated user
        const updatedUser = yield user.save();
        return formatUserResponse(updatedUser);
    })),
    /**
     * Change user password
     */
    changePassword: trpc_1.protectedProcedure
        .meta({
        openapi: {
            method: 'PUT',
            path: '/users/password',
            tags: ['users'],
            summary: 'Change user password',
        },
    })
        .input(user_schema_1.changePasswordSchema)
        .output(user_schema_1.userSchema.pick({ id: true }))
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        // Find user
        const user = yield user_model_1.default.findById(ctx.user.id);
        if (!user) {
            throw new server_1.TRPCError({
                code: 'NOT_FOUND',
                message: 'User not found',
            });
        }
        // Check if current password is correct
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
        return { id: user._id.toString() };
    })),
    /**
     * Get user preferences
     */
    getPreferences: trpc_1.protectedProcedure
        .meta({
        openapi: {
            method: 'GET',
            path: '/users/preferences',
            tags: ['users'],
            summary: 'Get user preferences',
        },
    })
        .input(emptyInputSchema)
        .output(user_schema_1.userSchema.pick({ preferences: true }))
        .query((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx }) {
        const user = yield user_model_1.default.findById(ctx.user.id).select('preferences');
        if (!user) {
            throw new server_1.TRPCError({
                code: 'NOT_FOUND',
                message: 'User not found',
            });
        }
        const preferences = {
            theme: user.preferences.theme,
            fontSize: user.preferences.fontSize,
            readingLevel: user.preferences.readingLevel,
            notificationSettings: user.preferences.notificationSettings
        };
        return { preferences };
    })),
    /**
     * Update user preferences
     */
    updatePreferences: trpc_1.protectedProcedure
        .meta({
        openapi: {
            method: 'PUT',
            path: '/users/preferences',
            tags: ['users'],
            summary: 'Update user preferences',
        },
    })
        .input(user_schema_1.updatePreferencesSchema)
        .output(user_schema_1.userSchema.pick({ preferences: true }))
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        // Find user
        const user = yield user_model_1.default.findById(ctx.user.id);
        if (!user) {
            throw new server_1.TRPCError({
                code: 'NOT_FOUND',
                message: 'User not found',
            });
        }
        // Update preferences if provided
        if (input.theme)
            user.preferences.theme = input.theme;
        if (input.fontSize)
            user.preferences.fontSize = input.fontSize;
        if (input.readingLevel)
            user.preferences.readingLevel = input.readingLevel;
        if (input.notificationSettings) {
            user.preferences.notificationSettings = Object.assign(Object.assign({}, user.preferences.notificationSettings), input.notificationSettings);
        }
        // Save updated user
        yield user.save();
        const preferences = {
            theme: user.preferences.theme,
            fontSize: user.preferences.fontSize,
            readingLevel: user.preferences.readingLevel,
            notificationSettings: user.preferences.notificationSettings
        };
        return { preferences };
    })),
});
