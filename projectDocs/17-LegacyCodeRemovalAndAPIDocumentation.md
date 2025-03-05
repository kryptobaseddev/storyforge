# StoryForge - Legacy Code Removal and API Documentation Guide

This document provides instructions for safely removing legacy code after the tRPC migration and enhancing the API documentation with Swagger.

## Table of Contents
1. [Legacy Code Removal](#legacy-code-removal)
2. [API Documentation Enhancement](#api-documentation-enhancement)
3. [Testing After Removal](#testing-after-removal)

## Legacy Code Removal

Now that all routers have been migrated to tRPC, we can safely remove the legacy Express routes and controllers. Follow these steps to remove the legacy code:

### 1. Backup Before Deletion (Optional)

Create a backup branch before removing code:

```bash
git checkout -b legacy-code-backup
git add .
git commit -m "Backup before legacy code removal"
git checkout main
```

### 2. Remove Legacy Directories

After confirming that all endpoints have been migrated to tRPC, you can safely remove the following directories:

```bash
# Remove legacy controllers
rm -rf src/backend/src/controllers/

# Remove legacy routes
rm -rf src/backend/src/routes/
```

### 3. Clean Up Imports

Check for any remaining imports that reference the removed files:

```bash
# Search for controller imports
grep -r "controllers/" src/backend/

# Search for routes imports
grep -r "routes/" src/backend/
```

If any imports are found, update those files to remove the unused imports.

### 4. Update the Server Entry Point

Ensure that the server entry point (`src/backend/src/index.ts`) no longer references any legacy routes. The file should only use tRPC endpoints.

## API Documentation Enhancement

The application already has basic OpenAPI/Swagger documentation set up using `trpc-openapi`. Here's how to enhance it:

### 1. Update OpenAPI Configuration

Edit the `src/backend/src/openapi.ts` file to provide more detailed information:

```typescript
/**
 * OpenAPI document generator for StoryForge API
 * This file generates the OpenAPI/Swagger documentation from tRPC routers
 */

import { generateOpenApiDocument } from 'trpc-openapi';
import { appRouter } from './routers/_app';

// Generate OpenAPI document
export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: 'StoryForge API',
  description: 'API documentation for StoryForge creative writing application',
  version: '1.0.0',
  baseUrl: '/api',
  tags: [
    'auth',
    'users',
    'projects',
    'characters',
    'settings',
    'plots',
    'chapters',
    'exports',
    'ai'
  ],
  securitySchemes: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT'
    }
  },
  defaultSecurity: [{ bearerAuth: [] }],
  docsUrl: '/api-docs'
});
```

### 2. Add OpenAPI Comments to Routers

To improve documentation, add OpenAPI metadata to each router procedure. Here's an example for the project router:

```typescript
// In src/backend/src/routers/project.router.ts

export const projectRouter = router({
  getAll: publicProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/projects',
        tags: ['projects'],
        summary: 'Get all projects for the authenticated user',
        description: 'Retrieves a list of all projects that belong to the authenticated user',
        responseDescription: 'A list of projects'
      }
    })
    .query(async ({ ctx }) => {
      // Existing implementation
    }),

  getById: publicProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/projects/{id}',
        tags: ['projects'],
        summary: 'Get a project by ID',
        description: 'Retrieves a single project by its ID, if the user has access to it',
        responseDescription: 'The requested project'
      }
    })
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      // Existing implementation
    })
  
  // Add similar meta blocks to other procedures
});
```

### 3. Add Example Responses

Enhance documentation with example responses:

```typescript
getById: publicProcedure
  .meta({
    openapi: {
      method: 'GET',
      path: '/projects/{id}',
      tags: ['projects'],
      summary: 'Get a project by ID',
      description: 'Retrieves a single project by its ID, if the user has access to it',
      responseDescription: 'The requested project',
      responses: {
        200: {
          description: 'Project retrieved successfully',
          content: {
            'application/json': {
              examples: {
                project: {
                  value: {
                    id: '6071f1e55b82de001f9fe51a',
                    title: 'My Fantasy Novel',
                    description: 'A story about dragons and knights',
                    createdAt: '2023-06-15T12:00:00Z',
                    userId: '6071f1e55b82de001f9fe520',
                    collaborators: []
                  }
                }
              }
            }
          }
        },
        404: {
          description: 'Project not found',
          content: {
            'application/json': {
              examples: {
                notFound: {
                  value: {
                    code: 'NOT_FOUND',
                    message: 'Project not found'
                  }
                }
              }
            }
          }
        }
      }
    }
  })
  .input(z.object({ id: z.string() }))
  .query(async ({ ctx, input }) => {
    // Existing implementation
  })
```

### 4. Secure Endpoints

Use the security metadata to indicate which endpoints require authentication:

```typescript
createProject: publicProcedure
  .meta({
    openapi: {
      method: 'POST',
      path: '/projects',
      tags: ['projects'],
      summary: 'Create a new project',
      security: [{ bearerAuth: [] }], // This endpoint requires authentication
      description: 'Creates a new project for the authenticated user',
      responseDescription: 'The created project'
    }
  })
  .input(createProjectSchema)
  .mutation(async ({ ctx, input }) => {
    // Existing implementation
  })
```

### 5. Access Swagger UI

The Swagger UI is already available at `/api-docs` and will reflect all the enhancements made above.

## Testing After Removal

After removing legacy code, follow these steps to ensure everything works correctly:

### 1. Run Integration Tests

If you have automated tests, run them to ensure all endpoints are working correctly:

```bash
npm test
```

### 2. Manual API Testing

Test key endpoints manually using either the Swagger UI or a tool like Postman.

### 3. Check Frontend Integration

Make sure the frontend still works correctly with the API by testing key user flows such as:
- User authentication
- Project creation and management
- Character and plot management
- AI assistance features
- Exporting content

### 4. Monitor Logs

After deployment, monitor server logs for any unexpected errors that might be related to the legacy code removal.

## Next Steps

1. **Update Frontend Services**: If the frontend was still using REST endpoints, update it to use the tRPC client according to the frontend integration guide.

2. **Improve Test Coverage**: Add more tests for the tRPC endpoints to ensure long-term stability.

3. **Document Remaining Type Issues**: Create a list of any remaining type issues and a plan to address them. 