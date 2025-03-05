# StoryForge - API Endpoints Implementation Plan

This document outlines all the API endpoints needed for the StoryForge application's MVP, their implementation status, and next steps. We will implement these endpoints using tRPC with OpenAPI/Swagger documentation.

## API Implementation Strategy

For our API implementation, we are using tRPC with OpenAPI/Swagger integration:

- **tRPC**: Provides type-safe, seamless connection between frontend and backend with full TypeScript inference
- **OpenAPI/Swagger**: Provides standardized documentation and client generation for external consumers

This approach gives us:
- Internal type-safety with tRPC
- External API documentation and standards compliance with OpenAPI
- The ability to generate clients for other platforms if needed

## API Endpoint Categories

1. Authentication
2. User Management
3. Project Management
4. Character Management
5. Setting Management
6. Plot Management (Story Structure)
7. Chapter Management
8. AI Generation
9. Export

## Detailed Endpoint Specifications

### 1. Authentication Endpoints

| Endpoint | Method | Description | Status | Priority |
|----------|--------|-------------|--------|----------|
| `/api/auth/register` | POST | Register a new user | Not Started | High |
| `/api/auth/login` | POST | User login | Not Started | High |
| `/api/auth/me` | GET | Get current user profile | Not Started | High |
| `/api/auth/refresh` | POST | Refresh auth token | Not Started | Medium |
| `/api/auth/logout` | POST | User logout | Not Started | Medium |
| `/api/auth/forgot-password` | POST | Request password reset | Not Started | Medium |
| `/api/auth/reset-password` | POST | Reset password with token | Not Started | Medium |

**Implementation Steps:**
1. Create `auth.router.ts` with register, login, getProfile, refreshToken, logout, forgotPassword, and resetPassword procedures
2. Set up authentication middleware for protected procedures
3. Add validation for registration and login data
4. Configure OpenAPI metadata for each procedure

### 2. User Management Endpoints

| Endpoint | Method | Description | Status | Priority |
|----------|--------|-------------|--------|----------|
| `/api/users/profile` | PUT | Update user profile | Not Started | Medium |
| `/api/users/password` | PUT | Change password | Not Started | Low |
| `/api/users/preferences` | GET/PUT | Get/update user preferences | Not Started | Medium |

**Implementation Steps:**
1. Create `user.router.ts` with updateProfile, changePassword, and managePreferences procedures
2. Add authentication middleware to protect procedures
3. Implement validation for user data updates
4. Configure OpenAPI metadata for each procedure

### 3. Project Management Endpoints

| Endpoint | Method | Description | Status | Priority |
|----------|--------|-------------|--------|----------|
| `/api/projects` | GET | Get all user projects | Not Started | High |
| `/api/projects` | POST | Create a new project | Not Started | High |
| `/api/projects/:id` | GET | Get project details | Not Started | High |
| `/api/projects/:id` | PUT | Update project | Not Started | High |
| `/api/projects/:id` | DELETE | Delete project | Not Started | Medium |
| `/api/projects/:id/metadata` | GET/PUT | Get/update project metadata | Not Started | Medium |
| `/api/projects/:id/collaborators` | GET | Get project collaborators | Not Started | Medium |
| `/api/projects/:id/collaborators` | POST | Add collaborator to project | Not Started | Medium |
| `/api/projects/:id/collaborators/:userId` | PUT | Update collaborator permissions | Not Started | Low |
| `/api/projects/:id/collaborators/:userId` | DELETE | Remove collaborator | Not Started | Low |

**Implementation Steps:**
1. Create `project.model.ts` for project MongoDB schema
2. Create `project.router.ts` with CRUD operations and collaborator management
3. Add authentication and authorization middleware
4. Implement validation for project data
5. Configure OpenAPI metadata for each procedure

### 4. Character Management Endpoints

| Endpoint | Method | Description | Status | Priority |
|----------|--------|-------------|--------|----------|
| `/api/projects/:projectId/characters` | GET | Get all characters in project | Not Started | High |
| `/api/projects/:projectId/characters` | POST | Create a new character | Not Started | High |
| `/api/projects/:projectId/characters/:characterId` | GET | Get character details | Not Started | High |
| `/api/projects/:projectId/characters/:characterId` | PUT | Update character | Not Started | High |
| `/api/projects/:projectId/characters/:characterId` | DELETE | Delete character | Not Started | Medium |
| `/api/projects/:projectId/characters/:characterId/relationships` | GET | Get character relationships | Not Started | Medium |
| `/api/projects/:projectId/characters/:characterId/relationships` | PUT | Update character relationships | Not Started | Medium |

