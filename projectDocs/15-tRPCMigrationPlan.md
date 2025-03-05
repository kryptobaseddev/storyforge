# StoryForge - tRPC Migration Plan

## Current Status: 🟢 IMPLEMENTATION COMPLETE

The migration to tRPC has been completed for all main routers. Backend testing scripts have been created and documentation has been updated.

## Timeline

| Phase | Status | Target Completion |
| ----- | ------ | ----------------- |
| Planning | ✅ Complete | Week 1 |
| Auth and User Router | ✅ Complete | Week 2 |
| Project and Character Router | ✅ Complete | Week 3 |
| Setting and Plot Router | ✅ Complete | Week 4 |
| Chapter Router | ✅ Complete | Week 5 |
| AI and Export Router | ✅ Complete | Week 6 |
| Legacy Code Removal | ✅ Complete | Week 7 |
| Backend Testing & Documentation | ✅ Complete | Week 7 |
| Frontend Integration | 🟡 Pending | Week 8 |

## Current State Analysis

The application has been successfully migrated from a traditional Express.js REST API to a type-safe tRPC API. All controllers and routes have been removed, and their functionality has been implemented in tRPC routers.

### Current Folder Structure

```
src/backend/
├── src/
│   ├── routers/            # Contains all tRPC routers
│   │   ├── _app.ts         # Root router that combines all other routers
│   │   ├── auth.router.ts  # Authentication endpoints
│   │   ├── user.router.ts  # User management
│   │   ├── project.router.ts  # Project CRUD
│   │   ├── character.router.ts  # Character management
│   │   ├── setting.router.ts  # Setting management
│   │   ├── plot.router.ts  # Plot management
│   │   ├── chapter.router.ts  # Chapter management
│   │   ├── ai.router.ts    # AI text generation functionality
│   │   └── export.router.ts  # Export functionality
│   ├── schemas/           # Zod schemas for validation
│   ├── models/            # Mongoose models
│   ├── trpc/              # tRPC configuration
│   │   ├── trpc.ts        # Base tRPC configuration
│   │   └── context.ts     # Request context creation
│   ├── middleware/        # Express and tRPC middleware
│   ├── utils/             # Utility functions
│   ├── openapi.ts         # OpenAPI/Swagger config
│   └── index.ts           # Main server entry point
├── test-api.sh            # Bash script for API testing
├── test-api.ps1           # PowerShell script for API testing
└── package.json           # Backend dependencies
```

## Target State Design

We have successfully implemented a type-safe API architecture using tRPC. The main elements of the design include:

- **Zod Schemas**: For runtime validation with type inference
- **tRPC Procedures**: Organized into domain-specific routers
- **OpenAPI Documentation**: Auto-generated from tRPC procedures
- **Type Exports**: For seamless frontend integration
- **Testing Tools**: Shell scripts for both Bash and PowerShell environments

## Progress Tracking

| Component | Status | Notes |
| --------- | ------ | ----- |
| tRPC Base Setup | ✅ Complete | Core tRPC configuration and context creation |
| Zod Schema Creation | ✅ Complete | Validation schemas for all domain objects |
| Auth Router | ✅ Complete | Login, registration, and token validation |
| User Router | ✅ Complete | User profile and preferences management |
| Project Router | ✅ Complete | Project CRUD operations |
| Character Router | ✅ Complete | Character management within projects |
| Setting Router | ✅ Complete | Setting management within projects |
| Plot Router | ✅ Complete | Plot management within projects |
| Chapter Router | ✅ Complete | Chapter CRUD and content management |
| AI Router | ✅ Complete | AI integration for text generation |
| Export Router | ✅ Complete | Project export to various formats |
| Legacy Code Removal | ✅ Complete | Removed old routes and controllers |
| API Documentation | ✅ Complete | OpenAPI/Swagger setup with authentication |
| Backend Testing | ✅ Complete | Created test scripts and documentation |
| Frontend Integration | 🟡 Pending | To be implemented |

## Implemented Endpoints

### Auth Management

- `auth.register`: Register a new user
- `auth.login`: Authenticate and get JWT token
- `auth.verifyToken`: Verify JWT token validity

### User Management

- `user.getProfile`: Get current user profile
- `user.updateProfile`: Update user profile information
- `user.changePassword`: Change user password
- `user.updatePreferences`: Update user preferences

### Project Management

- `project.create`: Create a new project
- `project.getById`: Get project by ID
- `project.update`: Update project details
- `project.delete`: Delete a project
- `project.getAllByUser`: Get all user's projects
- `project.getStats`: Get project statistics

### Character Management

- `character.create`: Create a new character
- `character.getById`: Get character by ID
- `character.update`: Update character details
- `character.delete`: Delete a character
- `character.getAllByProject`: Get all characters in a project

### Setting Management

