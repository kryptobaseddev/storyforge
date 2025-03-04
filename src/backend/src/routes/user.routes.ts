/**
 * User Routes
 * 
 * This file defines the routes for user-related operations, including
 * profile updates, password changes, and preference management.
 */

import express, { Request, Response, NextFunction } from 'express';
import * as userController from '../controllers/user.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// All routes are protected
router.use(protect as express.RequestHandler);

// Profile routes
router.put('/profile', userController.updateProfile as express.RequestHandler);

// Password routes
router.put('/password', userController.changePassword as express.RequestHandler);

// Preferences routes
router.get('/preferences', userController.getPreferences as express.RequestHandler);
router.put('/preferences', userController.updatePreferences as express.RequestHandler);

export default router; 