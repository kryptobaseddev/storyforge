# StoryForge - API Endpoints Implementation Plan

This document outlines all the API endpoints needed for the StoryForge application's MVP, their implementation status, and next steps.

## API Endpoint Categories

1. Authentication
2. User Management
3. Project Management
4. Character Management
5. Setting Management
6. Story Structure/Plot Management
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

**Implementation Steps:**
1. Create `auth.controller.ts` with register, login, getProfile, refreshToken, and logout methods
2. Create `auth.routes.ts` to map endpoints to controller methods
3. Implement JWT token generation and validation
4. Create authentication middleware for protected routes
5. Add validation for registration and login data

### 2. User Management Endpoints

| Endpoint | Method | Description | Status | Priority |
|----------|--------|-------------|--------|----------|
| `/api/users/profile` | PUT | Update user profile | Not Started | Medium |
| `/api/users/password` | PUT | Change password | Not Started | Low |
| `/api/users/preferences` | GET/PUT | Get/update user preferences | Not Started | Medium |

**Implementation Steps:**
1. Create `user.controller.ts` with updateProfile, changePassword, and managePreferences methods
2. Create `user.routes.ts` to map endpoints to controller methods
3. Add authentication middleware to protect routes
4. Implement validation for user data updates

### 3. Project Management Endpoints

| Endpoint | Method | Description | Status | Priority |
|----------|--------|-------------|--------|----------|
| `/api/projects` | GET | Get all user projects | Not Started | High |
| `/api/projects` | POST | Create a new project | Not Started | High |
| `/api/projects/:id` | GET | Get project details | Not Started | High |
| `/api/projects/:id` | PUT | Update project | Not Started | High |
| `/api/projects/:id` | DELETE | Delete project | Not Started | Medium |
| `/api/projects/:id/metadata` | GET/PUT | Get/update project metadata | Not Started | Medium |

**Implementation Steps:**
1. Create `project.model.ts` for project MongoDB schema
2. Create `project.controller.ts` with CRUD operations
3. Create `project.routes.ts` to map endpoints to controller methods
4. Add authentication and authorization middleware
5. Implement validation for project data

### 4. Character Management Endpoints

| Endpoint | Method | Description | Status | Priority |
|----------|--------|-------------|--------|----------|
| `/api/projects/:projectId/characters` | GET | Get all characters in project | Not Started | High |
| `/api/projects/:projectId/characters` | POST | Create a new character | Not Started | High |
| `/api/projects/:projectId/characters/:id` | GET | Get character details | Not Started | High |
| `/api/projects/:projectId/characters/:id` | PUT | Update character | Not Started | High |
| `/api/projects/:projectId/characters/:id` | DELETE | Delete character | Not Started | Medium |
| `/api/projects/:projectId/characters/:id/relationships` | GET/PUT | Manage character relationships | Not Started | Medium |

**Implementation Steps:**
1. Create `character.model.ts` for character MongoDB schema
2. Create `character.controller.ts` with CRUD operations
3. Create `character.routes.ts` to map endpoints to controller methods
4. Add authentication and authorization middleware
5. Implement validation for character data

### 5. Setting Management Endpoints

| Endpoint | Method | Description | Status | Priority |
|----------|--------|-------------|--------|----------|
| `/api/projects/:projectId/settings` | GET | Get all settings in project | Not Started | Medium |
| `/api/projects/:projectId/settings` | POST | Create a new setting | Not Started | Medium |
| `/api/projects/:projectId/settings/:id` | GET | Get setting details | Not Started | Medium |
| `/api/projects/:projectId/settings/:id` | PUT | Update setting | Not Started | Medium |
| `/api/projects/:projectId/settings/:id` | DELETE | Delete setting | Not Started | Low |

**Implementation Steps:**
1. Create `setting.model.ts` for setting MongoDB schema
2. Create `setting.controller.ts` with CRUD operations
3. Create `setting.routes.ts` to map endpoints to controller methods
4. Add authentication and authorization middleware
5. Implement validation for setting data

