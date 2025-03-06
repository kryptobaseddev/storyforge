/**
 * tRPC server setup for StoryForge
 * This file initializes the tRPC server, creates context, and defines procedures
 */

import { initTRPC, TRPCError } from '@trpc/server';
import { OpenApiMeta } from 'trpc-openapi';
import superjson from 'superjson';
import { Context } from './trpc/context';

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

// Re-export context to avoid circular dependencies
export { createTRPCContext } from './trpc/context'; 