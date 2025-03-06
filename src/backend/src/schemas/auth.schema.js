"use strict";
/**
 * Authentication schemas
 *
 * This file contains Zod schemas for authentication-related data validation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.changePasswordSchema = exports.refreshTokenSchema = exports.authResponseSchema = exports.userProfileSchema = exports.userPreferencesSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
/**
 * User registration schema
 */
exports.registerSchema = zod_1.z.object({
    username: zod_1.z.string().min(3, 'Username must be at least 3 characters'),
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters'),
    firstName: zod_1.z.string().optional(),
    lastName: zod_1.z.string().optional(),
    age: zod_1.z.number().min(5).max(100).optional(),
});
/**
 * User login schema
 */
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(1, 'Password is required'),
});
/**
 * User preferences schema
 */
exports.userPreferencesSchema = zod_1.z.object({
    theme: zod_1.z.string(),
    fontSize: zod_1.z.number(),
    readingLevel: zod_1.z.string(),
    notificationSettings: zod_1.z.record(zod_1.z.any()), // Use record for flexibility
});
/**
 * User profile schema (response)
 */
exports.userProfileSchema = zod_1.z.object({
    id: zod_1.z.string(),
    username: zod_1.z.string(),
    email: zod_1.z.string().email(),
    firstName: zod_1.z.string().nullable(),
    lastName: zod_1.z.string().nullable(),
    age: zod_1.z.number().nullable(),
    preferences: exports.userPreferencesSchema,
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
/**
 * Authentication response schema
 */
exports.authResponseSchema = zod_1.z.object({
    user: exports.userProfileSchema,
    token: zod_1.z.string(),
});
/**
 * Token refresh schema
 */
exports.refreshTokenSchema = zod_1.z.object({
    token: zod_1.z.string(),
});
/**
 * Change password schema
 */
exports.changePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(1, 'Current password is required'),
    newPassword: zod_1.z.string().min(8, 'New password must be at least 8 characters'),
});
/**
 * Forgot password schema
 */
exports.forgotPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
});
/**
 * Reset password schema
 */
exports.resetPasswordSchema = zod_1.z.object({
    token: zod_1.z.string(),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters'),
});