- `setting.create`: Create a new setting
- `setting.getById`: Get setting by ID
- `setting.update`: Update setting details
- `setting.delete`: Delete a setting
- `setting.getAllByProject`: Get all settings in a project

### Plot Management

- `plot.create`: Create a new plot
- `plot.getById`: Get plot by ID
- `plot.update`: Update plot details
- `plot.delete`: Delete a plot
- `plot.getAllByProject`: Get all plots in a project

### Chapter Management

- `chapter.create`: Create a new chapter
- `chapter.getById`: Get chapter by ID
- `chapter.update`: Update chapter details
- `chapter.delete`: Delete a chapter
- `chapter.getAllByProject`: Get all chapters in a project
- `chapter.updateContent`: Update chapter content
- `chapter.reorderChapters`: Change chapter order

### AI Integration

- `ai.generateText`: Generate text based on prompt
- `ai.continueText`: Continue existing text
- `ai.getSuggestions`: Get writing suggestions
- `ai.analyzeText`: Analyze text for insights

### Export Functionality

- `export.createExport`: Create an export
- `export.getExportById`: Get export by ID
- `export.getAllByProject`: Get all exports for a project
- `export.deleteExport`: Delete an export
- `export.downloadExport`: Download an export file

## Testing and Documentation

- Created comprehensive API testing scripts in both Bash and PowerShell
- Created detailed API testing guide
- Enhanced OpenAPI/Swagger documentation
- Added security schemes to API documentation

## Known Issues and Mitigations

### Resolved Issues

- ✅ ObjectId type casting in queries
- ✅ Error handling standardization
- ✅ Authentication middleware integration

### Mitigations Applied

1. **ObjectId Handling**: Created consistent patterns for handling MongoDB ObjectIds with proper type assertions
2. **Error Standardization**: Implemented a unified error response format
3. **Type Exports**: Generated proper TypeScript types for the frontend

## Next Steps

1. **Frontend Integration**:
   - Set up tRPC client in the frontend
   - Update service layer to use tRPC client
   - Replace existing API calls with tRPC calls

2. **Comprehensive Testing**:
   - Run the test scripts to validate all endpoints
   - Perform integration testing with frontend components

3. **Final Documentation**:
   - Update API documentation to reflect any final changes
   - Document best practices for adding new endpoints

## Remaining Tasks

- [ ] Run comprehensive backend tests using the testing scripts
- [ ] Set up tRPC client on the frontend
- [ ] Update frontend services to use tRPC client
- [ ] Perform end-to-end testing of all features

