/**
 * Project schemas
 * 
 * This file contains Zod schemas for project-related data validation
 */

import { z } from 'zod';
import { ObjectId } from 'mongodb';
import {
  PROJECT_GENRES,
  TARGET_AUDIENCES,
  NARRATIVE_TYPES,
  TONES,
  STYLES,
  PROJECT_STATUSES,
  TARGET_LENGTH_TYPES,
  COLLABORATOR_ROLES,
  TargetLength,
  ProjectCollaborator,
  ProjectMetadata
} from '../types/project.types';

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
 * Target length schema
 */
export const targetLengthSchema = z.object({
  type: z.enum(TARGET_LENGTH_TYPES),
  value: z.number().min(0)
});

/**
 * Collaborator schema
 */
export const collaboratorSchema = z.object({
  userId: objectIdSchema,
  role: z.enum(COLLABORATOR_ROLES)
});

/**
 * Project metadata schema
 */
export const projectMetadataSchema = z.object({
  createdWithTemplate: z.boolean().default(false),
  templateId: objectIdSchema.optional(),
  tags: z.array(z.string()).default([])
});

/**
 * Project create schema
 */
export const createProjectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().optional().default(''),
  genre: z.enum(PROJECT_GENRES, { errorMap: () => ({ message: 'Invalid genre' }) }),
  targetAudience: z.enum(TARGET_AUDIENCES, { errorMap: () => ({ message: 'Invalid target audience' }) }),
  narrativeType: z.enum(NARRATIVE_TYPES, { errorMap: () => ({ message: 'Invalid narrative type' }) }),
  tone: z.enum(TONES).optional().default('Neutral'),
  style: z.enum(STYLES).optional().default('Neutral'),
  targetLength: targetLengthSchema.optional().default({ type: 'Words', value: 0 }),
  metadata: projectMetadataSchema.optional().default({ createdWithTemplate: false, tags: [] })
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

/**
 * Project update schema
 */
export const updateProjectSchema = createProjectSchema.partial().extend({
  status: z.enum(PROJECT_STATUSES).optional(),
  completionDate: z.date().nullable().optional(),
  isPublic: z.boolean().optional()
});

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

/**
 * Project response schema
 */
export const projectSchema = createProjectSchema.extend({
  id: z.string(),
  userId: z.string(),
  status: z.enum(PROJECT_STATUSES).default('Draft'),
  collaborators: z.array(collaboratorSchema).default([]),
  completionDate: z.date().nullable().optional(),
  isPublic: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type ProjectResponse = z.infer<typeof projectSchema>;

/**
 * Project list response schema
 */
export const projectListSchema = z.array(projectSchema);

export type ProjectListResponse = z.infer<typeof projectListSchema>;

/**
 * Add collaborator schema
 */
export const addCollaboratorSchema = z.object({
  userId: objectIdSchema,
  role: z.enum(COLLABORATOR_ROLES)
});

export type AddCollaboratorInput = z.infer<typeof addCollaboratorSchema>;

/**
 * Collaborator list response schema
 */
export const collaboratorListSchema = z.array(collaboratorSchema);

export type CollaboratorListResponse = z.infer<typeof collaboratorListSchema>; 