"use strict";
/**
 * AI Router
 *
 * This router handles AI-related operations, including content generation,
 * image generation, and saving generated content.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiRouter = void 0;
const trpc_1 = require("../trpc");
const server_1 = require("@trpc/server");
const zod_1 = require("zod");
const ai_schema_1 = require("../schemas/ai.schema");
const aiGeneration_model_1 = __importDefault(require("../models/aiGeneration.model"));
const service_1 = require("../ai/service");
const mongodb_1 = require("mongodb");
// Initialize AI service with API key from environment variables
const aiService = new service_1.AIService(process.env.OPENAI_API_KEY || '');
// Helper function to convert AI generation document to response format
const formatAIGenerationResponse = (generation) => {
    // Use type assertion to handle the _id property
    const docWithId = generation;
    return {
        id: docWithId._id.toString(),
        project_id: generation.project_id.toString(),
        user_id: generation.user_id.toString(),
        task: generation.task,
        request_params: generation.request_params,
        response_content: generation.response_content,
        metadata: {
            model: generation.metadata.model,
            timestamp: generation.metadata.timestamp,
            token_usage: {
                prompt: generation.metadata.token_usage.prompt,
                completion: generation.metadata.token_usage.completion,
                total: generation.metadata.token_usage.total
            }
        },
        created_at: generation.created_at,
        is_saved: generation.is_saved,
        parent_id: generation.parent_id ? generation.parent_id.toString() : undefined
    };
};
exports.aiRouter = (0, trpc_1.router)({
    // Generate AI content
    generateContent: trpc_1.protectedProcedure
        .input(ai_schema_1.generateContentSchema)
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        try {
            // Generate content using AI service
            const response = yield aiService.generateContent(input);
            // Save the generation to the database
            const aiGeneration = new aiGeneration_model_1.default({
                project_id: new mongodb_1.ObjectId(input.project_id),
                user_id: new mongodb_1.ObjectId(input.user_id),
                task: input.task,
                request_params: input,
                response_content: response.content,
                metadata: response.metadata
            });
            yield aiGeneration.save();
            // Return response
            return Object.assign(Object.assign({}, response), { generation_id: aiGeneration._id ? aiGeneration._id.toString() : '' });
        }
        catch (error) {
            console.error('Error generating AI content:', error);
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error instanceof Error ? error.message : 'Unknown error occurred',
                cause: error
            });
        }
    })),
    // Generate AI image
    generateImage: trpc_1.protectedProcedure
        .input(ai_schema_1.generateImageSchema)
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        try {
            // Generate image using AI service
            // Note: We'll cast the size to match what the service expects
            const imageUrl = yield aiService.generateImage(input.prompt, input.size);
            // Save the generation to the database
            const aiGeneration = new aiGeneration_model_1.default({
                project_id: new mongodb_1.ObjectId(input.project_id),
                user_id: new mongodb_1.ObjectId(input.user_id),
                task: 'image',
                request_params: { prompt: input.prompt, size: input.size },
                response_content: imageUrl,
                metadata: {
                    model: 'dall-e-3',
                    timestamp: new Date(),
                    token_usage: {
                        prompt: 0,
                        completion: 0,
                        total: 0
                    }
                }
            });
            yield aiGeneration.save();
            // Return response
            return {
                url: imageUrl,
                generation_id: aiGeneration._id ? aiGeneration._id.toString() : ''
            };
        }
        catch (error) {
            console.error('Error generating AI image:', error);
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error instanceof Error ? error.message : 'Unknown error occurred',
                cause: error
            });
        }
    })),
    // Save AI generation
    saveGeneration: trpc_1.protectedProcedure
        .input(ai_schema_1.saveGenerationSchema)
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        try {
            // Find the generation
            const generation = yield aiGeneration_model_1.default.findById(input.generation_id);
            if (!generation) {
                throw new server_1.TRPCError({
                    code: 'NOT_FOUND',
                    message: 'AI generation not found'
                });
            }
            // Update the generation
            generation.is_saved = true;
            yield generation.save();
            // Return response
            return {
                message: 'AI generation saved successfully',
                generation_id: input.generation_id
            };
        }
        catch (error) {
            if (error instanceof server_1.TRPCError) {
                throw error;
            }
            console.error('Error saving AI generation:', error);
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error instanceof Error ? error.message : 'Unknown error occurred',
                cause: error
            });
        }
    })),
    // Get AI generations for a project
    getGenerationsForProject: trpc_1.protectedProcedure
        .input(zod_1.z.object({ projectId: zod_1.z.string() }))
        .query((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        try {
            const generations = yield aiGeneration_model_1.default.find({
                project_id: new mongodb_1.ObjectId(input.projectId)
            }).sort({ created_at: -1 });
            return generations.map(formatAIGenerationResponse);
        }
        catch (error) {
            console.error('Error fetching AI generations:', error);
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error instanceof Error ? error.message : 'Unknown error occurred',
                cause: error
            });
        }
    })),
    // Get AI generation by ID
    getGeneration: trpc_1.protectedProcedure
        .input(zod_1.z.object({ generationId: zod_1.z.string() }))
        .query((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        try {
            const generation = yield aiGeneration_model_1.default.findById(input.generationId);
            if (!generation) {
                throw new server_1.TRPCError({
                    code: 'NOT_FOUND',
                    message: 'AI generation not found'
                });
            }
            return formatAIGenerationResponse(generation);
        }
        catch (error) {
            if (error instanceof server_1.TRPCError) {
                throw error;
            }
            console.error('Error fetching AI generation:', error);
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error instanceof Error ? error.message : 'Unknown error occurred',
                cause: error
            });
        }
    }))
});
