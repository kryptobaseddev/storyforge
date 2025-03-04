/**
 * Authentication Middleware
 * 
 * This middleware handles authentication and authorization for protected routes.
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

/**
 * Middleware to protect routes that require authentication
 */
export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  // Check if token exists in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');

      // Get user from the token
      req.user = await User.findById(decoded.id).select('-passwordHash');

      next();
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(401).json({
        error: {
          code: 'authentication_failed',
          message: 'Not authorized, token failed'
        }
      });
    }
  }

  if (!token) {
    res.status(401).json({
      error: {
        code: 'no_token',
        message: 'Not authorized, no token'
      }
    });
  }
};

/**
 * Middleware to check if user has admin role
 */
export const admin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({
      error: {
        code: 'not_admin',
        message: 'Not authorized as an admin'
      }
    });
  }
};

/**
 * Middleware to check if user owns the resource or is an admin
 */
export const ownerOrAdmin = (req: Request, res: Response, next: NextFunction) => {
  const resourceUserId = req.params.userId || req.body.userId;
  
  if (
    req.user && 
    (req.user.isAdmin || req.user._id.toString() === resourceUserId)
  ) {
    next();
  } else {
    res.status(403).json({
      error: {
        code: 'not_authorized',
        message: 'Not authorized to access this resource'
      }
    });
  }
};

/**
 * Middleware to check if user has access to a project
 */
export const projectAccess = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = req.params.projectId || req.body.projectId;
    
    if (!projectId) {
      return res.status(400).json({
        error: {
          code: 'missing_project_id',
          message: 'Project ID is required'
        }
      });
    }
    
    // Check if user is the owner or a collaborator
    const project = await require('../models/project.model').default.findById(projectId);
    
    if (!project) {
      return res.status(404).json({
        error: {
          code: 'project_not_found',
          message: 'Project not found'
        }
      });
    }
    
    const isOwner = project.userId.toString() === req.user._id.toString();
    const isCollaborator = project.collaborators.some(
      (collab: any) => collab.userId.toString() === req.user._id.toString()
    );
    
    if (isOwner || isCollaborator || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({
        error: {
          code: 'no_project_access',
          message: 'Not authorized to access this project'
        }
      });
    }
  } catch (error) {
    console.error('Project access error:', error);
    res.status(500).json({
      error: {
        code: 'server_error',
        message: 'Server error while checking project access'
      }
    });
  }
}; 