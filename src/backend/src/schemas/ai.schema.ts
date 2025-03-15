/**
 * AI Schemas
 * 
 * This file contains Zod schemas for validating AI-related data.
 * These schemas use the type definitions from ai.types.ts.
 */

import { z } from 'zod';
import { ObjectId } from 'mongodb';
import {
  AI_TASK_TYPES,
  CONTENT_FILTER_LEVELS,
  AI_FOCUS_AREAS,
  AI_TARGET_LENGTH_TYPES,
  AI_IMAGE_SIZES,
  AIGenerationModel,
  TokenUsage,
  AIGenerationMetadata
} from '../types/ai.types';
import { PROJECT_GENRES, TARGET_AUDIENCES } from '../types/project.types';
import { CHARACTER_ROLES } from '../types/character.types';

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

// Schema for AI-generated content tracking
export const aiGeneratedSchema = z.object({
  isGenerated: z.boolean().default(false),
  generatedTimestamp: z.date().optional(),
  prompt: z.string().optional(),
  model: z.string().optional()
});

// Enums
export const aiTaskEnum = z.enum(AI_TASK_TYPES);
export const genreEnum = z.enum(PROJECT_GENRES);
export const audienceEnum = z.enum(TARGET_AUDIENCES);
export const contentFilterEnum = z.enum(CONTENT_FILTER_LEVELS);
export const aiFocusAreaEnum = z.enum(AI_FOCUS_AREAS);
export const aiTargetLengthEnum = z.enum(AI_TARGET_LENGTH_TYPES);
export const aiImageSizeEnum = z.enum(AI_IMAGE_SIZES);
export const narrativeImportanceEnum = z.enum(CHARACTER_ROLES);

// Response format options
export const responseFormatSchema = z.object({
  as_json: z.boolean().optional(),
  markdown_level: z.number().min(0).max(3).optional(),
  include_reasoning: z.boolean().optional()
});

// Base AI generation request
export const aiGenerationBaseSchema = z.object({
  project_id: objectIdSchema,
  user_id: objectIdSchema,
  genre: genreEnum.optional(),
  audience: audienceEnum.optional(),
  filter_level: contentFilterEnum.optional(),
  format_options: responseFormatSchema.optional(),
  max_tokens: z.number().min(1).max(4096).optional(),
  temperature: z.number().min(0).max(2).optional()
});

// Character generation request
export const characterGenerationSchema = aiGenerationBaseSchema.extend({
  task: z.literal('character'),
  name: z.string().optional(),
  role: z.string().optional(),
  age_range: z.string().optional(),
  key_traits: z.array(z.string()).optional(),
  related_characters: z.array(z.string()).optional(),
  narrative_importance: narrativeImportanceEnum.optional()
});

// Plot generation request
export const plotGenerationSchema = aiGenerationBaseSchema.extend({
  task: z.literal('plot'),
  plot_points: z.array(z.string()).optional(),
  characters: z.array(z.string()).optional(),
  setting: z.string().optional(),
  conflict_type: z.string().optional(),
  desired_length: aiTargetLengthEnum.optional()
});

// Setting generation request
export const settingGenerationSchema = aiGenerationBaseSchema.extend({
  task: z.literal('setting'),
  location_type: z.string().optional(),
  time_period: z.string().optional(),
  mood: z.string().optional(),
  key_features: z.array(z.string()).optional()
});

// Chapter generation request
export const chapterGenerationSchema = aiGenerationBaseSchema.extend({
  task: z.literal('chapter'),
  title: z.string().optional(),
  characters_present: z.array(z.string()).optional(),
  setting: z.string().optional(),
  previous_chapter_summary: z.string().optional(),
  goals: z.array(z.string()).optional(),
  word_count: z.number().optional()
});

// Editorial feedback request
export const editorialFeedbackSchema = aiGenerationBaseSchema.extend({
  task: z.literal('editorial'),
  content: z.string(),
  focus_areas: z.array(aiFocusAreaEnum).optional()
});

// Union of all AI generation requests
export const generateContentSchema = z.discriminatedUnion('task', [
  characterGenerationSchema,
  plotGenerationSchema,
  settingGenerationSchema,
  chapterGenerationSchema,
  editorialFeedbackSchema
]);

// Image generation request
export const generateImageSchema = z.object({
  prompt: z.string().min(1).max(1000),
  size: aiImageSizeEnum.optional().default('1024x1024'),
  project_id: objectIdSchema,
  user_id: objectIdSchema
});

// Save generation request
export const saveGenerationSchema = z.object({
  generation_id: objectIdSchema
});

// AI generation response token usage
export const tokenUsageSchema = z.object({
  prompt: z.number(),
  completion: z.number(),
  total: z.number()
});

// AI generation response metadata
export const aiMetadataSchema = z.object({
  model: z.string(),
  timestamp: z.date().or(z.string()),
  token_usage: tokenUsageSchema
});

// Full AI generation model with response
export const aiGenerationSchema = z.object({
  id: objectIdSchema,
  project_id: objectIdSchema,
  user_id: objectIdSchema,
  task: aiTaskEnum,
  request_params: z.record(z.any()),
  response_content: z.string(),
  metadata: aiMetadataSchema,
  created_at: z.date().or(z.string()),
  is_saved: z.boolean(),
  parent_id: objectIdSchema.optional()
});

// List of AI generations
export const aiGenerationListSchema = z.array(aiGenerationSchema);

// Export types that are used elsewhere in the app
export type GenerateContentInput = z.infer<typeof generateContentSchema>;
export type GenerateImageInput = z.infer<typeof generateImageSchema>;
export type SaveGenerationInput = z.infer<typeof saveGenerationSchema>;
export type AIGeneration = z.infer<typeof aiGenerationSchema>; 