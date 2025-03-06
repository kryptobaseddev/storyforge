"use strict";
/**
 * AI Schemas
 *
 * This file contains Zod schemas for validating AI-related data.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiGenerationListSchema = exports.aiGenerationSchema = exports.aiMetadataSchema = exports.saveGenerationSchema = exports.generateImageSchema = exports.generateContentSchema = exports.editorialFeedbackSchema = exports.chapterGenerationSchema = exports.settingGenerationSchema = exports.plotGenerationSchema = exports.characterGenerationSchema = exports.aiGenerationBaseSchema = exports.responseFormatSchema = exports.contentFilterEnum = exports.audienceEnum = exports.genreEnum = exports.aiTaskEnum = void 0;
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
// Enums
exports.aiTaskEnum = zod_1.z.enum([
    'character',
    'plot',
    'setting',
    'chapter',
    'editorial'
]);
exports.genreEnum = zod_1.z.enum([
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
exports.audienceEnum = zod_1.z.enum([
    'children',
    'middle grade',
    'young adult',
    'adult'
]);
exports.contentFilterEnum = zod_1.z.enum([
    'strict',
    'standard',
    'relaxed'
]);
// Response format options
exports.responseFormatSchema = zod_1.z.object({
    as_json: zod_1.z.boolean().optional(),
    markdown_level: zod_1.z.number().min(0).max(3).optional(),
    include_reasoning: zod_1.z.boolean().optional()
});
// Base AI generation request
exports.aiGenerationBaseSchema = zod_1.z.object({
    project_id: objectIdSchema,
    user_id: objectIdSchema,
    genre: exports.genreEnum.optional(),
    audience: exports.audienceEnum.optional(),
    filter_level: exports.contentFilterEnum.optional(),
    format_options: exports.responseFormatSchema.optional(),
    max_tokens: zod_1.z.number().min(1).max(4096).optional(),
    temperature: zod_1.z.number().min(0).max(2).optional()
});
// Character generation request
exports.characterGenerationSchema = exports.aiGenerationBaseSchema.extend({
    task: zod_1.z.literal('character'),
    name: zod_1.z.string().optional(),
    role: zod_1.z.string().optional(),
    age_range: zod_1.z.string().optional(),
    key_traits: zod_1.z.array(zod_1.z.string()).optional(),
    related_characters: zod_1.z.array(zod_1.z.string()).optional(),
    narrative_importance: zod_1.z.enum(['protagonist', 'antagonist', 'supporting', 'minor']).optional()
});
// Plot generation request
exports.plotGenerationSchema = exports.aiGenerationBaseSchema.extend({
    task: zod_1.z.literal('plot'),
    plot_points: zod_1.z.array(zod_1.z.string()).optional(),
    characters: zod_1.z.array(zod_1.z.string()).optional(),
    setting: zod_1.z.string().optional(),
    conflict_type: zod_1.z.string().optional(),
    desired_length: zod_1.z.enum(['short', 'medium', 'long']).optional()
});
// Setting generation request
exports.settingGenerationSchema = exports.aiGenerationBaseSchema.extend({
    task: zod_1.z.literal('setting'),
    location_type: zod_1.z.string().optional(),
    time_period: zod_1.z.string().optional(),
    mood: zod_1.z.string().optional(),
    key_features: zod_1.z.array(zod_1.z.string()).optional()
});
// Chapter generation request
exports.chapterGenerationSchema = exports.aiGenerationBaseSchema.extend({
    task: zod_1.z.literal('chapter'),
    title: zod_1.z.string().optional(),
    characters_present: zod_1.z.array(zod_1.z.string()).optional(),
    setting: zod_1.z.string().optional(),
    previous_chapter_summary: zod_1.z.string().optional(),
    goals: zod_1.z.array(zod_1.z.string()).optional(),
    word_count: zod_1.z.number().optional()
});
// Editorial feedback request
exports.editorialFeedbackSchema = exports.aiGenerationBaseSchema.extend({
    task: zod_1.z.literal('editorial'),
    content: zod_1.z.string(),
    focus_areas: zod_1.z.array(zod_1.z.enum(['pacing', 'character', 'plot', 'dialogue', 'description'])).optional()
});
// Union of all AI generation requests
exports.generateContentSchema = zod_1.z.discriminatedUnion('task', [
    exports.characterGenerationSchema,
    exports.plotGenerationSchema,
    exports.settingGenerationSchema,
    exports.chapterGenerationSchema,
    exports.editorialFeedbackSchema
]);
// Image generation request
exports.generateImageSchema = zod_1.z.object({
    prompt: zod_1.z.string().min(1).max(1000),
    size: zod_1.z.enum(['1024x1024', '1024x1792', '1792x1024']).optional().default('1024x1024'),
    project_id: objectIdSchema,
    user_id: objectIdSchema
});
// Save generation request
exports.saveGenerationSchema = zod_1.z.object({
    generation_id: objectIdSchema
});
// AI generation response metadata
exports.aiMetadataSchema = zod_1.z.object({
    model: zod_1.z.string(),
    timestamp: zod_1.z.date().or(zod_1.z.string()),
    token_usage: zod_1.z.object({
        prompt: zod_1.z.number(),
        completion: zod_1.z.number(),
        total: zod_1.z.number()
    })
});
// Full AI generation model with response
exports.aiGenerationSchema = zod_1.z.object({
    id: objectIdSchema,
    project_id: objectIdSchema,
    user_id: objectIdSchema,
    task: exports.aiTaskEnum,
    request_params: zod_1.z.record(zod_1.z.any()),
    response_content: zod_1.z.string(),
    metadata: exports.aiMetadataSchema,
    created_at: zod_1.z.date().or(zod_1.z.string()),
    is_saved: zod_1.z.boolean(),
    parent_id: objectIdSchema.optional()
});
// List of AI generations
exports.aiGenerationListSchema = zod_1.z.array(exports.aiGenerationSchema);
