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
  aiGenerationSchema,
  characterGenerationSchema,
  plotGenerationSchema,
  settingGenerationSchema,
  chapterGenerationSchema,
  editorialFeedbackSchema
} from '../schemas/ai.schema';
import AIGeneration, { IAIGeneration } from '../models/ai.model';
import { AIService } from '../ai/service';
import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';
import { AIRequest, AIResponse, TokenUsage } from '../types/ai.types';

// Initialize AI service with API key from environment variables
const aiService = new AIService(process.env.OPENAI_API_KEY || '');

// Helper function to convert AI generation document to response format
const formatAIGenerationResponse = (generation: IAIGeneration & Document) => {
  // Use type assertion to handle the _id property
  const docWithId = generation as unknown as { _id: { toString(): string } };
  
  return {
    id: docWithId._id.toString(),
    project_id: generation.projectId.toString(),
    user_id: generation.userId.toString(),
    task: generation.task,
    request_params: generation.requestParams,
    response_content: generation.responseContent,
    metadata: {
      model: generation.metadata.model,
      timestamp: generation.metadata.timestamp,
      token_usage: {
        prompt: generation.metadata.tokenUsage.prompt,
        completion: generation.metadata.tokenUsage.completion,
        total: generation.metadata.tokenUsage.total
      }
    },
    createdAt: generation.createdAt,
    isSaved: generation.isSaved,
    parentId: generation.parentId ? generation.parentId.toString() : undefined
  };
};

// Mock AI service for testing when no API key is available
const createMockAIResponse = (content: string): AIResponse => {
  return {
    content,
    metadata: {
      model: 'mock-model',
      timestamp: new Date().toISOString(),
      token_usage: {
        prompt: 100,
        completion: 200,
        total: 300
      }
    }
  };
};

export const aiRouter = router({
  // Generate AI content
  generateContent: protectedProcedure
    .input(generateContentSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Generate content using AI service
        const response = await aiService.generateContent(input as AIRequest);
        
        // Save the generation to the database
        const aiGeneration = new AIGeneration({
          projectId: new ObjectId(input.project_id),
          userId: new ObjectId(input.user_id),
          task: input.task,
          requestParams: input,
          responseContent: response.content,
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
  
  // Generate character specifically
  generateCharacter: protectedProcedure
    .input(characterGenerationSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        let response: AIResponse;
        
        if (process.env.OPENAI_API_KEY) {
          // Generate content using AI service
          response = await aiService.generateContent(input as AIRequest);
        } else {
          // Use mock response for testing
          response = createMockAIResponse(
            `Character description for ${input.name || 'Unnamed Character'}`
          );
        }
        
        // Save the generation to the database
        const aiGeneration = new AIGeneration({
          projectId: new ObjectId(input.project_id),
          userId: new ObjectId(input.user_id),
          task: 'character',
          requestParams: input,
          responseContent: response.content,
          metadata: response.metadata
        });
        
        await aiGeneration.save();
        
        // Return response
        return {
          ...response,
          generation_id: aiGeneration._id ? aiGeneration._id.toString() : ''
        };
      } catch (error) {
        console.error('Error generating character:', error);
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          cause: error
        });
      }
    }),
    
  // Generate plot specifically
  generatePlot: protectedProcedure
    .input(plotGenerationSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        let response: AIResponse;
        
        if (process.env.OPENAI_API_KEY) {
          // Generate content using AI service
          response = await aiService.generateContent(input as AIRequest);
        } else {
          // Use mock response for testing
          response = createMockAIResponse(
            `Plot outline for project ${input.project_id}`
          );
        }
        
        // Save the generation to the database
        const aiGeneration = new AIGeneration({
          projectId: new ObjectId(input.project_id),
          userId: new ObjectId(input.user_id),
          task: 'plot',
          requestParams: input,
          responseContent: response.content,
          metadata: response.metadata
        });
        
        await aiGeneration.save();
        
        // Return response
        return {
          ...response,
          generation_id: aiGeneration._id ? aiGeneration._id.toString() : ''
        };
      } catch (error) {
        console.error('Error generating plot:', error);
        
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
          projectId: new ObjectId(input.project_id),
          userId: new ObjectId(input.user_id),
          task: 'image',
          requestParams: { prompt: input.prompt, size: input.size },
          responseContent: imageUrl,
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
        generation.isSaved = true;
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
    
  // Toggle saved status
  toggleSaved: protectedProcedure
    .input(z.object({ generationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Find the generation
        const generation = await AIGeneration.findById(input.generationId);
        
        if (!generation) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'AI generation not found'
          });
        }
        
        // Toggle the saved status
        generation.isSaved = !generation.isSaved;
        await generation.save();
        
        // Return response
        return {
          message: `Generation saved status toggled to ${generation.isSaved}`,
          generation: formatAIGenerationResponse(generation)
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        
        console.error('Error toggling saved status:', error);
        
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
          projectId: new ObjectId(input.projectId)
        }).sort({ createdAt: -1 });
        
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
    }),
    
  // Delete a generation
  deleteGeneration: protectedProcedure
    .input(z.object({ generationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await AIGeneration.deleteOne({ 
          _id: new ObjectId(input.generationId) 
        });
        
        if (result.deletedCount === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'AI generation not found'
          });
        }
        
        return { 
          success: true,
          message: 'Generation deleted successfully' 
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        
        console.error('Error deleting generation:', error);
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          cause: error
        });
      }
    })
}); 