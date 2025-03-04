# StoryForge - Custom React Hooks

This document outlines the custom React hooks required for the StoryForge application, detailing their purpose, implementation strategy, and usage patterns.

## Table of Contents
1. [Overview](#overview)
2. [Hook Organization](#hook-organization)
3. [Authentication Hooks](#authentication-hooks)
4. [Project Management Hooks](#project-management-hooks)
5. [Character Management Hooks](#character-management-hooks)
6. [Setting Management Hooks](#setting-management-hooks)
7. [Plot Management Hooks](#plot-management-hooks)
8. [Chapter Management Hooks](#chapter-management-hooks)
9. [Export Hooks](#export-hooks)
10. [AI Integration Hooks](#ai-integration-hooks)
11. [Utility Hooks](#utility-hooks)
12. [Testing Strategy](#testing-strategy)
13. [Implementation Plan](#implementation-plan)

## Overview

Custom React hooks are essential to our application architecture, providing reusable logic that encapsulates API calls, state management, and common UI behaviors. These hooks will connect our React components to the API services, ensuring consistent data fetching, error handling, and loading states throughout the application.

Benefits of our custom hooks approach:
- Separation of concerns between UI and data logic
- Consistent patterns for API interactions
- Reduced code duplication
- Simplified component logic
- Centralized error handling
- Improved testability

## Hook Organization

Hooks will be organized in the following directory structure:

```
src/hooks/
├── auth/                  (Authentication hooks)
│   ├── useAuth.ts
│   └── useUser.ts
├── projects/              (Project management hooks)
│   ├── useProjects.ts
│   ├── useProject.ts
│   └── useCollaborators.ts
├── characters/            (Character management hooks)
│   ├── useCharacters.ts
│   ├── useCharacter.ts
│   └── useCharacterRelationships.ts
├── settings/              (Setting management hooks)
│   ├── useSettings.ts
│   └── useSetting.ts
├── plots/                 (Plot management hooks)
│   ├── usePlots.ts
│   ├── usePlot.ts
│   └── usePlotPoints.ts
├── chapters/              (Chapter management hooks)
│   ├── useChapters.ts
│   ├── useChapter.ts
│   └── useChapterContent.ts
├── exports/               (Export hooks)
│   ├── useExports.ts
│   └── useExport.ts
├── ai/                    (AI integration hooks)
│   ├── useAIGeneration.ts
│   └── useAIProvider.ts
└── ui/                    (Utility hooks)
    ├── useForm.ts
    ├── useToast.ts
    ├── useConfirm.ts
    ├── useLoading.ts
    └── useUpload.ts
```

Each hook will follow a consistent implementation pattern, including:
- Type definitions for parameters and return values
- Loading, error, and data states
- Proper cleanup with useEffect
- Integration with our API services

## Authentication Hooks

### `useAuth`

**Purpose**: Manages user authentication state, login, logout, and registration.

**Implementation**:
```typescript
function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Methods: login, logout, register, checkAuthStatus, etc.

  return {
    isAuthenticated,
    user,
    loading,
    error,
    login,
    logout,
    register,
    // Additional methods...
  };
}
```

**Key Functionalities**:
- Authenticate users with username/password
- Store and manage JWT tokens in localStorage
- Check authentication status on app load
- Provide user profile data
- Handle authentication errors

### `useUser`

**Purpose**: Manages user profile data and preferences.

**Implementation**:
```typescript
function useUser() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Methods: getProfile, updateProfile, changePassword, etc.

  return {
    profile,
    loading,
    error,
    getProfile,
    updateProfile,
    changePassword,
    // Additional methods...
  };
}
```

**Key Functionalities**:
- Fetch user profile data
- Update user information
- Change password
- Manage user preferences

## Project Management Hooks

### `useProjects`

**Purpose**: Fetches and manages the list of user projects.

**Implementation**:
```typescript
function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Methods: fetchProjects, createProject, etc.

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    // Additional methods...
  };
}
```

**Key Functionalities**:
- Fetch all user projects
- Create new projects
- Filter and search projects
- Sort projects by different criteria

### `useProject`

**Purpose**: Fetches and manages data for a single project.

**Implementation**:
```typescript
function useProject(projectId: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Methods: fetchProject, updateProject, deleteProject, etc.

  return {
    project,
    loading,
    error,
    fetchProject,
    updateProject,
    deleteProject,
    // Additional methods...
  };
}
```

**Key Functionalities**:
- Fetch project details
- Update project information
- Delete project
- Manage project metadata

### `useCollaborators`

**Purpose**: Manages collaborators for a project.

**Implementation**:
```typescript
function useCollaborators(projectId: string) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Methods: fetchCollaborators, addCollaborator, removeCollaborator, etc.

  return {
    collaborators,
    loading,
    error,
    fetchCollaborators,
    addCollaborator,
    removeCollaborator,
    updateCollaboratorPermissions,
    // Additional methods...
  };
}
```

**Key Functionalities**:
- Fetch project collaborators
- Add new collaborators
- Remove collaborators
- Update collaborator permissions

## Character Management Hooks

### `useCharacters`

**Purpose**: Fetches and manages the list of characters for a project.

**Implementation**:
```typescript
function useCharacters(projectId: string) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Methods: fetchCharacters, createCharacter, etc.

  return {
    characters,
    loading,
    error,
    fetchCharacters,
    createCharacter,
    // Additional methods...
  };
}
```

**Key Functionalities**:
- Fetch all characters for a project
- Create new characters
- Filter and search characters
- Sort characters by different criteria

### `useCharacter`

**Purpose**: Fetches and manages data for a single character.

**Implementation**:
```typescript
function useCharacter(characterId: string) {
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Methods: fetchCharacter, updateCharacter, deleteCharacter, etc.

  return {
    character,
    loading,
    error,
    fetchCharacter,
    updateCharacter,
    deleteCharacter,
    // Additional methods...
  };
}
```

**Key Functionalities**:
- Fetch character details
- Update character information
- Delete character
- Manage character attributes

### `useCharacterRelationships`

**Purpose**: Manages relationships between characters.

**Implementation**:
```typescript
function useCharacterRelationships(characterId: string) {
  const [relationships, setRelationships] = useState<CharacterRelationship[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Methods: fetchRelationships, addRelationship, updateRelationship, etc.

  return {
    relationships,
    loading,
    error,
    fetchRelationships,
    addRelationship,
    updateRelationship,
    removeRelationship,
    // Additional methods...
  };
}
```

**Key Functionalities**:
- Fetch character relationships
- Create new relationships
- Update existing relationships
- Delete relationships

## Setting Management Hooks

### `useSettings`

**Purpose**: Fetches and manages the list of settings for a project.

**Implementation**:
```typescript
function useSettings(projectId: string) {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Methods: fetchSettings, createSetting, etc.

  return {
    settings,
    loading,
    error,
    fetchSettings,
    createSetting,
    // Additional methods...
  };
}
```

**Key Functionalities**:
- Fetch all settings for a project
- Create new settings
- Filter and search settings
- Sort settings by different criteria

### `useSetting`

**Purpose**: Fetches and manages data for a single setting.

**Implementation**:
```typescript
function useSetting(settingId: string) {
  const [setting, setSetting] = useState<Setting | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Methods: fetchSetting, updateSetting, deleteSetting, uploadMap, etc.

  return {
    setting,
    loading,
    error,
    fetchSetting,
    updateSetting,
    deleteSetting,
    uploadMap,
    // Additional methods...
  };
}
```

**Key Functionalities**:
- Fetch setting details
- Update setting information
- Delete setting
- Upload and manage setting maps/images

## Plot Management Hooks

### `usePlots`

**Purpose**: Fetches and manages the list of plots for a project.

**Implementation**:
```typescript
function usePlots(projectId: string) {
  const [plots, setPlots] = useState<Plot[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Methods: fetchPlots, createPlot, etc.

  return {
    plots,
    loading,
    error,
    fetchPlots,
    createPlot,
    // Additional methods...
  };
}
```

**Key Functionalities**:
- Fetch all plots for a project
- Create new plots
- Filter and search plots
- Sort plots by different criteria

### `usePlot`

**Purpose**: Fetches and manages data for a single plot.

**Implementation**:
```typescript
function usePlot(plotId: string) {
  const [plot, setPlot] = useState<Plot | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Methods: fetchPlot, updatePlot, deletePlot, etc.

  return {
    plot,
    loading,
    error,
    fetchPlot,
    updatePlot,
    deletePlot,
    // Additional methods...
  };
}
```

**Key Functionalities**:
- Fetch plot details
- Update plot information
- Delete plot
- Manage plot metadata

### `usePlotPoints`

**Purpose**: Manages plot points within a plot.

**Implementation**:
```typescript
function usePlotPoints(plotId: string) {
  const [plotPoints, setPlotPoints] = useState<PlotPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Methods: fetchPlotPoints, addPlotPoint, updatePlotPoint, reorderPlotPoints, etc.

  return {
    plotPoints,
    loading,
    error,
    fetchPlotPoints,
    addPlotPoint,
    updatePlotPoint,
    deletePlotPoint,
    reorderPlotPoints,
    // Additional methods...
  };
}
```

**Key Functionalities**:
- Fetch plot points
- Add new plot points
- Update existing plot points
- Delete plot points
- Reorder plot points

## Chapter Management Hooks

### `useChapters`

**Purpose**: Fetches and manages the list of chapters for a project.

**Implementation**:
```typescript
function useChapters(projectId: string) {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Methods: fetchChapters, createChapter, reorderChapters, etc.

  return {
    chapters,
    loading,
    error,
    fetchChapters,
    createChapter,
    reorderChapters,
    // Additional methods...
  };
}
```

**Key Functionalities**:
- Fetch all chapters for a project
- Create new chapters
- Reorder chapters
- Filter and sort chapters

### `useChapter`

**Purpose**: Fetches and manages data for a single chapter.

**Implementation**:
```typescript
function useChapter(chapterId: string) {
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Methods: fetchChapter, updateChapter, deleteChapter, etc.

  return {
    chapter,
    loading,
    error,
    fetchChapter,
    updateChapter,
    deleteChapter,
    // Additional methods...
  };
}
```

**Key Functionalities**:
- Fetch chapter details
- Update chapter metadata
- Delete chapter
- Manage chapter versions

### `useChapterContent`

**Purpose**: Manages the content of a chapter with auto-save functionality.

**Implementation**:
```typescript
function useChapterContent(chapterId: string) {
  const [content, setContent] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Methods: fetchContent, saveContent, getVersions, etc.

  return {
    content,
    saving,
    loading,
    error,
    lastSaved,
    fetchContent,
    saveContent,
    getVersions,
    restoreVersion,
    // Additional methods...
  };
}
```

**Key Functionalities**:
- Fetch chapter content
- Auto-save content while editing
- Track saving status
- Manage content versions
- Restore previous versions

## Export Hooks

### `useExports`

**Purpose**: Fetches and manages the list of exports for a project.

**Implementation**:
```typescript
function useExports(projectId: string) {
  const [exports, setExports] = useState<Export[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Methods: fetchExports, createExport, etc.

  return {
    exports,
    loading,
    error,
    fetchExports,
    createExport,
    // Additional methods...
  };
}
```

**Key Functionalities**:
- Fetch all exports for a project
- Create new exports
- Filter exports by format
- Sort exports by date

### `useExport`

**Purpose**: Fetches and manages data for a single export.

**Implementation**:
```typescript
function useExport(exportId: string) {
  const [exportData, setExportData] = useState<Export | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Methods: fetchExport, downloadExport, deleteExport, etc.

  return {
    exportData,
    loading,
    error,
    fetchExport,
    downloadExport,
    deleteExport,
    // Additional methods...
  };
}
```

**Key Functionalities**:
- Fetch export details
- Download export file
- Delete export
- Track export status

## AI Integration Hooks

### `useAIGeneration`

**Purpose**: Manages AI-powered content generation.

**Implementation**:
```typescript
function useAIGeneration() {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Methods: generateText, generateImage, saveGeneration, etc.

  return {
    result,
    loading,
    error,
    generateText,
    generateImage,
    saveGeneration,
    getCostEstimate,
    // Additional methods...
  };
}
```

**Key Functionalities**:
- Generate text content with AI
- Generate images with AI
- Track generation status
- Estimate generation costs
- Save generated content

### `useAIProvider`

**Purpose**: Manages AI provider selection and preferences.

**Implementation**:
```typescript
function useAIProvider() {
  const [provider, setProvider] = useState<string>('deepseek');
  const [providers, setProviders] = useState<AIProvider[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Methods: fetchProviders, selectProvider, etc.

  return {
    provider,
    providers,
    loading,
    error,
    fetchProviders,
    selectProvider,
    getProviderCapabilities,
    // Additional methods...
  };
}
```

**Key Functionalities**:
- List available AI providers
- Select preferred provider
- Get provider capabilities
- Store provider preferences

## Utility Hooks

### `useForm`

**Purpose**: Generic form state management with validation.

**Implementation**:
```typescript
function useForm<T>(initialValues: T, validate: (values: T) => Partial<Record<keyof T, string>>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Methods: handleChange, handleBlur, handleSubmit, resetForm, etc.

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    // Additional methods...
  };
}
```

**Key Functionalities**:
- Track form values
- Validate form inputs
- Track touched fields
- Handle form submission
- Reset form state

### `useToast`

**Purpose**: Manages toast notifications.

**Implementation**:
```typescript
function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Methods: addToast, removeToast, etc.

  return {
    toasts,
    addToast,
    removeToast,
    // Additional methods...
  };
}
```

**Key Functionalities**:
- Show success, error, warning, and info toasts
- Auto-dismiss toasts after timeout
- Allow manual dismissal
- Stack multiple toasts

### `useConfirm`

**Purpose**: Manages confirmation dialogs.

**Implementation**:
```typescript
function useConfirm() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [config, setConfig] = useState<ConfirmConfig | null>(null);

  // Methods: confirm, cancel, etc.

  return {
    isOpen,
    config,
    confirm,
    cancel,
    // Additional methods...
  };
}
```

**Key Functionalities**:
- Show confirmation dialogs
- Handle confirm and cancel actions
- Customize dialog content
- Support for dangerous actions

### `useLoading`

**Purpose**: Manages loading states for async operations.

**Implementation**:
```typescript
function useLoading() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingText, setLoadingText] = useState<string | null>(null);

  // Methods: startLoading, stopLoading, withLoading, etc.

  return {
    isLoading,
    loadingText,
    startLoading,
    stopLoading,
    withLoading,
    // Additional methods...
  };
}
```

**Key Functionalities**:
- Track loading state
- Display loading text
- Wrap async functions with loading state

### `useUpload`

**Purpose**: Manages file uploads with progress tracking.

**Implementation**:
```typescript
function useUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  // Methods: selectFiles, uploadFiles, cancelUpload, etc.

  return {
    files,
    uploading,
    progress,
    error,
    selectFiles,
    uploadFiles,
    cancelUpload,
    // Additional methods...
  };
}
```

**Key Functionalities**:
- Select files for upload
- Track upload progress
- Cancel ongoing uploads
- Handle upload errors

## Testing Strategy

Our custom hooks will be thoroughly tested to ensure reliability and correct behavior:

1. **Unit Tests**:
   - Test each hook in isolation
   - Mock API calls using tools like `msw` (Mock Service Worker)
   - Test error handling and edge cases
   - Verify state updates correctly

2. **Integration Tests**:
   - Test hooks with real components
   - Verify data flows correctly between hooks and components
   - Test side effects and cleanup

3. **Mock Implementation**:
   - Create mock versions of each hook for UI development and testing
   - Provide predictable responses for various scenarios

4. **Test Utilities**:
   - Create custom testing utilities for hooks
   - Implement render helpers for testing hooks with components

## Implementation Plan

We will implement the custom hooks in the following order:

1. **Core Utility Hooks**:
   - `useForm`
   - `useToast`
   - `useLoading`

2. **Authentication Hooks**:
   - `useAuth`
   - `useUser`

3. **Project Management Hooks**:
   - `useProjects`
   - `useProject`
   - `useCollaborators`

4. **Entity Management Hooks**:
   - `useCharacters` and `useCharacter`
   - `useSettings` and `useSetting`
   - `usePlots` and `usePlot`
   - `useChapters` and `useChapter`

5. **Advanced Functionality Hooks**:
   - `useChapterContent`
   - `usePlotPoints`
   - `useCharacterRelationships`
   - `useExports` and `useExport`

6. **AI Integration Hooks**:
   - `useAIGeneration`
   - `useAIProvider`

Each hook will start with a basic implementation and be expanded with additional functionality as needed. 