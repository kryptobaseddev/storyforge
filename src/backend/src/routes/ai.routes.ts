/**
 * AI Routes
 * 
 * This file defines the API routes for AI-related functionality,
 * including content generation, image generation, and context management.
 */

import express, { Request, Response, NextFunction } from 'express';
import * as aiController from '../controllers/ai.controller';

const router = express.Router();

/**
 * Generate AI content
 * 
 * POST /api/ai/generate
 */
router.post('/generate', (req: Request, res: Response, next: NextFunction) => {
  aiController.generateContent(req, res).catch(next);
});

/**
 * Generate AI image
 * 
 * POST /api/ai/generate-image
 */
router.post('/generate-image', (req: Request, res: Response, next: NextFunction) => {
  aiController.generateImage(req, res).catch(next);
});

/**
 * Save AI generation
 * 
 * PUT /api/ai/generations/:generation_id/save
 */
router.put('/generations/:generation_id/save', (req: Request, res: Response, next: NextFunction) => {
  aiController.saveGeneration(req, res).catch(next);
});

export default router; 