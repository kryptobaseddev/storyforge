/**
 * Object Schemas
 * 
 * This file contains Zod schemas for validating object-related data.
 */

import { z } from 'zod';
import { ObjectId } from 'mongodb';
import {
  OBJECT_TYPES,
  CONNECTION_TYPES,
  PhysicalProperties,
  MagicalProperties,
  ObjectProperties,
  TimelineEvent,
  Connection
} from '../types/object.types';

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
export const objectTypeEnum = z.enum(OBJECT_TYPES);

// Connection type enum
export const connectionTypeEnum = z.enum(CONNECTION_TYPES);

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
  origin: z.string().default(''),
  energySource: z.string().optional().default(''),
  activationMethod: z.string().optional().default(''),
  sideEffects: z.array(z.string()).optional().default([]),
  rarity: z.string().optional().default('')
}).optional();

// Properties schema
export const propertiesSchema = z.object({
  physical: physicalPropertiesSchema,
  magical: magicalPropertiesSchema
});

// Timeline event schema
export const timelineEventSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  importance: z.number().min(1).max(10).default(5)
});

// Connection schema
export const connectionSchema = z.object({
  type: connectionTypeEnum,
  entityId: objectIdSchema,
  description: z.string().default('')
});

// Schema for creating an object
export const createObjectSchema = z.object({
  projectId: objectIdSchema,
  name: z.string().min(1, 'Name is required').max(100, 'Name cannot exceed 100 characters'),
  description: z.string().min(1, 'Description is required'),
  type: objectTypeEnum,
  significance: z.string().default(''),
  culturalSignificance: z.string().optional().default(''),
  properties: propertiesSchema.default({
    physical: {
      size: '',
      material: '',
      appearance: ''
    }
  }),
  history: z.string().default(''),
  timelineEvents: z.array(timelineEventSchema).optional().default([]),
  location: objectIdSchema.optional(),
  owner: objectIdSchema.optional(),
  connections: z.array(connectionSchema).optional().default([]),
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
export type CreateObjectInput = z.infer<typeof createObjectSchema>;
export type UpdateObjectInput = z.infer<typeof updateObjectSchema>;
export type ObjectResponse = z.infer<typeof objectSchema>; 