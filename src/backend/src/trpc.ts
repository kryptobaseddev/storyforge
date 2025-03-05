/**
 * tRPC server setup for StoryForge
 * This file initializes the tRPC server, creates context, and defines procedures
 */

import { initTRPC, TRPCError } from '@trpc/server';
import { OpenApiMeta } from 'trpc-openapi';
import superjson from 'superjson';
import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { verifyToken } from './utils/jwt';
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
export const createTRPCContext = async ({ req, res }: CreateExpressContextOptions): Promise<Context> => {
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

/**
 * Initialize tRPC
 */
const t = initTRPC.context<Context>().meta<OpenApiMeta>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof Error &&
          error.cause.name === 'ZodError'
            ? error.cause.message
            : null,
      },
    };
  },
});

/**
 * Authentication middleware
 * This ensures that the user is authenticated before running a procedure
 */
export const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user || !ctx.user.id) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource',
    });
  }
  
  return next({
    ctx: {
      ...ctx,
      // Ensures user is never undefined for authenticated procedures
      user: ctx.user,
    }
  });
});

/**
 * Export tRPC router and procedures
 */
export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);

/**
 * Utility function to transform MongoDB _id to id in responses
 */
export const transformId = <T extends { _id: any }>(
  doc: T
): Omit<T, '_id'> & { id: string } => {
  const { _id, ...rest } = doc;
  return {
    id: _id.toString(),
    ...rest,
  };
}; 