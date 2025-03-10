/**
 * Character schemas
 * 
 * This file contains Zod schemas for character-related data validation
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
 * Physical attributes schema
 */
export const physicalAttributesSchema = z.object({
  age: z.number().min(0).optional(),
  height: z.string().optional(),
  build: z.string().optional(),
  hairColor: z.string().optional(),
  eyeColor: z.string().optional(),
  distinguishingFeatures: z.array(z.string()).default([])
});

/**
 * Personality attributes schema
 */
export const personalityAttributesSchema = z.object({
  traits: z.array(z.string()).default([]),
  strengths: z.array(z.string()).default([]),
  weaknesses: z.array(z.string()).default([]),
  fears: z.array(z.string()).default([]),
  desires: z.array(z.string()).default([])
});

/**
 * Background attributes schema
 */
export const backgroundAttributesSchema = z.object({
  birthplace: z.string().optional(),
  family: z.string().optional(),
  education: z.string().optional(),
  occupation: z.string().optional(),
  significantEvents: z.array(z.string()).default([])
});

/**
 * Character attributes schema
 */
export const attributesSchema = z.object({
  physical: physicalAttributesSchema.default({}),
  personality: personalityAttributesSchema.default({}),
  background: backgroundAttributesSchema.default({}),
  motivation: z.string().optional(),
  arc: z.string().optional()
});

/**
 * Character relationship schema
 */
export const relationshipSchema = z.object({
  characterId: objectIdSchema,
  relationshipType: z.enum([
    'Friend', 
    'Enemy', 
    'Family', 
    'Romantic', 
    'Mentor', 
    'Colleague', 
    'Other'
  ]),
  notes: z.string().optional().default('')
});

/**
 * Create character schema
 */
export const createCharacterSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  shortDescription: z.string().optional().default(''),
  detailedBackground: z.string().optional().default(''),
  role: z.string().optional().default(''),
  attributes: attributesSchema.optional().default({}),
  relationships: z.array(relationshipSchema).optional().default([]),
  plotInvolvement: z.array(objectIdSchema).optional().default([]),
  possessions: z.array(objectIdSchema).optional().default([]),
  imageUrl: z.string().optional(),
  notes: z.string().optional()
});

export type CreateCharacterInput = z.infer<typeof createCharacterSchema>;

/**
 * Update character schema
 */
export const updateCharacterSchema = createCharacterSchema.partial();

export type UpdateCharacterInput = z.infer<typeof updateCharacterSchema>;

/**
 * Character response schema
 */
export const characterSchema = createCharacterSchema.extend({
  id: z.string(),
  projectId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type CharacterResponse = z.infer<typeof characterSchema>;

/**
 * Character list schema
 */
export const characterListSchema = z.array(characterSchema);

export type CharacterListResponse = z.infer<typeof characterListSchema>;

/**
 * Add relationship schema
 */
export const addRelationshipSchema = relationshipSchema;

export type AddRelationshipInput = z.infer<typeof addRelationshipSchema>;

/**
 * Relationship list schema
 */
export const relationshipListSchema = z.array(relationshipSchema);

export type RelationshipListResponse = z.infer<typeof relationshipListSchema>; 