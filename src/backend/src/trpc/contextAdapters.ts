/**
 * Context adapters for different server environments
 * This provides context creation functions for different tRPC adapters
 */

import { IncomingMessage, ServerResponse } from 'http';
import { JwtPayload } from 'jsonwebtoken';
import { verifyToken } from '../utils/jwt';

/**
 * Context for HTTP server
 * Simplified context for standalone HTTP servers like in tests 
 */
export interface HTTPContext {
  req: IncomingMessage;
  res: ServerResponse;
  user?: JwtPayload | null;
}

/**
 * Create context for standalone HTTP server
 * Used primarily in testing
 */
export const createHTTPContext = async ({
  req,
  res,
}: {
  req: IncomingMessage;
  res: ServerResponse;
}): Promise<HTTPContext> => {
  // Initialize context
  const ctx: HTTPContext = { req, res, user: null };
  
  // Parse Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  
  // If token exists, verify it and add user to context
  if (token) {
    try {
      const decoded = await verifyToken(token);
      ctx.user = decoded;
    } catch (error) {
      // Invalid token, but we don't throw here
      console.warn('Invalid token in HTTP context:', error);
    }
  }
  
  return ctx;
}; 