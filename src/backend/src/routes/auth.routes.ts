/**
 * Authentication Routes
 * 
 * This file defines the routes for user authentication, including
 * registration, login, profile retrieval, and token management.
 */

import express, { Request, Response, NextFunction } from 'express';
import * as authController from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.post('/register', authController.register as express.RequestHandler);
router.post('/login', authController.login as express.RequestHandler);
router.post('/logout', authController.logout as express.RequestHandler);

// Protected routes
router.get('/me', protect as express.RequestHandler, authController.getProfile as express.RequestHandler);
router.post('/refresh', protect as express.RequestHandler, authController.refreshToken as express.RequestHandler);

export default router; 