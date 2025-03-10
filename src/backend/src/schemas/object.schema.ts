/**
 * Object Schemas
 * 
 * This file contains Zod schemas for validating object-related data.
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

// Object type enum
export const objectTypeEnum = z.enum([
  'Item',
  'Artifact',
  'Vehicle',
  'Weapon',
  'Tool',
  'Clothing',
  'Other'
]);

// Physical properties schema
export const physicalPropertiesSchema = z.object({
  size: z.string().default(''),
  material: z.string().default(''),
  appearance: z.string().default('')
});

// Magical properties schema
export const magicalPropertiesSchema = z.object({
  powers: z.array(z.string()).default([]),
  limitations: z.array(z.string()).default([]),
  origin: z.string().default('')
}).optional();

// Properties schema
export const propertiesSchema = z.object({
  physical: physicalPropertiesSchema,
  magical: magicalPropertiesSchema
});

// Schema for creating an object
export const createObjectSchema = z.object({
  projectId: objectIdSchema,
  name: z.string().min(1, 'Name is required').max(100, 'Name cannot exceed 100 characters'),
  description: z.string().min(1, 'Description is required'),
  type: objectTypeEnum,
  significance: z.string().default(''),
  properties: propertiesSchema.default({
    physical: {
      size: '',
      material: '',
      appearance: ''
    }
  }),
  history: z.string().default(''),
  location: objectIdSchema.optional(),
  owner: objectIdSchema.optional(),
  imageUrl: z.string().optional(),
  notes: z.string().optional()
});

// Schema for updating an object
export const updateObjectSchema = createObjectSchema.partial().omit({ projectId: true });

// Schema for a complete object (including id and timestamps)
export const objectSchema = createObjectSchema.extend({
  id: objectIdSchema,
  createdAt: z.date(),
  updatedAt: z.date()
});

// Schema for a list of objects
export const objectListSchema = z.array(objectSchema);

// Types exported for use in router and other files
export type ObjectType = z.infer<typeof objectTypeEnum>;
export type PhysicalProperties = z.infer<typeof physicalPropertiesSchema>;
export type MagicalProperties = z.infer<typeof magicalPropertiesSchema>;
export type Properties = z.infer<typeof propertiesSchema>;
export type CreateObjectInput = z.infer<typeof createObjectSchema>;
export type UpdateObjectInput = z.infer<typeof updateObjectSchema>;
export type Object = z.infer<typeof objectSchema>; 