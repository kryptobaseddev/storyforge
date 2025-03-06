"use strict";
/**
 * Chapter Schemas
 *
 * This file contains Zod schemas for validating chapter-related data.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.chapterListSchema = exports.chapterSchema = exports.reorderChaptersSchema = exports.addChapterEditSchema = exports.updateChapterContentSchema = exports.updateChapterSchema = exports.createChapterSchema = exports.aiGeneratedSchema = exports.chapterEditSchema = exports.chapterStatusEnum = void 0;
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
// Schema for chapter status
exports.chapterStatusEnum = zod_1.z.enum(['Draft', 'Revised', 'Final', 'Needs Review']);
// Schema for edit history
exports.chapterEditSchema = zod_1.z.object({
    timestamp: zod_1.z.date().default(() => new Date()),
    userId: objectIdSchema,
    changes: zod_1.z.string()
});
// Schema for AI generation
exports.aiGeneratedSchema = zod_1.z.object({
    isGenerated: zod_1.z.boolean().default(false),
    generatedTimestamp: zod_1.z.date().optional(),
    prompt: zod_1.z.string().optional(),
    model: zod_1.z.string().optional()
});
// Schema for creating a chapter
exports.createChapterSchema = zod_1.z.object({
    projectId: objectIdSchema,
    title: zod_1.z.string().min(1).max(100),
    position: zod_1.z.number().min(0),
    synopsis: zod_1.z.string().max(1000).default(''),
    content: zod_1.z.string().default(''),
    status: exports.chapterStatusEnum.default('Draft'),
    characters: zod_1.z.array(objectIdSchema).default([]),
    settings: zod_1.z.array(objectIdSchema).default([]),
    plotlines: zod_1.z.array(objectIdSchema).default([]),
    objects: zod_1.z.array(objectIdSchema).default([]),
    notes: zod_1.z.string().optional(),
    aiGenerated: exports.aiGeneratedSchema.optional().default({
        isGenerated: false
    })
});
// Schema for updating a chapter
exports.updateChapterSchema = exports.createChapterSchema.partial().omit({ projectId: true });
// Schema for updating chapter content only
exports.updateChapterContentSchema = zod_1.z.object({
    content: zod_1.z.string(),
    wordCount: zod_1.z.number().optional()
});
// Schema for adding an edit record
exports.addChapterEditSchema = zod_1.z.object({
    userId: objectIdSchema,
    changes: zod_1.z.string()
});
// Schema for reordering chapters
exports.reorderChaptersSchema = zod_1.z.object({
    chapters: zod_1.z.array(zod_1.z.object({
        id: objectIdSchema,
        position: zod_1.z.number().min(0)
    }))
});
// Full chapter schema (for responses)
exports.chapterSchema = exports.createChapterSchema.extend({
    id: objectIdSchema,
    wordCount: zod_1.z.number().default(0),
    edits: zod_1.z.array(exports.chapterEditSchema).default([]),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date()
});
// Schema for chapter list
exports.chapterListSchema = zod_1.z.array(exports.chapterSchema);
