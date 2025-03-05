/**
 * AI Router
 * 
 * This router handles AI-related operations, including content generation,
 * image generation, and saving generated content.
 */

import { router, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { 
  generateContentSchema, 
  generateImageSchema, 
  saveGenerationSchema,
  aiGenerationSchema
} from '../schemas/ai.schema';
import AIGeneration, { IAIGeneration } from '../models/aiGeneration.model';
import { AIService } from '../ai/service';
import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';

// Initialize AI service with API key from environment variables
const aiService = new AIService(process.env.OPENAI_API_KEY || '');

// Helper function to convert AI generation document to response format
const formatAIGenerationResponse = (generation: IAIGeneration & Document) => {
  // Use type assertion to handle the _id property
  const docWithId = generation as unknown as { _id: { toString(): string } };
  
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

export const aiRouter = router({
  // Generate AI content
  generateContent: protectedProcedure
    .input(generateContentSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Generate content using AI service
        const response = await aiService.generateContent(input);
        
        // Save the generation to the database
        const aiGeneration = new AIGeneration({
          project_id: new ObjectId(input.project_id),
          user_id: new ObjectId(input.user_id),
          task: input.task,
          request_params: input,
          response_content: response.content,
          metadata: response.metadata
        });
        
        await aiGeneration.save();
        
        // Return response
        return {
          ...response,
          generation_id: aiGeneration._id ? aiGeneration._id.toString() : ''
        };
      } catch (error) {
        console.error('Error generating AI content:', error);
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          cause: error
        });
      }
    }),
  
  // Generate AI image
  generateImage: protectedProcedure
    .input(generateImageSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Generate image using AI service
        // Note: We'll cast the size to match what the service expects
        const imageUrl = await aiService.generateImage(
          input.prompt, 
          input.size as any
        );
        
        // Save the generation to the database
        const aiGeneration = new AIGeneration({
          project_id: new ObjectId(input.project_id),
          user_id: new ObjectId(input.user_id),
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
        
        await aiGeneration.save();
        
        // Return response
        return { 
          url: imageUrl,
          generation_id: aiGeneration._id ? aiGeneration._id.toString() : ''
        };
      } catch (error) {
        console.error('Error generating AI image:', error);
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          cause: error
        });
      }
    }),
  
  // Save AI generation
  saveGeneration: protectedProcedure
    .input(saveGenerationSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Find the generation
        const generation = await AIGeneration.findById(input.generation_id);
        
        if (!generation) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'AI generation not found'
          });
        }
        
        // Update the generation
        generation.is_saved = true;
        await generation.save();
        
        // Return response
        return {
          message: 'AI generation saved successfully',
          generation_id: input.generation_id
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        
        console.error('Error saving AI generation:', error);
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          cause: error
        });
      }
    }),
    
  // Get AI generations for a project
  getGenerationsForProject: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const generations = await AIGeneration.find({ 
          project_id: new ObjectId(input.projectId)
        }).sort({ created_at: -1 });
        
        return generations.map(formatAIGenerationResponse);
      } catch (error) {
        console.error('Error fetching AI generations:', error);
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          cause: error
        });
      }
    }),
    
  // Get AI generation by ID
  getGeneration: protectedProcedure
    .input(z.object({ generationId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const generation = await AIGeneration.findById(input.generationId);
        
        if (!generation) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'AI generation not found'
          });
        }
        
        return formatAIGenerationResponse(generation);
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        
        console.error('Error fetching AI generation:', error);
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          cause: error
        });
      }
    })
}); 