**Implementation Steps:**
1. Create `character.model.ts` for character MongoDB schema
2. Create `character.router.ts` with CRUD operations and relationship management
3. Add authentication and authorization middleware
4. Implement validation for character data
5. Configure OpenAPI metadata for each procedure

### 5. Setting Management Endpoints

| Endpoint | Method | Description | Status | Priority |
|----------|--------|-------------|--------|----------|
| `/api/projects/:projectId/settings` | GET | Get all settings in project | Not Started | Medium |
| `/api/projects/:projectId/settings` | POST | Create a new setting | Not Started | Medium |
| `/api/projects/:projectId/settings/:settingId` | GET | Get setting details | Not Started | Medium |
| `/api/projects/:projectId/settings/:settingId` | PUT | Update setting | Not Started | Medium |
| `/api/projects/:projectId/settings/:settingId` | DELETE | Delete setting | Not Started | Low |
| `/api/projects/:projectId/settings/:settingId/map` | POST | Upload map image | Not Started | Low |

**Implementation Steps:**
1. Create `setting.model.ts` for setting MongoDB schema
2. Create `setting.router.ts` with CRUD operations
3. Add authentication and authorization middleware
4. Implement validation for setting data
5. Configure OpenAPI metadata for each procedure

### 6. Plot Management Endpoints

| Endpoint | Method | Description | Status | Priority |
|----------|--------|-------------|--------|----------|
| `/api/projects/:projectId/plots` | GET | Get all plots in project | Not Started | Medium |
| `/api/projects/:projectId/plots` | POST | Create a new plot | Not Started | Medium |
| `/api/projects/:projectId/plots/:plotId` | GET | Get plot details | Not Started | Medium |
| `/api/projects/:projectId/plots/:plotId` | PUT | Update plot | Not Started | Medium |
| `/api/projects/:projectId/plots/:plotId` | DELETE | Delete plot | Not Started | Low |
| `/api/projects/:projectId/plots/:plotId/points` | GET | Get plot points | Not Started | Medium |
| `/api/projects/:projectId/plots/:plotId/points` | POST | Add plot point | Not Started | Medium |
| `/api/projects/:projectId/plots/:plotId/points/:pointId` | PUT | Update plot point | Not Started | Low |
| `/api/projects/:projectId/plots/:plotId/points/:pointId` | DELETE | Delete plot point | Not Started | Low |
| `/api/projects/:projectId/plots/:plotId/points/reorder` | PUT | Reorder plot points | Not Started | Low |

**Implementation Steps:**
1. Create `plot.model.ts` for plot MongoDB schema
2. Create `plot.router.ts` with CRUD operations and plot point management
3. Add authentication and authorization middleware
4. Implement validation for plot data
5. Configure OpenAPI metadata for each procedure

### 7. Chapter Management Endpoints

| Endpoint | Method | Description | Status | Priority |
|----------|--------|-------------|--------|----------|
| `/api/projects/:projectId/chapters` | GET | Get all chapters in project | Not Started | Medium |
| `/api/projects/:projectId/chapters` | POST | Create a new chapter | Not Started | Medium |
| `/api/projects/:projectId/chapters/:chapterId` | GET | Get chapter details | Not Started | Medium |
| `/api/projects/:projectId/chapters/:chapterId` | PUT | Update chapter | Not Started | Medium |
| `/api/projects/:projectId/chapters/:chapterId` | DELETE | Delete chapter | Not Started | Low |
| `/api/projects/:projectId/chapters/reorder` | PUT | Reorder chapters | Not Started | Low |
| `/api/projects/:projectId/chapters/:chapterId/content` | GET | Get chapter content | Not Started | Medium |
| `/api/projects/:projectId/chapters/:chapterId/content` | PUT | Update chapter content | Not Started | Medium |
| `/api/projects/:projectId/chapters/:chapterId/versions` | GET | Get chapter versions | Not Started | Low |
| `/api/projects/:projectId/chapters/:chapterId/versions/:versionId` | GET | Get specific chapter version | Not Started | Low |

**Implementation Steps:**
1. Create `chapter.model.ts` for chapter MongoDB schema
2. Create `chapter.router.ts` with CRUD operations, content management, and versioning
3. Add authentication and authorization middleware
4. Implement validation for chapter data
5. Configure OpenAPI metadata for each procedure

### 8. AI Generation Endpoints

