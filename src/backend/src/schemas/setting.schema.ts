/**
 * Setting schemas
 * 
 * This file contains Zod schemas for setting-related data validation
 */

import { z } from 'zod';
import { ObjectId } from 'mongodb';

// Helper function to validate ObjectId strings
const objectIdSchema = z.string().refine(
  (id) => {
    try {
      return new ObjectId(id).toString() === id;
    } catch (error) {
      return false;
    }
  },
  {
    message: 'Invalid ObjectId format',
  }
);

/**
 * Setting details schema
 */
export const settingDetailsSchema = z.object({
  geography: z.string().optional().default(''),
  climate: z.string().optional().default(''),
  architecture: z.string().optional().default(''),
  culture: z.string().optional().default(''),
  history: z.string().optional().default(''),
  government: z.string().optional().default(''),
  economy: z.string().optional().default(''),
  technology: z.string().optional().default('')
});

/**
 * Map schema
 */
export const mapSchema = z.object({
  imageUrl: z.string(),
  coordinates: z.any().optional()
});

/**
 * Create setting schema
 */
export const createSettingSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().optional().default(''),
  type: z.enum([
    'City', 
    'Country', 
    'Planet', 
    'Building', 
    'Landscape', 
    'Region', 
    'World', 
    'Room', 
    'Other'
  ]),
  details: settingDetailsSchema.optional().default({}),
  map: mapSchema.optional(),
  relatedSettings: z.array(objectIdSchema).optional().default([]),
  characters: z.array(objectIdSchema).optional().default([]),
  objects: z.array(objectIdSchema).optional().default([]),
  imageUrl: z.string().optional(),
  notes: z.string().optional()
});

export type CreateSettingInput = z.infer<typeof createSettingSchema>;

/**
 * Update setting schema
 */
export const updateSettingSchema = createSettingSchema.partial();

export type UpdateSettingInput = z.infer<typeof updateSettingSchema>;

/**
 * Setting response schema
 */
export const settingSchema = createSettingSchema.extend({
  id: z.string(),
  projectId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type SettingResponse = z.infer<typeof settingSchema>;

/**
 * Setting list schema
 */
export const settingListSchema = z.array(settingSchema);

export type SettingListResponse = z.infer<typeof settingListSchema>;

/**
 * Upload map schema
 */
export const uploadMapSchema = z.object({
  imageUrl: z.string(),
  coordinates: z.any().optional()
});

export type UploadMapInput = z.infer<typeof uploadMapSchema>; 