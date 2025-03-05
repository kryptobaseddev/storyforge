/**
 * AI Schemas
 * 
 * This file contains Zod schemas for validating AI-related data.
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

// Enums
export const aiTaskEnum = z.enum([
  'character',
  'plot',
  'setting',
  'chapter',
  'editorial'
]);

export const genreEnum = z.enum([
  'fantasy',
  'science fiction',
  'mystery',
  'adventure',
  'historical fiction',
  'realistic fiction',
  'horror',
  'comedy',
  'drama',
  'fairy tale',
  'fable',
  'superhero'
]);

export const audienceEnum = z.enum([
  'children',
  'middle grade',
  'young adult',
  'adult'
]);

export const contentFilterEnum = z.enum([
  'strict',
  'standard',
  'relaxed'
]);

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
  narrative_importance: z.enum(['protagonist', 'antagonist', 'supporting', 'minor']).optional()
});

// Plot generation request
export const plotGenerationSchema = aiGenerationBaseSchema.extend({
  task: z.literal('plot'),
  plot_points: z.array(z.string()).optional(),
  characters: z.array(z.string()).optional(),
  setting: z.string().optional(),
  conflict_type: z.string().optional(),
  desired_length: z.enum(['short', 'medium', 'long']).optional()
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
  focus_areas: z.array(
    z.enum(['pacing', 'character', 'plot', 'dialogue', 'description'])
  ).optional()
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
  size: z.enum(['1024x1024', '1024x1792', '1792x1024']).optional().default('1024x1024'),
  project_id: objectIdSchema,
  user_id: objectIdSchema
});

// Save generation request
export const saveGenerationSchema = z.object({
  generation_id: objectIdSchema
});

// AI generation response metadata
export const aiMetadataSchema = z.object({
  model: z.string(),
  timestamp: z.date().or(z.string()),
  token_usage: z.object({
    prompt: z.number(),
    completion: z.number(),
    total: z.number()
  })
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

// Type exports for use in router
export type AITask = z.infer<typeof aiTaskEnum>;
export type Genre = z.infer<typeof genreEnum>;
export type Audience = z.infer<typeof audienceEnum>;
export type ContentFilter = z.infer<typeof contentFilterEnum>;
export type ResponseFormat = z.infer<typeof responseFormatSchema>;
export type GenerateContentInput = z.infer<typeof generateContentSchema>;
export type GenerateImageInput = z.infer<typeof generateImageSchema>;
export type SaveGenerationInput = z.infer<typeof saveGenerationSchema>;
export type AIGeneration = z.infer<typeof aiGenerationSchema>;
export type AIGenerationList = z.infer<typeof aiGenerationListSchema>; 