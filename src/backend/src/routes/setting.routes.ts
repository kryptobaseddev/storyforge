/**
 * Setting Routes
 * 
 * This file defines the routes for setting-related operations, including
 * creating, retrieving, updating, and deleting settings.
 */

import express, { Request, Response, NextFunction } from 'express';
import * as settingController from '../controllers/setting.controller';
import { protect, projectAccess } from '../middleware/auth.middleware';

const router = express.Router({ mergeParams: true });

// All routes are protected
router.use(protect as express.RequestHandler);
router.use(projectAccess as express.RequestHandler);

// Setting routes
router.get('/', settingController.getSettings as unknown as express.RequestHandler);
router.post('/', settingController.createSetting as unknown as express.RequestHandler);

router.get('/:id', settingController.getSettingById as unknown as express.RequestHandler);
router.put('/:id', settingController.updateSetting as unknown as express.RequestHandler);
router.delete('/:id', settingController.deleteSetting as unknown as express.RequestHandler);

export default router; 