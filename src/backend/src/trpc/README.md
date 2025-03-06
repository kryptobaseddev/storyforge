# tRPC Infrastructure

This directory contains the core tRPC infrastructure files that power the StoryForge API. tRPC enables end-to-end typesafe APIs, making it safer and easier to build robust applications.

## File Structure

- `context.ts` - Context creation function and type definitions
- `router.ts` - Re-exports of the main app router
- `contextAdapters.ts` - Adapters for different server types (like HTTP server)

## How tRPC Works in StoryForge

1. **Context Creation**: Every request gets a context object that includes:
   - Request and response objects
   - User information (if authenticated)
   - Other request-specific data

2. **Routers**: The API is organized into domain-specific routers:
   - `auth.router.ts` - Authentication endpoints
   - `user.router.ts` - User management
   - `project.router.ts` - Project CRUD operations
   - And many more domain-specific routers

3. **Procedures**: Each router contains procedures that handle specific operations:
   - `publicProcedure` - Available to unauthenticated users
   - `protectedProcedure` - Requires authentication

## Core tRPC Files

The main tRPC setup is in `src/trpc.ts`, which exports:
- `router` - For creating new routers
- `publicProcedure` - For public endpoints
- `protectedProcedure` - For authenticated endpoints
- `transformId` - Helper for MongoDB ID transformation

## Integration Points

- Express Adapter: Used in `src/index.ts` to expose tRPC as REST endpoints
- OpenAPI: Configured in `src/openapi.ts` for Swagger documentation
- Frontend: Uses tRPC client to make typesafe API calls 