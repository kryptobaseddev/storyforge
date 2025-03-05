/**
 * Chapter Schemas
 * 
 * This file contains Zod schemas for validating chapter-related data.
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

// Schema for chapter status
export const chapterStatusEnum = z.enum(['Draft', 'Revised', 'Final', 'Needs Review']);

// Schema for edit history
export const chapterEditSchema = z.object({
  timestamp: z.date().default(() => new Date()),
  userId: objectIdSchema,
  changes: z.string()
});

// Schema for AI generation
export const aiGeneratedSchema = z.object({
  isGenerated: z.boolean().default(false),
  generatedTimestamp: z.date().optional(),
  prompt: z.string().optional(),
  model: z.string().optional()
});

// Schema for creating a chapter
export const createChapterSchema = z.object({
  projectId: objectIdSchema,
  title: z.string().min(1).max(100),
  position: z.number().min(0),
  synopsis: z.string().max(1000).default(''),
  content: z.string().default(''),
  status: chapterStatusEnum.default('Draft'),
  characters: z.array(objectIdSchema).default([]),
  settings: z.array(objectIdSchema).default([]),
  plotlines: z.array(objectIdSchema).default([]),
  objects: z.array(objectIdSchema).default([]),
  notes: z.string().optional(),
  aiGenerated: aiGeneratedSchema.optional().default({
    isGenerated: false
  })
});

// Schema for updating a chapter
export const updateChapterSchema = createChapterSchema.partial().omit({ projectId: true });

// Schema for updating chapter content only
export const updateChapterContentSchema = z.object({
  content: z.string(),
  wordCount: z.number().optional()
});

// Schema for adding an edit record
export const addChapterEditSchema = z.object({
  userId: objectIdSchema,
  changes: z.string()
});

// Schema for reordering chapters
export const reorderChaptersSchema = z.object({
  chapters: z.array(z.object({
    id: objectIdSchema,
    position: z.number().min(0)
  }))
});

// Full chapter schema (for responses)
export const chapterSchema = createChapterSchema.extend({
  id: objectIdSchema,
  wordCount: z.number().default(0),
  edits: z.array(chapterEditSchema).default([]),
  createdAt: z.date(),
  updatedAt: z.date()
});

// Schema for chapter list
export const chapterListSchema = z.array(chapterSchema);

// Types exported for use in router and other files
export type ChapterStatus = z.infer<typeof chapterStatusEnum>;
export type ChapterEdit = z.infer<typeof chapterEditSchema>;
export type AiGenerated = z.infer<typeof aiGeneratedSchema>;
export type CreateChapterInput = z.infer<typeof createChapterSchema>;
export type UpdateChapterInput = z.infer<typeof updateChapterSchema>;
export type UpdateChapterContentInput = z.infer<typeof updateChapterContentSchema>;
export type AddChapterEditInput = z.infer<typeof addChapterEditSchema>;
export type ReorderChaptersInput = z.infer<typeof reorderChaptersSchema>;
export type Chapter = z.infer<typeof chapterSchema>; 