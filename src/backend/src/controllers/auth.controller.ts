/**
 * Authentication Controller
 * 
 * This controller handles user authentication, including
 * registration, login, profile retrieval, and token management.
 */

import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user.model';

// Generate JWT token
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'default_secret', {
    expiresIn: '30d'
  });
};

/**
 * Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, firstName, lastName, age } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });

    if (userExists) {
      return res.status(400).json({
        error: {
          code: 'user_exists',
          message: 'User with this email or username already exists'
        }
      });
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      passwordHash: password, // Will be hashed by pre-save hook
      firstName,
      lastName,
      age,
      preferences: {
        theme: 'light',
        fontSize: 16,
        readingLevel: 'middle grade',
        notificationSettings: {
          email: true,
          app: true
        }
      }
    });

    if (user) {
      // Generate token
      const token = generateToken(user._id.toString());

      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        preferences: user.preferences,
        token
      });
    } else {
      res.status(400).json({
        error: {
          code: 'invalid_user_data',
          message: 'Invalid user data'
        }
      });
    }
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: {
        code: 'server_error',
        message: error.message || 'Server error during registration'
      }
    });
  }
};

/**
 * Authenticate user & get token
 * @route POST /api/auth/login
 * @access Public
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email }) as IUser | null;

    // Check if user exists and password matches
    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        preferences: user.preferences,
        token: generateToken(user._id.toString())
      });
    } else {
      res.status(401).json({
        error: {
          code: 'invalid_credentials',
          message: 'Invalid email or password'
        }
      });
    }
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      error: {
        code: 'server_error',
        message: error.message || 'Server error during login'
      }
    });
  }
};

/**
 * Get user profile
 * @route GET /api/auth/me
 * @access Private
 */
export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({
        error: {
          code: 'user_not_found',
          message: 'User not found'
        }
      });
    }
  } catch (error: any) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: {
        code: 'server_error',
        message: error.message || 'Server error while retrieving profile'
      }
    });
  }
};

/**
 * Refresh auth token
 * @route POST /api/auth/refresh
 * @access Private
 */
export const refreshToken = async (req: Request, res: Response) => {
  try {
    // Generate new token
    const token = generateToken(req.user._id.toString());
    
    res.json({ token });
  } catch (error: any) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      error: {
        code: 'server_error',
        message: error.message || 'Server error while refreshing token'
      }
    });
  }
};

/**
 * Logout user (client-side)
 * @route POST /api/auth/logout
 * @access Public
 */
export const logout = (req: Request, res: Response) => {
  // JWT is stateless, so we just return success
  // The client should remove the token from storage
  res.json({ message: 'Logged out successfully' });
}; 