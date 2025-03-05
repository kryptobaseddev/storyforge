/**
 * Authentication schemas
 * 
 * This file contains Zod schemas for authentication-related data validation
 */

import { z } from 'zod';

/**
 * User registration schema
 */
export const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  age: z.number().min(5).max(100).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * User login schema
 */
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * User preferences schema
 */
export const userPreferencesSchema = z.object({
  theme: z.string(),
  fontSize: z.number(),
  readingLevel: z.string(),
  notificationSettings: z.record(z.any()), // Use record for flexibility
});

export type UserPreferences = z.infer<typeof userPreferencesSchema>;

/**
 * User profile schema (response)
 */
export const userProfileSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string().email(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  age: z.number().nullable(),
  preferences: userPreferencesSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserProfile = z.infer<typeof userProfileSchema>;

/**
 * Authentication response schema
 */
export const authResponseSchema = z.object({
  user: userProfileSchema,
  token: z.string(),
});

export type AuthResponse = z.infer<typeof authResponseSchema>;

/**
 * Token refresh schema
 */
export const refreshTokenSchema = z.object({
  token: z.string(),
});

export type RefreshTokenResponse = z.infer<typeof refreshTokenSchema>;

/**
 * Change password schema
 */
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

/**
 * Forgot password schema
 */
export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

/**
 * Reset password schema
 */
export const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>; 