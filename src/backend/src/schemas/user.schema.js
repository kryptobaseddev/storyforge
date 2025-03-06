"use strict";
/**
 * User Schemas
 *
 * This file contains Zod schemas for validating user-related data.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.userListSchema = exports.userSchema = exports.updatePreferencesSchema = exports.changePasswordSchema = exports.updateProfileSchema = exports.userPreferencesSchema = void 0;
const zod_1 = require("zod");
const mongodb_1 = require("mongodb");
// Helper function to validate ObjectId
const objectIdSchema = zod_1.z.string().refine((id) => {
    try {
        new mongodb_1.ObjectId(id);
        return true;
    }
    catch (_a) {
        return false;
    }
}, {
    message: 'Invalid ObjectId format',
});
// Schema for user preferences
exports.userPreferencesSchema = zod_1.z.object({
    theme: zod_1.z.enum(['light', 'dark', 'system']).default('light'),
    fontSize: zod_1.z.number().min(8).max(32).default(16),
    readingLevel: zod_1.z.enum(['elementary', 'middle grade', 'young adult', 'adult']).default('middle grade'),
    notificationSettings: zod_1.z.record(zod_1.z.boolean()).default({
        email: true,
        app: true
    })
});
// Schema for updating user profile
exports.updateProfileSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1).max(50).optional(),
    lastName: zod_1.z.string().min(1).max(50).optional(),
    username: zod_1.z.string().min(3).max(30).optional(),
    email: zod_1.z.string().email().optional(),
    age: zod_1.z.number().min(5).max(120).optional(),
    avatar: zod_1.z.string().url().optional()
});
// Schema for changing password
exports.changePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(6),
    newPassword: zod_1.z.string().min(6).max(100)
});
// Schema for updating user preferences
exports.updatePreferencesSchema = zod_1.z.object({
    theme: zod_1.z.enum(['light', 'dark', 'system']).optional(),
    fontSize: zod_1.z.number().min(8).max(32).optional(),
    readingLevel: zod_1.z.enum(['elementary', 'middle grade', 'young adult', 'adult']).optional(),
    notificationSettings: zod_1.z.record(zod_1.z.boolean()).optional()
});
// Full user schema (for responses)
exports.userSchema = zod_1.z.object({
    id: objectIdSchema,
    username: zod_1.z.string(),
    email: zod_1.z.string().email(),
    firstName: zod_1.z.string(),
    lastName: zod_1.z.string(),
    age: zod_1.z.number().optional(),
    avatar: zod_1.z.string().url().optional(),
    preferences: exports.userPreferencesSchema,
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date()
});
// Schema for lists of users
exports.userListSchema = zod_1.z.array(exports.userSchema);
