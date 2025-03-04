/**
 * Character Routes
 * 
 * This file defines the routes for character-related operations, including
 * creating, retrieving, updating, and deleting characters.
 */

import express, { Request, Response, NextFunction } from 'express';
import * as characterController from '../controllers/character.controller';
import { protect, projectAccess } from '../middleware/auth.middleware';

const router = express.Router({ mergeParams: true });

// All routes are protected
router.use(protect as express.RequestHandler);
router.use(projectAccess as express.RequestHandler);

// Character routes
router.get('/', characterController.getCharacters as unknown as express.RequestHandler);
router.post('/', characterController.createCharacter as unknown as express.RequestHandler);

router.get('/:id', characterController.getCharacterById as unknown as express.RequestHandler);
router.put('/:id', characterController.updateCharacter as unknown as express.RequestHandler);
router.delete('/:id', characterController.deleteCharacter as unknown as express.RequestHandler);

// Relationship routes
router.get('/:id/relationships', characterController.getCharacterRelationships as unknown as express.RequestHandler);
router.put('/:id/relationships', characterController.updateCharacterRelationships as unknown as express.RequestHandler);

export default router; 