"use strict";
/**
 * Project schemas
 *
 * This file contains Zod schemas for project-related data validation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.collaboratorListSchema = exports.addCollaboratorSchema = exports.projectListSchema = exports.projectSchema = exports.updateProjectSchema = exports.createProjectSchema = exports.projectMetadataSchema = exports.collaboratorSchema = exports.targetLengthSchema = void 0;
const zod_1 = require("zod");
const mongodb_1 = require("mongodb");
// Helper function to validate ObjectId strings
const objectIdSchema = zod_1.z.string().refine((id) => {
    try {
        return new mongodb_1.ObjectId(id).toString() === id;
    }
    catch (error) {
        return false;
    }
}, {
    message: 'Invalid ObjectId format',
});
/**
 * Target length schema
 */
exports.targetLengthSchema = zod_1.z.object({
    type: zod_1.z.enum(['Words', 'Pages', 'Chapters']),
    value: zod_1.z.number().min(0)
});
/**
 * Collaborator schema
 */
exports.collaboratorSchema = zod_1.z.object({
    userId: objectIdSchema,
    role: zod_1.z.enum(['Editor', 'Viewer', 'Contributor'])
});
/**
 * Project metadata schema
 */
exports.projectMetadataSchema = zod_1.z.object({
    createdWithTemplate: zod_1.z.boolean().default(false),
    templateId: objectIdSchema.optional(),
    tags: zod_1.z.array(zod_1.z.string()).default([])
});
/**
 * Project create schema
 */
exports.createProjectSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
    description: zod_1.z.string().optional().default(''),
    genre: zod_1.z.enum([
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
    ], { errorMap: () => ({ message: 'Invalid genre' }) }),
    targetAudience: zod_1.z.enum(['children', 'middle grade', 'young adult', 'adult'], { errorMap: () => ({ message: 'Invalid target audience' }) }),
    narrativeType: zod_1.z.enum(['Short Story', 'Novel', 'Screenplay', 'Comic', 'Poem'], { errorMap: () => ({ message: 'Invalid narrative type' }) }),
    tone: zod_1.z.enum(['Serious', 'Humorous', 'Educational', 'Dramatic', 'Neutral', 'Uplifting'])
        .optional().default('Neutral'),
    style: zod_1.z.enum(['Descriptive', 'Dialogue-heavy', 'Action-oriented', 'Poetic', 'Neutral'])
        .optional().default('Neutral'),
    targetLength: exports.targetLengthSchema.optional().default({ type: 'Words', value: 0 }),
    metadata: exports.projectMetadataSchema.optional().default({ createdWithTemplate: false, tags: [] })
});
/**
 * Project update schema
 */
exports.updateProjectSchema = exports.createProjectSchema.partial().extend({
    status: zod_1.z.enum(['Draft', 'In Progress', 'Completed', 'Archived']).optional(),
    completionDate: zod_1.z.date().nullable().optional(),
    isPublic: zod_1.z.boolean().optional()
});
/**
 * Project response schema
 */
exports.projectSchema = exports.createProjectSchema.extend({
    id: zod_1.z.string(),
    userId: zod_1.z.string(),
    status: zod_1.z.enum(['Draft', 'In Progress', 'Completed', 'Archived']).default('Draft'),
    collaborators: zod_1.z.array(exports.collaboratorSchema).default([]),
    completionDate: zod_1.z.date().nullable().optional(),
    isPublic: zod_1.z.boolean().default(false),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date()
});
/**
 * Project list response schema
 */
exports.projectListSchema = zod_1.z.array(exports.projectSchema);
/**
 * Add collaborator schema
 */
exports.addCollaboratorSchema = zod_1.z.object({
    userId: objectIdSchema,
    role: zod_1.z.enum(['Editor', 'Viewer', 'Contributor'])
});
/**
 * Collaborator list response schema
 */
exports.collaboratorListSchema = zod_1.z.array(exports.collaboratorSchema);
