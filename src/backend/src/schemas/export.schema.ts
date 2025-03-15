/**
 * Export Schemas
 * 
 * This file contains Zod schemas for validating export-related data.
 */

import { z } from 'zod';
import { ObjectId } from 'mongodb';
import {
  EXPORT_FORMATS,
  EXPORT_STATUSES,
  PAGE_SIZES,
  ExportConfig
} from '../types/export.types';

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

// Export format enum
export const exportFormatEnum = z.enum(EXPORT_FORMATS);

// Export status enum
export const exportStatusEnum = z.enum(EXPORT_STATUSES);

// Page size options
export const pageSizeEnum = z.enum(PAGE_SIZES);

// Configuration schema
export const exportConfigSchema = z.object({
  includeChapters: z.array(objectIdSchema).optional().default([]),
  includeTitlePage: z.boolean().optional().default(true),
  includeTableOfContents: z.boolean().optional().default(true),
  includeCharacterList: z.boolean().optional().default(false),
  includeSettingDescriptions: z.boolean().optional().default(false),
  customCss: z.string().optional(),
  templateId: objectIdSchema.optional(),
  pageSize: pageSizeEnum.optional().default('A4'),
  fontFamily: z.string().optional().default('Times New Roman'),
  fontSize: z.number().optional().default(12)
});

// Input schema for creating an export
export const createExportSchema = z.object({
  format: exportFormatEnum,
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional().default(''),
  configuration: exportConfigSchema.optional().default({})
});

// Input schema for updating an export
export const updateExportSchema = createExportSchema.partial();

// Full export schema
export const exportSchema = z.object({
  id: objectIdSchema,
  projectId: objectIdSchema,
  userId: objectIdSchema,
  format: exportFormatEnum,
  name: z.string().min(1).max(100),
  description: z.string().max(500),
  status: exportStatusEnum,
  configuration: exportConfigSchema,
  fileUrl: z.string().optional(),
  errorMessage: z.string().optional(),
  completedAt: z.date().optional(),
  fileSize: z.number().optional(),
  downloadCount: z.number().default(0),
  createdAt: z.date(),
  updatedAt: z.date()
});

// List of exports
export const exportListSchema = z.array(exportSchema);

// Export ID input schema
export const exportIdSchema = z.object({
  id: objectIdSchema
});

// Projection ID input schema
export const projectIdSchema = z.object({
  projectId: objectIdSchema
});

// Type exports for use in router
export type CreateExportInput = z.infer<typeof createExportSchema>;
export type UpdateExportInput = z.infer<typeof updateExportSchema>;
export type Export = z.infer<typeof exportSchema>;
export type ExportList = z.infer<typeof exportListSchema>;
export type ExportIdInput = z.infer<typeof exportIdSchema>;
export type ProjectIdInput = z.infer<typeof projectIdSchema>; 