### 6. Story Structure/Plot Management Endpoints

| Endpoint | Method | Description | Status | Priority |
|----------|--------|-------------|--------|----------|
| `/api/projects/:projectId/plotlines` | GET | Get all plotlines in project | Not Started | Medium |
| `/api/projects/:projectId/plotlines` | POST | Create a new plotline | Not Started | Medium |
| `/api/projects/:projectId/plotlines/:id` | GET | Get plotline details | Not Started | Medium |
| `/api/projects/:projectId/plotlines/:id` | PUT | Update plotline | Not Started | Medium |
| `/api/projects/:projectId/plotlines/:id` | DELETE | Delete plotline | Not Started | Low |
| `/api/projects/:projectId/plot-points` | GET/POST | Manage plot points | Not Started | Low |

**Implementation Steps:**
1. Create `plotline.model.ts` for plotline MongoDB schema
2. Create `plotline.controller.ts` with CRUD operations
3. Create `plotline.routes.ts` to map endpoints to controller methods
4. Add authentication and authorization middleware
5. Implement validation for plotline data

### 7. Chapter Management Endpoints

| Endpoint | Method | Description | Status | Priority |
|----------|--------|-------------|--------|----------|
| `/api/projects/:projectId/chapters` | GET | Get all chapters in project | Not Started | Medium |
| `/api/projects/:projectId/chapters` | POST | Create a new chapter | Not Started | Medium |
| `/api/projects/:projectId/chapters/:id` | GET | Get chapter details | Not Started | Medium |
| `/api/projects/:projectId/chapters/:id` | PUT | Update chapter | Not Started | Medium |
| `/api/projects/:projectId/chapters/:id` | DELETE | Delete chapter | Not Started | Low |
| `/api/projects/:projectId/chapters/reorder` | PUT | Reorder chapters | Not Started | Low |

**Implementation Steps:**
1. Create `chapter.model.ts` for chapter MongoDB schema
2. Create `chapter.controller.ts` with CRUD operations
3. Create `chapter.routes.ts` to map endpoints to controller methods
4. Add authentication and authorization middleware
5. Implement validation for chapter data

### 8. AI Generation Endpoints

| Endpoint | Method | Description | Status | Priority |
|----------|--------|-------------|--------|----------|
| `/api/ai/generate` | POST | Generate content | Completed | High |
| `/api/ai/generate-image` | POST | Generate image | Completed | Medium |
| `/api/ai/generations/:id/save` | PUT | Save generation | Completed | Medium |

**Implementation Steps:**
1. ✅ AI endpoints already implemented
2. Integrate with other endpoints as needed

### 9. Export Endpoints

| Endpoint | Method | Description | Status | Priority |
|----------|--------|-------------|--------|----------|
| `/api/projects/:id/export` | GET | Export project as file | Not Started | Low |
| `/api/projects/:id/export/formats` | GET | Get available export formats | Not Started | Low |
| `/api/projects/:id/export/:format` | GET | Export in specific format | Not Started | Low |

**Implementation Steps:**
1. Create `export.controller.ts` with export methods
2. Create `export.routes.ts` to map endpoints to controller methods
3. Implement export functionality for different formats (TXT, MD, PDF)
4. Add authentication and authorization middleware

## Implementation Sequence

### Phase 1: Core Authentication and Project Management (Days 1-2)
1. Authentication endpoints
2. Project management endpoints
3. Connect to MongoDB and test endpoints

### Phase 2: Story Elements (Days 3-4)
1. Character management endpoints
2. Setting management endpoints
3. Test integration with AI generation

### Phase 3: Narrative Structure (Days 5-6)
1. Plotline and story structure endpoints
2. Chapter management endpoints
3. Test integration with AI generation

### Phase 4: Export and Polish (Day 7)
1. Export endpoints
2. Final testing and bug fixes
3. Documentation and API reference 