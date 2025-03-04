/**
 * Project Routes
 * 
 * This file defines the routes for project-related operations, including
 * creating, retrieving, updating, and deleting projects.
 */

import express, { Request, Response, NextFunction } from 'express';
import * as projectController from '../controllers/project.controller';
import { protect, projectAccess } from '../middleware/auth.middleware';

const router = express.Router();

// All routes are protected
router.use(protect as express.RequestHandler);

// Project routes
router.get('/', projectController.getProjects as express.RequestHandler);
router.post('/', projectController.createProject as express.RequestHandler);

router.get('/:id', projectAccess as express.RequestHandler, projectController.getProjectById as express.RequestHandler);
router.put('/:id', projectAccess as express.RequestHandler, projectController.updateProject as express.RequestHandler);
router.delete('/:id', projectAccess as express.RequestHandler, projectController.deleteProject as express.RequestHandler);

// Collaborator routes
router.post('/:id/collaborators', projectAccess as express.RequestHandler, projectController.addCollaborator as express.RequestHandler);
router.delete('/:id/collaborators/:userId', projectAccess as express.RequestHandler, projectController.removeCollaborator as express.RequestHandler);

export default router; 