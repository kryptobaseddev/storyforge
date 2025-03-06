/**
 * User Schemas
 * 
 * This file contains Zod schemas for validating user-related data.
 */

import { z } from 'zod';
import { ObjectId } from 'mongodb';

// Helper function to validate ObjectId
const objectIdSchema = z.string().refine(
  (id) => {
    try {
      new ObjectId(id);
      return true;
    } catch {
      return false;
    }
  },
  {
    message: 'Invalid ObjectId format',
  }
);

// Schema for user preferences
export const userPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).default('light'),
  fontSize: z.number().min(8).max(32).default(16),
  readingLevel: z.enum(['elementary', 'middle grade', 'young adult', 'adult']).default('middle grade'),
  notificationSettings: z.record(z.boolean()).default({
    email: true,
    app: true
  })
});

// Schema for updating user profile
export const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  username: z.string().min(3).max(30).optional(),
  email: z.string().email().optional(),
  age: z.number().min(5).max(120).optional(),
  avatar: z.string().url().optional()
});

// Schema for changing password
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6).max(100)
});

// Schema for updating user preferences
export const updatePreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).optional(),
  fontSize: z.number().min(8).max(32).optional(),
  readingLevel: z.enum(['elementary', 'middle grade', 'young adult', 'adult']).optional(),
  notificationSettings: z.record(z.boolean()).optional()
});

// Full user schema (for responses)
export const userSchema = z.object({
  id: objectIdSchema,
  username: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  age: z.number().optional(),
  avatar: z.string().url().optional(),
  preferences: userPreferencesSchema,
  createdAt: z.date(),
  updatedAt: z.date()
});

// Schema for lists of users
export const userListSchema = z.array(userSchema);

// Types
export type UserPreferences = z.infer<typeof userPreferencesSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type UpdatePreferencesInput = z.infer<typeof updatePreferencesSchema>;
export type User = z.infer<typeof userSchema>; 