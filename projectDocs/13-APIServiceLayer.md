# StoryForge - API Service Layer

This document outlines the API service layer for the StoryForge frontend application, detailing the service files, methods, and their integration with the backend.

## Table of Contents
1. [Overview](#overview)
2. [Base API Service](#base-api-service)
3. [Authentication Service](#authentication-service)
4. [Project Service](#project-service)
5. [Character Service](#character-service)
6. [Setting Service](#setting-service)
7. [Plot Service](#plot-service)
8. [Chapter Service](#chapter-service)
9. [Export Service](#export-service)
10. [AI Service](#ai-service)
11. [Error Handling](#error-handling)
12. [Implementation Plan](#implementation-plan)

## Overview

The API service layer acts as an intermediary between the frontend components and the backend API. It provides a clean, abstracted interface for making API calls, handling responses, and managing errors. This layer is organized into service modules, each responsible for a specific domain of functionality.

### Directory Structure

```
src/
└── services/
    ├── api.ts                  # Base API configuration
    ├── auth.service.ts         # Authentication-related API calls
    ├── project.service.ts      # Project-related API calls
    ├── character.service.ts    # Character-related API calls
    ├── setting.service.ts      # Setting-related API calls
    ├── plot.service.ts         # Plot-related API calls
    ├── chapter.service.ts      # Chapter-related API calls
    ├── export.service.ts       # Export-related API calls
    ├── ai.service.ts           # AI generation API calls
    └── types/                  # TypeScript interfaces for API requests/responses
        ├── auth.types.ts
        ├── project.types.ts
        └── ...
```

## Base API Service

The base API service (`api.ts`) provides the foundation for all API calls, including configuration for Axios, request interceptors for authentication, and response interceptors for error handling.

### File: `src/services/api.ts`

```typescript
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create Axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    // Handle server errors
    if (error.response?.status === 500) {
      console.error('Server error:', error);
    }
    
    return Promise.reject(error);
  }
);

// Helper methods for common HTTP methods
export const apiService = {
  get: <T>(url: string, config?: AxiosRequestConfig) => 
    api.get<T>(url, config).then(response => response.data),
    
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    api.post<T>(url, data, config).then(response => response.data),
    
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    api.put<T>(url, data, config).then(response => response.data),
    
  delete: <T>(url: string, config?: AxiosRequestConfig) => 
    api.delete<T>(url, config).then(response => response.data),
    
  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    api.patch<T>(url, data, config).then(response => response.data),
};

export default api;
```

## Authentication Service

The authentication service handles user registration, login, logout, and profile management.

### File: `src/services/auth.service.ts`

```typescript
import { apiService } from './api';
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  UserProfile, 
  PasswordChangeRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest
} from './types/auth.types';

const AUTH_URL = '/auth';

export const authService = {
  // Register a new user
  register: (data: RegisterRequest): Promise<AuthResponse> => 
    apiService.post<AuthResponse>(`${AUTH_URL}/register`, data),
  
  // Login user
  login: (data: LoginRequest): Promise<AuthResponse> => 
    apiService.post<AuthResponse>(`${AUTH_URL}/login`, data),
  
  // Logout user
  logout: (): Promise<void> => {
    localStorage.removeItem('token');
    return Promise.resolve();
  },
  
  // Get current user profile
  getCurrentUser: (): Promise<UserProfile> => 
    apiService.get<UserProfile>(`${AUTH_URL}/me`),
  
  // Update user profile
  updateProfile: (data: Partial<UserProfile>): Promise<UserProfile> => 
    apiService.put<UserProfile>(`${AUTH_URL}/me`, data),
  
  // Change password
  changePassword: (data: PasswordChangeRequest): Promise<void> => 
    apiService.post<void>(`${AUTH_URL}/change-password`, data),
  
  // Request password reset
  forgotPassword: (data: ForgotPasswordRequest): Promise<void> => 
    apiService.post<void>(`${AUTH_URL}/forgot-password`, data),
  
  // Reset password with token
  resetPassword: (data: ResetPasswordRequest): Promise<void> => 
    apiService.post<void>(`${AUTH_URL}/reset-password`, data),
  
  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('token');
    return !!token;
  }
};

export default authService;
```

## Project Service

The project service handles project creation, retrieval, updating, and deletion, as well as collaborator management.

### File: `src/services/project.service.ts`

```typescript
import { apiService } from './api';
import { 
  Project, 
  ProjectCreateRequest, 
  ProjectUpdateRequest,
  CollaboratorRequest
} from './types/project.types';

const PROJECT_URL = '/projects';

export const projectService = {
  // Get all projects for current user
  getProjects: (): Promise<Project[]> => 
    apiService.get<Project[]>(PROJECT_URL),
  
  // Get project by ID
  getProjectById: (id: string): Promise<Project> => 
    apiService.get<Project>(`${PROJECT_URL}/${id}`),
  
  // Create new project
  createProject: (data: ProjectCreateRequest): Promise<Project> => 
    apiService.post<Project>(PROJECT_URL, data),
  
  // Update project
  updateProject: (id: string, data: ProjectUpdateRequest): Promise<Project> => 
    apiService.put<Project>(`${PROJECT_URL}/${id}`, data),
  
  // Delete project
  deleteProject: (id: string): Promise<void> => 
    apiService.delete<void>(`${PROJECT_URL}/${id}`),
  
  // Get project collaborators
  getCollaborators: (projectId: string): Promise<any[]> => 
    apiService.get<any[]>(`${PROJECT_URL}/${projectId}/collaborators`),
  
  // Add collaborator to project
  addCollaborator: (projectId: string, data: CollaboratorRequest): Promise<any> => 
    apiService.post<any>(`${PROJECT_URL}/${projectId}/collaborators`, data),
  
  // Remove collaborator from project
  removeCollaborator: (projectId: string, userId: string): Promise<void> => 
    apiService.delete<void>(`${PROJECT_URL}/${projectId}/collaborators/${userId}`),
  
  // Update collaborator permissions
  updateCollaborator: (projectId: string, userId: string, data: Partial<CollaboratorRequest>): Promise<any> => 
    apiService.put<any>(`${PROJECT_URL}/${projectId}/collaborators/${userId}`, data)
};

export default projectService;
```

## Character Service

The character service handles character creation, retrieval, updating, and deletion, as well as relationship management.

### File: `src/services/character.service.ts`

```typescript
import { apiService } from './api';
import { 
  Character, 
  CharacterCreateRequest, 
  CharacterUpdateRequest,
  CharacterRelationship
} from './types/character.types';

const CHARACTER_URL = '/characters';

export const characterService = {
  // Get all characters for a project
  getCharacters: (projectId: string): Promise<Character[]> => 
    apiService.get<Character[]>(`/projects/${projectId}/characters`),
  
  // Get character by ID
  getCharacterById: (characterId: string): Promise<Character> => 
    apiService.get<Character>(`${CHARACTER_URL}/${characterId}`),
  
  // Create new character
  createCharacter: (projectId: string, data: CharacterCreateRequest): Promise<Character> => 
    apiService.post<Character>(`/projects/${projectId}/characters`, data),
  
  // Update character
  updateCharacter: (characterId: string, data: CharacterUpdateRequest): Promise<Character> => 
    apiService.put<Character>(`${CHARACTER_URL}/${characterId}`, data),
  
  // Delete character
  deleteCharacter: (characterId: string): Promise<void> => 
    apiService.delete<void>(`${CHARACTER_URL}/${characterId}`),
  
  // Get character relationships
  getRelationships: (characterId: string): Promise<CharacterRelationship[]> => 
    apiService.get<CharacterRelationship[]>(`${CHARACTER_URL}/${characterId}/relationships`),
  
  // Update character relationships
  updateRelationships: (characterId: string, relationships: CharacterRelationship[]): Promise<CharacterRelationship[]> => 
    apiService.put<CharacterRelationship[]>(`${CHARACTER_URL}/${characterId}/relationships`, { relationships })
};

export default characterService;
```

## Setting Service

The setting service handles setting creation, retrieval, updating, and deletion.

### File: `src/services/setting.service.ts`

```typescript
import { apiService } from './api';
import { 
  Setting, 
  SettingCreateRequest, 
  SettingUpdateRequest 
} from './types/setting.types';

const SETTING_URL = '/settings';

export const settingService = {
  // Get all settings for a project
  getSettings: (projectId: string): Promise<Setting[]> => 
    apiService.get<Setting[]>(`/projects/${projectId}/settings`),
  
  // Get setting by ID
  getSettingById: (settingId: string): Promise<Setting> => 
    apiService.get<Setting>(`${SETTING_URL}/${settingId}`),
  
  // Create new setting
  createSetting: (projectId: string, data: SettingCreateRequest): Promise<Setting> => 
    apiService.post<Setting>(`/projects/${projectId}/settings`, data),
  
  // Update setting
  updateSetting: (settingId: string, data: SettingUpdateRequest): Promise<Setting> => 
    apiService.put<Setting>(`${SETTING_URL}/${settingId}`, data),
  
  // Delete setting
  deleteSetting: (settingId: string): Promise<void> => 
    apiService.delete<void>(`${SETTING_URL}/${settingId}`),
  
  // Upload map image
  uploadMap: (settingId: string, file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('map', file);
    
    return apiService.post<{ url: string }>(
      `${SETTING_URL}/${settingId}/map`, 
      formData, 
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
  }
};

export default settingService;
```

## Plot Service

The plot service handles plot creation, retrieval, updating, and deletion, as well as plot point management.

### File: `src/services/plot.service.ts`

```typescript
import { apiService } from './api';
import { 
  Plot, 
  PlotCreateRequest, 
  PlotUpdateRequest,
  PlotPoint,
  PlotPointCreateRequest,
  PlotPointUpdateRequest
} from './types/plot.types';

const PLOT_URL = '/plots';

export const plotService = {
  // Get all plots for a project
  getPlots: (projectId: string): Promise<Plot[]> => 
    apiService.get<Plot[]>(`/projects/${projectId}/plots`),
  
  // Get plot by ID
  getPlotById: (plotId: string): Promise<Plot> => 
    apiService.get<Plot>(`${PLOT_URL}/${plotId}`),
  
  // Create new plot
  createPlot: (projectId: string, data: PlotCreateRequest): Promise<Plot> => 
    apiService.post<Plot>(`/projects/${projectId}/plots`, data),
  
  // Update plot
  updatePlot: (plotId: string, data: PlotUpdateRequest): Promise<Plot> => 
    apiService.put<Plot>(`${PLOT_URL}/${plotId}`, data),
  
  // Delete plot
  deletePlot: (plotId: string): Promise<void> => 
    apiService.delete<void>(`${PLOT_URL}/${plotId}`),
  
  // Get plot points
  getPlotPoints: (plotId: string): Promise<PlotPoint[]> => 
    apiService.get<PlotPoint[]>(`${PLOT_URL}/${plotId}/points`),
  
  // Add plot point
  addPlotPoint: (plotId: string, data: PlotPointCreateRequest): Promise<PlotPoint> => 
    apiService.post<PlotPoint>(`${PLOT_URL}/${plotId}/points`, data),
  
  // Update plot point
  updatePlotPoint: (plotId: string, pointId: string, data: PlotPointUpdateRequest): Promise<PlotPoint> => 
    apiService.put<PlotPoint>(`${PLOT_URL}/${plotId}/points/${pointId}`, data),
  
  // Delete plot point
  deletePlotPoint: (plotId: string, pointId: string): Promise<void> => 
    apiService.delete<void>(`${PLOT_URL}/${plotId}/points/${pointId}`),
  
  // Reorder plot points
  reorderPlotPoints: (plotId: string, pointIds: string[]): Promise<void> => 
    apiService.put<void>(`${PLOT_URL}/${plotId}/points/reorder`, { pointIds })
};

export default plotService;
```

## Chapter Service

The chapter service handles chapter creation, retrieval, updating, and deletion, as well as content management.

### File: `src/services/chapter.service.ts`

```typescript
import { apiService } from './api';
import { 
  Chapter, 
  ChapterCreateRequest, 
  ChapterUpdateRequest,
  ChapterContent
} from './types/chapter.types';

const CHAPTER_URL = '/chapters';

export const chapterService = {
  // Get all chapters for a project
  getChapters: (projectId: string): Promise<Chapter[]> => 
    apiService.get<Chapter[]>(`/projects/${projectId}/chapters`),
  
  // Get chapter by ID
  getChapterById: (chapterId: string): Promise<Chapter> => 
    apiService.get<Chapter>(`${CHAPTER_URL}/${chapterId}`),
  
  // Create new chapter
  createChapter: (projectId: string, data: ChapterCreateRequest): Promise<Chapter> => 
    apiService.post<Chapter>(`/projects/${projectId}/chapters`, data),
  
  // Update chapter
  updateChapter: (chapterId: string, data: ChapterUpdateRequest): Promise<Chapter> => 
    apiService.put<Chapter>(`${CHAPTER_URL}/${chapterId}`, data),
  
  // Delete chapter
  deleteChapter: (chapterId: string): Promise<void> => 
    apiService.delete<void>(`${CHAPTER_URL}/${chapterId}`),
  
  // Get chapter content
  getChapterContent: (chapterId: string): Promise<ChapterContent> => 
    apiService.get<ChapterContent>(`${CHAPTER_URL}/${chapterId}/content`),
  
  // Update chapter content
  updateChapterContent: (chapterId: string, content: string): Promise<ChapterContent> => 
    apiService.put<ChapterContent>(`${CHAPTER_URL}/${chapterId}/content`, { content }),
  
  // Reorder chapters
  reorderChapters: (projectId: string, chapterIds: string[]): Promise<void> => 
    apiService.put<void>(`/projects/${projectId}/chapters/reorder`, { chapterIds }),
  
  // Get chapter versions
  getChapterVersions: (chapterId: string): Promise<any[]> => 
    apiService.get<any[]>(`${CHAPTER_URL}/${chapterId}/versions`),
  
  // Get specific chapter version
  getChapterVersion: (chapterId: string, versionId: string): Promise<ChapterContent> => 
    apiService.get<ChapterContent>(`${CHAPTER_URL}/${chapterId}/versions/${versionId}`)
};

export default chapterService;
```

## Export Service

The export service handles document export creation, retrieval, and downloading.

### File: `src/services/export.service.ts`

```typescript
import { apiService } from './api';
import { 
  Export, 
  ExportCreateRequest, 
  ExportFormat 
} from './types/export.types';

const EXPORT_URL = '/exports';

export const exportService = {
  // Get all exports for a project
  getExports: (projectId: string): Promise<Export[]> => 
    apiService.get<Export[]>(`/projects/${projectId}/exports`),
  
  // Get export by ID
  getExportById: (exportId: string): Promise<Export> => 
    apiService.get<Export>(`${EXPORT_URL}/${exportId}`),
  
  // Create new export
  createExport: (projectId: string, data: ExportCreateRequest): Promise<Export> => 
    apiService.post<Export>(`/projects/${projectId}/exports`, data),
  
  // Delete export
  deleteExport: (exportId: string): Promise<void> => 
    apiService.delete<void>(`${EXPORT_URL}/${exportId}`),
  
  // Download export file
  downloadExport: (exportId: string): Promise<Blob> => 
    apiService.get<Blob>(`${EXPORT_URL}/${exportId}/download`, {
      responseType: 'blob'
    }),
  
  // Get available export formats
  getExportFormats: (): Promise<ExportFormat[]> => 
    apiService.get<ExportFormat[]>(`${EXPORT_URL}/formats`)
};

export default exportService;
```

## AI Service

The AI service handles AI-powered content generation, including text and image generation.

### File: `src/services/ai.service.ts`

```typescript
import { apiService } from './api';
import { 
  TextGenerationRequest, 
  TextGenerationResponse,
  ImageGenerationRequest,
  ImageGenerationResponse,
  GenerationCostEstimate,
  AIProvider
} from './types/ai.types';

const AI_URL = '/ai';

export const aiService = {
  // Generate text content
  generateText: (data: TextGenerationRequest): Promise<TextGenerationResponse> => 
    apiService.post<TextGenerationResponse>(`${AI_URL}/generate`, data),
  
  // Generate image
  generateImage: (data: ImageGenerationRequest): Promise<ImageGenerationResponse> => 
    apiService.post<ImageGenerationResponse>(`${AI_URL}/generate-image`, data),
  
  // Save generation result
  saveGeneration: (generationId: string): Promise<void> => 
    apiService.put<void>(`${AI_URL}/generations/${generationId}/save`),
  
  // Get cost estimate for generation
  getCostEstimate: (data: TextGenerationRequest | ImageGenerationRequest): Promise<GenerationCostEstimate> => 
    apiService.post<GenerationCostEstimate>(`${AI_URL}/cost-estimate`, data),
  
  // Get available AI providers
  getProviders: (): Promise<AIProvider[]> => 
    apiService.get<AIProvider[]>(`${AI_URL}/providers`),
  
  // Generate character
  generateCharacter: (projectId: string, data: any): Promise<any> => 
    apiService.post<any>(`${AI_URL}/generate-character`, { ...data, project_id: projectId }),
  
  // Generate setting
  generateSetting: (projectId: string, data: any): Promise<any> => 
    apiService.post<any>(`${AI_URL}/generate-setting`, { ...data, project_id: projectId }),
  
  // Generate plot
  generatePlot: (projectId: string, data: any): Promise<any> => 
    apiService.post<any>(`${AI_URL}/generate-plot`, { ...data, project_id: projectId }),
  
  // Generate chapter
  generateChapter: (projectId: string, data: any): Promise<any> => 
    apiService.post<any>(`${AI_URL}/generate-chapter`, { ...data, project_id: projectId })
};

export default aiService;
```

## Error Handling

The API service layer includes centralized error handling to provide consistent error messages and responses across the application.

### File: `src/services/error-handler.ts`

```typescript
import { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  code?: string;
  field?: string;
}

export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof AxiosError && error.response) {
    // Handle structured API errors
    const { data, status } = error.response;
    
    if (data.message) {
      return {
        message: data.message,
        code: data.code,
        field: data.field
      };
    }
    
    // Handle different status codes
    switch (status) {
      case 400:
        return { message: 'Invalid request. Please check your data.' };
      case 401:
        return { message: 'Authentication required. Please log in.' };
      case 403:
        return { message: 'You do not have permission to perform this action.' };
      case 404:
        return { message: 'The requested resource was not found.' };
      case 422:
        return { message: 'Validation error. Please check your input.' };
      case 500:
        return { message: 'Server error. Please try again later.' };
      default:
        return { message: 'An unexpected error occurred.' };
    }
  }
  
  // Handle network errors
  if (error instanceof AxiosError && error.request) {
    return { message: 'Network error. Please check your connection.' };
  }
  
  // Handle other errors
  return { message: 'An unexpected error occurred.' };
};

export default handleApiError;
```

## Implementation Plan

The API service layer should be implemented in the following order:

1. **Base API Service**: Implement the core API configuration with Axios.
2. **Authentication Service**: Implement user authentication functionality.
3. **Project Service**: Implement project management functionality.
4. **Character Service**: Implement character management functionality.
5. **Setting Service**: Implement setting management functionality.
6. **Plot Service**: Implement plot management functionality.
7. **Chapter Service**: Implement chapter management functionality.
8. **Export Service**: Implement export functionality.
9. **AI Service**: Implement AI generation functionality.

### Implementation Steps

1. **Create Type Definitions**:
   - Define TypeScript interfaces for all API requests and responses.
   - Ensure proper typing for all service methods.

2. **Implement Base API Service**:
   - Set up Axios instance with default configuration.
   - Implement request and response interceptors.
   - Create helper methods for common HTTP methods.

3. **Implement Domain-Specific Services**:
   - Implement each service following the patterns outlined above.
   - Ensure proper error handling for each service method.

4. **Create Custom Hooks**:
   - Create React hooks that utilize the services for data fetching and state management.
   - Implement loading, error, and data states for each hook.

5. **Integration with Components**:
   - Connect the services to the UI components through custom hooks.
   - Ensure proper error handling and loading states in the UI.

### Testing Strategy

1. **Unit Tests**:
   - Test each service method in isolation.
   - Mock API responses for predictable testing.

2. **Integration Tests**:
   - Test the integration between services and hooks.
   - Test the integration between hooks and components.

3. **End-to-End Tests**:
   - Test the complete flow from UI interaction to API call and back.
   - Ensure proper error handling and loading states. 