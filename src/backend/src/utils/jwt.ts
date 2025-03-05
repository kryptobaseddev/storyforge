/**
 * JWT Utilities
 * 
 * This file contains utilities for JWT token generation and verification
 */

import jwt from 'jsonwebtoken';

// JWT Secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

interface TokenPayload {
  id: string;
}

/**
 * Generate a JWT token
 * @param id - User ID to encode in the token
 * @returns JWT token
 */
export const generateToken = (id: string): string => {
  // Note: We're simplifying the token generation to avoid TypeScript issues
  // In production, we'd need to ensure proper typing with jsonwebtoken
  return jwt.sign({ id }, JWT_SECRET);
};

/**
 * Verify a JWT token
 * @param token - JWT token to verify
 * @returns Decoded token payload
 */
export const verifyToken = (token: string): Promise<TokenPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        reject(new Error('Invalid token'));
      } else {
        resolve(decoded as TokenPayload);
      }
    });
  });
}; 