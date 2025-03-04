/**
 * AI Controller
 * 
 * This controller handles AI-related functionality, including
 * content generation, image generation, and saving generated content.
 */

import { Request, Response } from 'express';
import { AIService } from '../ai/service';
import { AIRequest } from '../ai/types';
import AIGeneration from '../models/aiGeneration.model';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize AI service with API key from environment variables
const aiService = new AIService(process.env.OPENAI_API_KEY || '');

/**
 * Generate AI content
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const generateContent = async (req: Request, res: Response) => {
  try {
    const request: AIRequest = req.body;
    
    // Validate request
    if (!request.task) {
      return res.status(400).json({ 
        error: {
          code: 'invalid_request',
          message: 'Missing required field: task'
        }
      });
    }
    
    if (!request.project_id) {
      return res.status(400).json({ 
        error: {
          code: 'invalid_request',
          message: 'Missing required field: project_id'
        }
      });
    }
    
    if (!request.user_id) {
      return res.status(400).json({ 
        error: {
          code: 'invalid_request',
          message: 'Missing required field: user_id'
        }
      });
    }
    
    // Generate content
    const response = await aiService.generateContent(request);
    
    // Save the generation to the database
    const aiGeneration = new AIGeneration({
      project_id: request.project_id,
      user_id: request.user_id,
      task: request.task,
      request_params: request,
      response_content: response.content,
      metadata: response.metadata
    });
    
    await aiGeneration.save();
    
    // Return response
    return res.status(200).json({
      ...response,
      generation_id: aiGeneration._id
    });
  } catch (error) {
    console.error('Error generating AI content:', error);
    
    return res.status(500).json({
      error: {
        code: 'server_error',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        details: error
      }
    });
  }
};

/**
 * Generate AI image
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const generateImage = async (req: Request, res: Response) => {
  try {
    const { prompt, size, project_id, user_id } = req.body;
    
    // Validate request
    if (!prompt) {
      return res.status(400).json({ 
        error: {
          code: 'invalid_request',
          message: 'Missing required field: prompt'
        }
      });
    }
    
    if (!project_id) {
      return res.status(400).json({ 
        error: {
          code: 'invalid_request',
          message: 'Missing required field: project_id'
        }
      });
    }
    
    if (!user_id) {
      return res.status(400).json({ 
        error: {
          code: 'invalid_request',
          message: 'Missing required field: user_id'
        }
      });
    }
    
    // Generate image
    const imageUrl = await aiService.generateImage(prompt, size);
    
    // Save the generation to the database
    const aiGeneration = new AIGeneration({
      project_id,
      user_id,
      task: 'image',
      request_params: { prompt, size },
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
    return res.status(200).json({ 
      url: imageUrl,
      generation_id: aiGeneration._id
    });
  } catch (error) {
    console.error('Error generating AI image:', error);
    
    return res.status(500).json({
      error: {
        code: 'server_error',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        details: error
      }
    });
  }
};

/**
 * Save AI generation
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const saveGeneration = async (req: Request, res: Response) => {
  try {
    const { generation_id } = req.params;
    
    // Find the generation
    const generation = await AIGeneration.findById(generation_id);
    
    if (!generation) {
      return res.status(404).json({
        error: {
          code: 'not_found',
          message: 'AI generation not found'
        }
      });
    }
    
    // Update the generation
    generation.is_saved = true;
    await generation.save();
    
    // Return response
    return res.status(200).json({
      message: 'AI generation saved successfully',
      generation_id
    });
  } catch (error) {
    console.error('Error saving AI generation:', error);
    
    return res.status(500).json({
      error: {
        code: 'server_error',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        details: error
      }
    });
  }
}; 