"use strict";
/**
 * Export Schemas
 *
 * This file contains Zod schemas for validating export-related data.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectIdSchema = exports.exportIdSchema = exports.exportListSchema = exports.exportSchema = exports.updateExportSchema = exports.createExportSchema = exports.exportConfigSchema = exports.pageSizeEnum = exports.exportStatusEnum = exports.exportFormatEnum = void 0;
const zod_1 = require("zod");
const mongodb_1 = require("mongodb");
// Helper function to validate ObjectId
const objectIdSchema = zod_1.z.string().refine((id) => {
    try {
        new mongodb_1.ObjectId(id);
        return true;
    }
    catch (_a) {
        return false;
    }
}, {
    message: 'Invalid ObjectId format',
});
// Export format enum
exports.exportFormatEnum = zod_1.z.enum([
    'PDF',
    'EPUB',
    'DOCX',
    'Markdown',
    'HTML'
]);
// Export status enum
exports.exportStatusEnum = zod_1.z.enum([
    'Pending',
    'Processing',
    'Completed',
    'Failed'
]);
// Page size options
exports.pageSizeEnum = zod_1.z.enum([
    'A4',
    'A5',
    'Letter',
    'Legal',
    'Custom'
]);
// Configuration schema
exports.exportConfigSchema = zod_1.z.object({
    includeChapters: zod_1.z.array(objectIdSchema).optional().default([]),
    includeTitlePage: zod_1.z.boolean().optional().default(true),
    includeTableOfContents: zod_1.z.boolean().optional().default(true),
    includeCharacterList: zod_1.z.boolean().optional().default(false),
    includeSettingDescriptions: zod_1.z.boolean().optional().default(false),
    customCss: zod_1.z.string().optional(),
    templateId: objectIdSchema.optional(),
    pageSize: exports.pageSizeEnum.optional().default('A4'),
    fontFamily: zod_1.z.string().optional().default('Times New Roman'),
    fontSize: zod_1.z.number().optional().default(12)
});
// Input schema for creating an export
exports.createExportSchema = zod_1.z.object({
    format: exports.exportFormatEnum,
    name: zod_1.z.string().min(1).max(100),
    description: zod_1.z.string().max(500).optional().default(''),
    configuration: exports.exportConfigSchema.optional().default({})
});
// Input schema for updating an export
exports.updateExportSchema = exports.createExportSchema.partial();
// Full export schema
exports.exportSchema = zod_1.z.object({
    id: objectIdSchema,
    projectId: objectIdSchema,
    userId: objectIdSchema,
    format: exports.exportFormatEnum,
    name: zod_1.z.string().min(1).max(100),
    description: zod_1.z.string().max(500),
    status: exports.exportStatusEnum,
    configuration: exports.exportConfigSchema,
    fileUrl: zod_1.z.string().optional(),
    errorMessage: zod_1.z.string().optional(),
    completedAt: zod_1.z.date().optional(),
    fileSize: zod_1.z.number().optional(),
    downloadCount: zod_1.z.number().default(0),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date()
});
// List of exports
exports.exportListSchema = zod_1.z.array(exports.exportSchema);
// Export ID input schema
exports.exportIdSchema = zod_1.z.object({
    id: objectIdSchema
});
// Projection ID input schema
exports.projectIdSchema = zod_1.z.object({
    projectId: objectIdSchema
});