## Table of Contents
1. [Migration Overview](#migration-overview)
2. [Current State Analysis](#current-state-analysis)
3. [Target State Design](#target-state-design)
4. [Migration Steps](#migration-steps)
5. [Progress Tracking](#progress-tracking)
6. [Migration Checklist](#migration-checklist)
7. [External API Integration](#external-api-integration)
8. [Remaining Tasks](#remaining-tasks)

## Migration Overview

### Why tRPC?
- **End-to-end type safety** between frontend and backend
- **Reduced boilerplate** compared to traditional REST
- **Improved developer experience** with automatic type inference
- **Simplified frontend integration** with React Query
- **Compatible with OpenAPI/Swagger** for external documentation

### Timeline
- **Phase 1 (Days 1-2)**: Core setup and authentication ✅
- **Phase 2 (Days 3-4)**: Project, character, setting, and plot routers ✅
- **Phase 3 (Days 5-6)**: User, chapter, and AI routers ✅
- **Phase 4 (Day 7)**: Export router and finalization ✅
- **Phase 5 (Final)**: Legacy code removal and testing ⬜

## Migration Steps

### Phase 1: Core Setup (Days 1-2)

1. [x] Install required dependencies
   ```bash
   npm install @trpc/server @trpc/client @trpc/react-query zod trpc-openapi superjson
   ```

2. [x] Create core tRPC setup
   - [x] Create `trpc.ts`
   - [x] Create authentication middleware

3. [x] Create root router
   - [x] Create `routers/_app.ts`

4. [x] Update server initialization
   - [x] Modify `index.ts` to use tRPC

5. [x] Implement Auth Router
   - [x] Create `routers/auth.router.ts`
   - [x] Implement register, login, etc.

### Phase 2: Project Structure (Days 3-4)

1. [x] Implement Project Router
   - [x] Create `schemas/project.schema.ts`
   - [x] Create `routers/project.router.ts`
   - [x] Implement CRUD operations

2. [x] Implement Character Router
   - [x] Create `schemas/character.schema.ts`
   - [x] Create `routers/character.router.ts`
   - [x] Implement CRUD operations

3. [x] Implement Setting Router
   - [x] Create `schemas/setting.schema.ts`
   - [x] Create `routers/setting.router.ts`
   - [x] Implement CRUD operations

4. [x] Implement Plot Router
   - [x] Create `schemas/plot.schema.ts`
   - [x] Create `routers/plot.router.ts`
   - [x] Implement CRUD operations

### Phase 3: User and Narrative Elements (Days 5-6)

1. [x] Implement User Router
   - [x] Create `schemas/user.schema.ts`
   - [x] Create `routers/user.router.ts`
   - [x] Implement user profile & preferences operations

2. [x] Implement Chapter Router
   - [x] Create `schemas/chapter.schema.ts`
   - [x] Create `routers/chapter.router.ts`
   - [x] Implement CRUD operations

3. [x] Update AI Router
   - [x] Create `schemas/ai.schema.ts`
   - [x] Create `routers/ai.router.ts`
   - [x] Integrate with existing AI code

### Phase 4: Export & Polish (Day 7)

1. [x] Implement Export Router
   - [x] Create `schemas/export.schema.ts`
   - [x] Create `routers/export.router.ts`
   - [x] Implement export functions

2. [x] Generate OpenAPI Documentation
   - [x] Create `openapi.ts`
   - [x] Set up Swagger UI

### Phase 5: Final Steps

1. [x] Clean Up Legacy Code
   - [x] Delete `routes/` directory
   - [x] Delete `controllers/` directory

2. [ ] Frontend Integration
   - [x] Create frontend tRPC client setup documentation
   - [ ] Update frontend API services

3. [ ] Enhance API Documentation
   - [ ] Add more detailed OpenAPI metadata 
   - [ ] Add example responses

4. [ ] Final Testing
   - [ ] End-to-end testing
   - [ ] Documentation review

## Migration Checklist

### Pre-Migration
- [x] Review current codebase
- [ ] Make backup of current codebase
- [x] Update dependencies in package.json
- [x] Update tsconfig.json if needed

### Implementation
- [x] Core tRPC setup
- [x] Auth router implementation
- [x] User router implementation
- [x] Project router implementation
- [x] Character router implementation
- [x] Setting router implementation
- [x] Plot router implementation
- [x] Chapter router implementation
- [x] AI router implementation
- [x] Export router implementation
- [x] OpenAPI/Swagger documentation

### Testing
- [ ] Test auth endpoints
- [ ] Test user endpoints
- [ ] Test project endpoints
- [ ] Test character endpoints
- [ ] Test setting endpoints
- [ ] Test plot endpoints
- [ ] Test chapter endpoints
- [ ] Test AI endpoints
- [ ] Test export endpoints

### Cleanup
- [ ] Remove routes directory
- [ ] Remove controllers directory
- [ ] Update imports as needed

### Frontend Integration
- [x] Document frontend tRPC setup
- [ ] Create frontend tRPC client
- [ ] Update React components to use tRPC hooks
- [ ] Test frontend integration

## External API Integration

The StoryForge application integrates with several external API services:

### Required External API Services

1. **OpenAI API**
   - Used for: AI story assistance, character development, and creative suggestions
   - Integration: AI router handles communication with OpenAI API
   - Status: Integrated in `ai.router.ts`

2. **Google OAuth**  
   - Used for: Alternative authentication method
   - Integration: Auth router handles OAuth flow
   - Status: Integrated in `auth.router.ts`

3. **AWS S3**
   - Used for: Storing user-uploaded images and exported files
   - Integration: Export router handles file uploads/downloads
   - Status: Integrated in `export.router.ts`

### API Key Management

- All API keys are stored in environment variables
- The application uses a `.env` file for local development
- In production, environment variables are managed through deployment platform

### Next Steps for API Integration

1. **Enhance Error Handling**
   - Improve error handling for failed API requests
   - Add retry logic for transient failures

2. **Rate Limiting**
   - Implement rate limiting for external API calls to prevent excessive usage
   - Cache common responses where appropriate

3. **Monitoring**
   - Add monitoring for external API usage and errors
   - Set up alerts for API quota limits

## Remaining Tasks

Now that all routers have been implemented, the following tasks remain:

1. **Legacy Code Cleanup**
   - Remove the `routes/` directory
   - Remove the `controllers/` directory
   - Make sure no imports reference the removed files

2. **Testing**
   - Conduct comprehensive testing of all implemented routers
   - Test edge cases and error handling
   - Ensure proper type safety throughout the application

3. **Type Issues**
   - Fix remaining type issues in the User, AI, and Export routers
   - Address ObjectId handling consistently across the application
   - Document patterns for handling MongoDB types with Zod

4. **Frontend Integration**
   - Implement the tRPC client in the frontend
   - Update existing services to use tRPC hooks
   - Test all frontend-backend interactions

5. **Documentation**
   - Enhance OpenAPI documentation with detailed metadata
   - Add example responses to all endpoints
   - Create guides for API integration with external services

The most immediate priority is comprehensive testing of all implemented routers to ensure they function correctly with the frontend before removing the legacy code. 