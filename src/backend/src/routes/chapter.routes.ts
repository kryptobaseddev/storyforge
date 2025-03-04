/**
 * Chapter Routes
 * 
 * This file defines the routes for chapter-related operations, including
 * creating, retrieving, updating, and deleting chapters.
 */

import express, { Request, Response, NextFunction } from 'express';
import * as chapterController from '../controllers/chapter.controller';
import { protect, projectAccess } from '../middleware/auth.middleware';

const router = express.Router({ mergeParams: true });

// All routes are protected
router.use(protect as express.RequestHandler);
router.use(projectAccess as express.RequestHandler);

// Chapter routes
router.get('/', chapterController.getChapters as unknown as express.RequestHandler);
router.post('/', chapterController.createChapter as unknown as express.RequestHandler);

router.get('/:id', chapterController.getChapterById as unknown as express.RequestHandler);
router.put('/:id', chapterController.updateChapter as unknown as express.RequestHandler);
router.delete('/:id', chapterController.deleteChapter as unknown as express.RequestHandler);

// Special routes
router.put('/reorder', chapterController.reorderChapters as unknown as express.RequestHandler);
router.post('/generate', chapterController.generateChapter as unknown as express.RequestHandler);

export default router; 