| Endpoint | Method | Description | Status | Priority |
|----------|--------|-------------|--------|----------|
| `/api/ai/generate` | POST | Generate text content | Completed | High |
| `/api/ai/generate-image` | POST | Generate image | Completed | Medium |
| `/api/ai/generations/:id/save` | PUT | Save generation | Completed | Medium |
| `/api/ai/providers` | GET | Get available AI providers | Not Started | Low |
| `/api/ai/cost-estimate` | POST | Get cost estimate for generation | Not Started | Low |
| `/api/ai/generate-character` | POST | Generate character | Not Started | Medium |
| `/api/ai/generate-setting` | POST | Generate setting | Not Started | Medium |
| `/api/ai/generate-plot` | POST | Generate plot | Not Started | Medium |
| `/api/ai/generate-chapter` | POST | Generate chapter | Not Started | Medium |

**Implementation Steps:**
1. ✅ Core AI endpoints already implemented
2. Create `ai.router.ts` with remaining generation procedures
3. Implement provider management and cost estimation
4. Configure OpenAPI metadata for each procedure

### 9. Export Endpoints

| Endpoint | Method | Description | Status | Priority |
|----------|--------|-------------|--------|----------|
| `/api/projects/:projectId/exports` | GET | Get all exports for a project | Not Started | Low |
| `/api/projects/:projectId/exports` | POST | Create new export | Not Started | Low |
| `/api/exports/:exportId` | GET | Get export details | Not Started | Low |
| `/api/exports/:exportId` | DELETE | Delete export | Not Started | Low |
| `/api/exports/:exportId/download` | GET | Download export file | Not Started | Low |
| `/api/exports/formats` | GET | Get available export formats | Not Started | Low |

**Implementation Steps:**
1. Create `export.model.ts` for export MongoDB schema
2. Create `export.router.ts` with export management procedures
3. Implement export functionality for different formats (TXT, MD, PDF)
4. Add authentication and authorization middleware
5. Configure OpenAPI metadata for each procedure

## tRPC Implementation Strategy

We will implement our API using tRPC with OpenAPI/Swagger documentation:

1. **Base tRPC Setup**:
   ```typescript
   // server/trpc.ts
   import { initTRPC, TRPCError } from '@trpc/server';
   import { OpenApiMeta } from 'trpc-openapi';
   
   const t = initTRPC.meta<OpenApiMeta>().create();
   
   export const middleware = t.middleware;
   export const router = t.router;
   export const publicProcedure = t.procedure;
   ```

2. **Authentication Middleware**:
   ```typescript
   // server/middlewares/auth.ts
   import { middleware } from '../trpc';
   import { TRPCError } from '@trpc/server';
   
   export const isAuthed = middleware(async ({ ctx, next }) => {
     if (!ctx.user) {
       throw new TRPCError({
         code: 'UNAUTHORIZED',
         message: 'Not authenticated',
       });
     }
     return next({
       ctx: {
         user: ctx.user,
       },
     });
   });
   
   export const protectedProcedure = publicProcedure.use(isAuthed);
   ```

3. **Router Implementation Example**:
   ```typescript
   // server/routers/project.ts
   import { z } from 'zod';
   import { router, protectedProcedure } from '../trpc';
   
   export const projectRouter = router({
     getProjects: protectedProcedure
       .meta({
         openapi: {
           method: 'GET',
           path: '/projects',
           tags: ['projects'],
           summary: 'Get all projects for the current user',
         },
       })
       .input(z.void())
       .output(z.array(ProjectSchema))
       .query(async ({ ctx }) => {
         // Implementation
       }),
     // Other procedures...
   });
   ```

4. **OpenAPI Generation**:
   ```typescript
   // server/openapi.ts
   import { generateOpenApiDocument } from 'trpc-openapi';
   import { appRouter } from './routers/_app';
   
   export const openApiDocument = generateOpenApiDocument(appRouter, {
     title: 'StoryForge API',
     version: '1.0.0',
     baseUrl: 'http://localhost:5000/api',
   });
   ```

## Implementation Sequence

### Phase 1: Core Architecture (Days 1-2)
1. Set up tRPC server with OpenAPI integration
2. Implement authentication router and middleware
3. Create basic project router
4. Generate initial OpenAPI documentation

### Phase 2: Project Structure (Days 3-4)
1. Complete project router implementation
2. Implement character router
3. Implement setting router
4. Test with frontend services
5. Update OpenAPI documentation

### Phase 3: Narrative Elements (Days 5-6)
1. Implement plot router
2. Implement chapter router
3. Complete AI generation endpoints
4. Test with frontend services
5. Update OpenAPI documentation

### Phase 4: Export & Polish (Day 7)
1. Implement export router
2. Complete end-to-end testing
3. Finalize OpenAPI documentation
4. Create Swagger UI interface

## Next Steps

1. Update the frontend service layer to use tRPC client
2. Create shared type definitions between backend and frontend
3. Implement comprehensive error handling
4. Set up automated testing for the API 