/**
 * Export Routes
 * 
 * This file defines the routes for export-related operations, including
 * creating, retrieving, and downloading exports.
 */

import express, { Request, Response, NextFunction } from 'express';
import * as exportController from '../controllers/export.controller';
import { protect, projectAccess } from '../middleware/auth.middleware';

const router = express.Router({ mergeParams: true });

// All routes are protected
router.use(protect as express.RequestHandler);
router.use(projectAccess as express.RequestHandler);

// Export routes
router.get('/', exportController.getExports as unknown as express.RequestHandler);
router.post('/', exportController.createExport as unknown as express.RequestHandler);

router.get('/:id', exportController.getExportById as unknown as express.RequestHandler);
router.delete('/:id', exportController.deleteExport as unknown as express.RequestHandler);

// Download route
router.get('/:id/download', exportController.downloadExport as unknown as express.RequestHandler);

export default router; 