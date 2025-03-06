/**
 * Context file for tRPC
 * This exports the context creation function for use with tRPC adapters
 */

import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { verifyToken } from '../utils/jwt';
import type { JwtPayload } from 'jsonwebtoken';
import { Request, Response } from 'express';

/**
 * Context for tRPC procedures
 * This will be available in all procedures
 */
export interface Context {
  req: Request;
  res: Response;
  user?: JwtPayload | null;
}

/**
 * Create context for tRPC procedures
 * This runs on each request and adds the user to the context if authenticated
 */
export const createContext = async ({ req, res }: CreateExpressContextOptions): Promise<Context> => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  
  // Initialize context
  const ctx: Context = { req, res, user: null };
  
  // If token exists, verify it and add user to context
  if (token) {
    try {
      const decoded = await verifyToken(token);
      ctx.user = decoded;
    } catch (error) {
      // Invalid token, but we don't throw here - procedures will handle auth themselves
      console.warn('Invalid token:', error);
    }
  }
  
  return ctx;
};

// Re-export for backward compatibility
export { createContext as createTRPCContext }; 