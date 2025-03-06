# StoryForge - API Service Layer

This document outlines the API service layer for the StoryForge frontend application, detailing the service files, methods, and their integration with the backend using tRPC.

## Table of Contents
1. [Overview](#overview)
2. [tRPC Client Setup](#trpc-client-setup)
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

The API service layer acts as an intermediary between the frontend components and the backend API. By using tRPC, we gain end-to-end type safety with minimal boilerplate. This layer is organized as a combination of tRPC hooks and additional utility functions to manage caching, optimistic updates, and other frontend-specific concerns.

### Directory Structure

```
src/
└── services/
    ├── trpc.ts                 # tRPC client configuration
    ├── hooks/                  # Custom React hooks wrapping tRPC procedures
    │   ├── user.hooks.ts       # User-related hooks
    │   ├── auth.hooks.ts       # Authentication-related hooks
    │   ├── project.hooks.ts    # Project-related hooks
    │   ├── character.hooks.ts  # Character-related hooks
    │   ├── setting.hooks.ts    # Setting-related hooks
    │   ├── plot.hooks.ts       # Plot-related hooks
    │   ├── chapter.hooks.ts    # Chapter-related hooks
    │   ├── export.hooks.ts     # Export-related hooks
    │   └── ai.hooks.ts         # AI generation hooks
    └── types/                  # Shared TypeScript type definitions
        ├── user.types.ts       # User-related types
        ├── auth.types.ts       # Authentication-related types
        ├── project.types.ts    # Project-related types
        ├── character.types.ts # Character-related types
        ├── setting.types.ts    # Setting-related types
        ├── plot.types.ts       # Plot-related types
        ├── chapter.types.ts    # Chapter-related types
        ├── export.types.ts     # Export-related types
        └── ai.types.ts         # AI-related types
        └── ...
```

## tRPC Client Setup

The tRPC client setup provides the foundation for all API calls, with type safety and React Query integration.

### File: `src/services/trpc.ts`

```typescript
import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink, loggerLink } from '@trpc/client';
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import superjson from 'superjson';
import type { AppRouter } from '@server/routers/_app';

// API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create tRPC React hooks
export const trpc = createTRPCReact<AppRouter>();

// Type inference helpers
export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;

// Create tRPC client
export const createTRPCClient = (getToken: () => string | null) => {
  return {
    links: [
      loggerLink({
        enabled: (opts) => process.env.NODE_ENV === 'development' || (opts.direction === 'down' && opts.result instanceof Error),
      }),
      httpBatchLink({
        url: API_BASE_URL,
        headers: () => {
          const token = getToken();
          return token ? { Authorization: `Bearer ${token}` } : {};
        },
      }),
    ],
    transformer: superjson,
  };
};

// tRPC Provider setup for React app
export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const getToken = () => localStorage.getItem('token');
  const [trpcClient] = React.useState(() => trpc.createClient(createTRPCClient(getToken)));

  return (
    <trpc.Provider client={trpcClient}>
      {children}
    </trpc.Provider>
  );
}
```

## Authentication Service

The authentication service handles user registration, login, logout, and profile management using tRPC procedures.

### File: `src/services/hooks/auth.hooks.ts`

```typescript
import { trpc } from '../trpc';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const navigate = useNavigate();
  const utils = trpc.useContext();
  
  // Register mutation
  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      utils.auth.me.invalidate();
    },
  });
  
  // Login mutation
  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      utils.auth.me.invalidate();
    },
  });
  
  // Get current user query
  const { data: currentUser, isLoading: isLoadingUser } = trpc.auth.me.useQuery(
    undefined,
    { enabled: !!localStorage.getItem('token') }
  );
  
  // Update profile mutation
  const updateProfileMutation = trpc.auth.updateProfile.useMutation({
    onSuccess: () => {
      utils.auth.me.invalidate();
    },
  });
  
  // Change password mutation
  const changePasswordMutation = trpc.auth.changePassword.useMutation();
  
  // Forgot password mutation
  const forgotPasswordMutation = trpc.auth.forgotPassword.useMutation();
  
  // Reset password mutation
  const resetPasswordMutation = trpc.auth.resetPassword.useMutation();
  
  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    utils.auth.me.invalidate();
    navigate('/login');
  }, [navigate, utils]);
  
  return {
    currentUser,
    isLoadingUser,
    isLoggedIn: !!currentUser,
    register: registerMutation.mutateAsync,
    login: loginMutation.mutateAsync,
    logout,
    updateProfile: updateProfileMutation.mutateAsync,
    changePassword: changePasswordMutation.mutateAsync,
    forgotPassword: forgotPasswordMutation.mutateAsync,
    resetPassword: resetPasswordMutation.mutateAsync,
    isRegistering: registerMutation.isLoading,
    isLoggingIn: loginMutation.isLoading,
    isUpdatingProfile: updateProfileMutation.isLoading,
  };
};
```

## User Service

The user service handles user creation, retrieval, updating, and deletion, as well as user preferences management using tRPC procedures.
Will need to review and refactor this to fit the needs of the our application.

### File: `src/services/hooks/user.hooks.ts`

```typescript
import { trpc } from '../trpc';

// User list hook
export const useUsers = () => {
  const { data: users, isLoading, error } = trpc.user.getUsers.useQuery();

  return {
    users,
    isLoading,
    error,
  };
};

// Single user hook
export const useUser = (userId: string | undefined) => {
  const { data: user, isLoading, error } = trpc.user.getUserById.useQuery(
    { id: userId! },
    { enabled: !!userId }
  );

  return {
    user,
    isLoading,
    error,
  };
};

// Create user mutation
export const useCreateUser = () => {
  const { mutateAsync, isLoading } = trpc.user.createUser.useMutation();

  return {
    createUser: mutateAsync,
    isCreating: isLoading,
  };
};

// Update user mutation
export const useUpdateUser = () => {
  const { mutateAsync, isLoading } = trpc.user.updateUser.useMutation();

  return {
    updateUser: mutateAsync,
    isUpdating: isLoading,
  };
};

// Delete user mutation    
export const useDeleteUser = () => {
  const { mutateAsync, isLoading } = trpc.user.deleteUser.useMutation();

  return {
    deleteUser: mutateAsync,
    isDeleting: isLoading,
  };
};    

// User preferences hook
export const useUserPreferences = () => {
  const { data: preferences, isLoading, error } = trpc.user.getUserPreferences.useQuery();

  return {    
    preferences,
    isLoading,
    error,
  };
};

// Update user preferences mutation
export const useUpdateUserPreferences = () => {
  const { mutateAsync, isLoading } = trpc.user.updateUserPreferences.useMutation();

  return {
    updateUserPreferences: mutateAsync,
    isUpdatingPreferences: isLoading,
  };
};

// User roles hook
export const useUserRoles = () => {
  const { data: roles, isLoading, error } = trpc.user.getUserRoles.useQuery();

  return {    
    roles,
    isLoading,
    error,
  };
};    

// User permissions hook
export const useUserPermissions = () => {
  const { data: permissions, isLoading, error } = trpc.user.getUserPermissions.useQuery();

  return {    
    permissions,
    isLoading,
    error,
  };
};

// User role assignments hook
export const useUserRoleAssignments = () => {
  const { data: roleAssignments, isLoading, error } = trpc.user.getUserRoleAssignments.useQuery();

  return {        
    roleAssignments,
    isLoading,
    error,
  };
};

// User role assignments mutation
export const useUserRoleAssignmentsMutation = () => {
  const { mutateAsync, isLoading } = trpc.user.updateUserRoleAssignments.useMutation();

  return {
    updateUserRoleAssignments: mutateAsync,
    isUpdatingRoleAssignments: isLoading,
  };
};

// User role assignments mutation
export const useUserRoleAssignmentsMutation = () => {
  const { mutateAsync, isLoading } = trpc.user.updateUserRoleAssignments.useMutation();

  return {
    updateUserRoleAssignments: mutateAsync,
    isUpdatingRoleAssignments: isLoading,
  };
};

// User role assignments mutation
export const useUserRoleAssignmentsMutation = () => {
  const { mutateAsync, isLoading } = trpc.user.updateUserRoleAssignments.useMutation();

  return {
    updateUserRoleAssignments: mutateAsync,
    isUpdatingRoleAssignments: isLoading,
  };
};
```

## Project Service

The project service handles project creation, retrieval, updating, and deletion, as well as collaborator management using tRPC procedures.

### File: `src/services/hooks/project.hooks.ts`

```typescript
import { trpc } from '../trpc';
import { RouterInput } from '../trpc';

// Project list hook
export const useProjects = () => {
  const { data: projects, isLoading, error } = trpc.project.getProjects.useQuery();
  
  return {
    projects,
    isLoading,
    error,
  };
};

// Single project hook
export const useProject = (projectId: string | undefined) => {
  const utils = trpc.useContext();
  
  // Get project by ID query
  const { data: project, isLoading, error } = trpc.project.getProjectById.useQuery(
    { id: projectId! },
    { enabled: !!projectId }
  );
  
  // Create project mutation
  const createProjectMutation = trpc.project.createProject.useMutation({
    onSuccess: () => {
      utils.project.getProjects.invalidate();
    },
  });
  
  // Update project mutation
  const updateProjectMutation = trpc.project.updateProject.useMutation({
    onSuccess: () => {
      if (projectId) {
        utils.project.getProjectById.invalidate({ id: projectId });
        utils.project.getProjects.invalidate();
      }
    },
  });
  
  // Delete project mutation
  const deleteProjectMutation = trpc.project.deleteProject.useMutation({
    onSuccess: () => {
      utils.project.getProjects.invalidate();
    },
  });
  
  return {
    project,
    isLoading,
    error,
    createProject: createProjectMutation.mutateAsync,
    updateProject: updateProjectMutation.mutateAsync,
    deleteProject: deleteProjectMutation.mutateAsync,
    isCreating: createProjectMutation.isLoading,
    isUpdating: updateProjectMutation.isLoading,
    isDeleting: deleteProjectMutation.isLoading,
  };
};

// Project collaborators hook
export const useProjectCollaborators = (projectId: string | undefined) => {
  const utils = trpc.useContext();
  
  // Get collaborators query
  const { data: collaborators, isLoading, error } = trpc.project.getCollaborators.useQuery(
    { projectId: projectId! },
    { enabled: !!projectId }
  );
  
  // Add collaborator mutation
  const addCollaboratorMutation = trpc.project.addCollaborator.useMutation({
    onSuccess: () => {
      if (projectId) {
        utils.project.getCollaborators.invalidate({ projectId });
      }
    },
  });
  
  // Update collaborator mutation
  const updateCollaboratorMutation = trpc.project.updateCollaborator.useMutation({
    onSuccess: () => {
      if (projectId) {
        utils.project.getCollaborators.invalidate({ projectId });
      }
    },
  });
  
  // Remove collaborator mutation
  const removeCollaboratorMutation = trpc.project.removeCollaborator.useMutation({
    onSuccess: () => {
      if (projectId) {
        utils.project.getCollaborators.invalidate({ projectId });
      }
    },
  });
  
  return {
    collaborators,
    isLoading,
    error,
    addCollaborator: addCollaboratorMutation.mutateAsync,
    updateCollaborator: updateCollaboratorMutation.mutateAsync,
    removeCollaborator: removeCollaboratorMutation.mutateAsync,
    isAdding: addCollaboratorMutation.isLoading,
    isUpdating: updateCollaboratorMutation.isLoading,
    isRemoving: removeCollaboratorMutation.isLoading,
  };
};
```

## Character Service

The character service handles character creation, retrieval, updating, and deletion, as well as relationship management using tRPC procedures.

### File: `src/services/hooks/character.hooks.ts`

```typescript
import { trpc } from '../trpc';

// Character list hook
export const useCharacters = (projectId: string | undefined) => {
  const { data: characters, isLoading, error } = trpc.character.getCharacters.useQuery(
    { projectId: projectId! },
    { enabled: !!projectId }
  );
  
  return {
    characters,
    isLoading,
    error,
  };
};

// Single character hook
export const useCharacter = (projectId: string | undefined, characterId: string | undefined) => {
  const utils = trpc.useContext();
  
  // Get character by ID query
  const { data: character, isLoading, error } = trpc.character.getCharacterById.useQuery(
    { characterId: characterId! },
    { enabled: !!characterId }
  );
  
  // Create character mutation
  const createCharacterMutation = trpc.character.createCharacter.useMutation({
    onSuccess: () => {
      if (projectId) {
        utils.character.getCharacters.invalidate({ projectId });
      }
    },
  });
  
  // Update character mutation
  const updateCharacterMutation = trpc.character.updateCharacter.useMutation({
    onSuccess: () => {
      if (characterId) {
        utils.character.getCharacterById.invalidate({ characterId });
      }
      if (projectId) {
        utils.character.getCharacters.invalidate({ projectId });
      }
    },
  });
  
  // Delete character mutation
  const deleteCharacterMutation = trpc.character.deleteCharacter.useMutation({
    onSuccess: () => {
      if (projectId) {
        utils.character.getCharacters.invalidate({ projectId });
      }
    },
  });
  
  return {
    character,
    isLoading,
    error,
    createCharacter: createCharacterMutation.mutateAsync,
    updateCharacter: updateCharacterMutation.mutateAsync,
    deleteCharacter: deleteCharacterMutation.mutateAsync,
    isCreating: createCharacterMutation.isLoading,
    isUpdating: updateCharacterMutation.isLoading,
    isDeleting: deleteCharacterMutation.isLoading,
  };
};

// Character relationships hook
export const useCharacterRelationships = (characterId: string | undefined) => {
  const utils = trpc.useContext();
  
  // Get relationships query
  const { data: relationships, isLoading, error } = trpc.character.getRelationships.useQuery(
    { characterId: characterId! },
    { enabled: !!characterId }
  );
  
  // Update relationships mutation
  const updateRelationshipsMutation = trpc.character.updateRelationships.useMutation({
    onSuccess: () => {
      if (characterId) {
        utils.character.getRelationships.invalidate({ characterId });
      }
    },
  });
  
  return {
    relationships,
    isLoading,
    error,
    updateRelationships: updateRelationshipsMutation.mutateAsync,
    isUpdating: updateRelationshipsMutation.isLoading,
  };
};
```

## Setting Service

The setting service handles setting creation, retrieval, updating, and deletion using tRPC procedures.

### File: `src/services/hooks/setting.hooks.ts`

```typescript
import { trpc } from '../trpc';

// Setting list hook
export const useSettings = (projectId: string | undefined) => {
  const { data: settings, isLoading, error } = trpc.setting.getSettings.useQuery(
    { projectId: projectId! },
    { enabled: !!projectId }
  );
  
  return {
    settings,
    isLoading,
    error,
  };
};

// Single setting hook
export const useSetting = (projectId: string | undefined, settingId: string | undefined) => {
  const utils = trpc.useContext();
  
  // Get setting by ID query
  const { data: setting, isLoading, error } = trpc.setting.getSettingById.useQuery(
    { settingId: settingId! },
    { enabled: !!settingId }
  );
  
  // Create setting mutation
  const createSettingMutation = trpc.setting.createSetting.useMutation({
    onSuccess: () => {
      if (projectId) {
        utils.setting.getSettings.invalidate({ projectId });
      }
    },
  });
  
  // Update setting mutation
  const updateSettingMutation = trpc.setting.updateSetting.useMutation({
    onSuccess: () => {
      if (settingId) {
        utils.setting.getSettingById.invalidate({ settingId });
      }
      if (projectId) {
        utils.setting.getSettings.invalidate({ projectId });
      }
    },
  });
  
  // Delete setting mutation
  const deleteSettingMutation = trpc.setting.deleteSetting.useMutation({
    onSuccess: () => {
      if (projectId) {
        utils.setting.getSettings.invalidate({ projectId });
      }
    },
  });
  
  // Upload map mutation
  const uploadMapMutation = trpc.setting.uploadMap.useMutation({
    onSuccess: () => {
      if (settingId) {
        utils.setting.getSettingById.invalidate({ settingId });
      }
    },
  });
  
  return {
    setting,
    isLoading,
    error,
    createSetting: createSettingMutation.mutateAsync,
    updateSetting: updateSettingMutation.mutateAsync,
    deleteSetting: deleteSettingMutation.mutateAsync,
    uploadMap: uploadMapMutation.mutateAsync,
    isCreating: createSettingMutation.isLoading,
    isUpdating: updateSettingMutation.isLoading,
    isDeleting: deleteSettingMutation.isLoading,
    isUploadingMap: uploadMapMutation.isLoading,
  };
};
```

## Plot Service

The plot service handles plot creation, retrieval, updating, and deletion, as well as plot point management using tRPC procedures.

### File: `src/services/hooks/plot.hooks.ts`

```typescript
import { trpc } from '../trpc';

// Plot list hook
export const usePlots = (projectId: string | undefined) => {
  const { data: plots, isLoading, error } = trpc.plot.getPlots.useQuery(
    { projectId: projectId! },
    { enabled: !!projectId }
  );
  
  return {
    plots,
    isLoading,
    error,
  };
};

// Single plot hook
export const usePlot = (projectId: string | undefined, plotId: string | undefined) => {
  const utils = trpc.useContext();
  
  // Get plot by ID query
  const { data: plot, isLoading, error } = trpc.plot.getPlotById.useQuery(
    { plotId: plotId! },
    { enabled: !!plotId }
  );
  
  // Create plot mutation
  const createPlotMutation = trpc.plot.createPlot.useMutation({
    onSuccess: () => {
      if (projectId) {
        utils.plot.getPlots.invalidate({ projectId });
      }
    },
  });
  
  // Update plot mutation
  const updatePlotMutation = trpc.plot.updatePlot.useMutation({
    onSuccess: () => {
      if (plotId) {
        utils.plot.getPlotById.invalidate({ plotId });
      }
      if (projectId) {
        utils.plot.getPlots.invalidate({ projectId });
      }
    },
  });
  
  // Delete plot mutation
  const deletePlotMutation = trpc.plot.deletePlot.useMutation({
    onSuccess: () => {
      if (projectId) {
        utils.plot.getPlots.invalidate({ projectId });
      }
    },
  });
  
  return {
    plot,
    isLoading,
    error,
    createPlot: createPlotMutation.mutateAsync,
    updatePlot: updatePlotMutation.mutateAsync,
    deletePlot: deletePlotMutation.mutateAsync,
    isCreating: createPlotMutation.isLoading,
    isUpdating: updatePlotMutation.isLoading,
    isDeleting: deletePlotMutation.isLoading,
  };
};

// Plot points hook
export const usePlotPoints = (plotId: string | undefined) => {
  const utils = trpc.useContext();
  
  // Get plot points query
  const { data: plotPoints, isLoading, error } = trpc.plot.getPlotPoints.useQuery(
    { plotId: plotId! },
    { enabled: !!plotId }
  );
  
  // Add plot point mutation
  const addPlotPointMutation = trpc.plot.addPlotPoint.useMutation({
    onSuccess: () => {
      if (plotId) {
        utils.plot.getPlotPoints.invalidate({ plotId });
      }
    },
  });
  
  // Update plot point mutation
  const updatePlotPointMutation = trpc.plot.updatePlotPoint.useMutation({
    onSuccess: () => {
      if (plotId) {
        utils.plot.getPlotPoints.invalidate({ plotId });
      }
    },
  });
  
  // Delete plot point mutation
  const deletePlotPointMutation = trpc.plot.deletePlotPoint.useMutation({
    onSuccess: () => {
      if (plotId) {
        utils.plot.getPlotPoints.invalidate({ plotId });
      }
    },
  });
  
  // Reorder plot points mutation
  const reorderPlotPointsMutation = trpc.plot.reorderPlotPoints.useMutation({
    onSuccess: () => {
      if (plotId) {
        utils.plot.getPlotPoints.invalidate({ plotId });
      }
    },
  });
  
  return {
    plotPoints,
    isLoading,
    error,
    addPlotPoint: addPlotPointMutation.mutateAsync,
    updatePlotPoint: updatePlotPointMutation.mutateAsync,
    deletePlotPoint: deletePlotPointMutation.mutateAsync,
    reorderPlotPoints: reorderPlotPointsMutation.mutateAsync,
    isAdding: addPlotPointMutation.isLoading,
    isUpdating: updatePlotPointMutation.isLoading,
    isDeleting: deletePlotPointMutation.isLoading,
    isReordering: reorderPlotPointsMutation.isLoading,
  };
};
```

## Chapter Service

The chapter service handles chapter creation, retrieval, updating, and deletion, as well as content management using tRPC procedures.

### File: `src/services/hooks/chapter.hooks.ts`

```typescript
import { trpc } from '../trpc';

// Chapter list hook
export const useChapters = (projectId: string | undefined) => {
  const { data: chapters, isLoading, error } = trpc.chapter.getChapters.useQuery(
    { projectId: projectId! },
    { enabled: !!projectId }
  );
  
  return {
    chapters,
    isLoading,
    error,
  };
};

// Single chapter hook
export const useChapter = (projectId: string | undefined, chapterId: string | undefined) => {
  const utils = trpc.useContext();
  
  // Get chapter by ID query
  const { data: chapter, isLoading, error } = trpc.chapter.getChapterById.useQuery(
    { chapterId: chapterId! },
    { enabled: !!chapterId }
  );
  
  // Create chapter mutation
  const createChapterMutation = trpc.chapter.createChapter.useMutation({
    onSuccess: () => {
      if (projectId) {
        utils.chapter.getChapters.invalidate({ projectId });
      }
    },
  });
  
  // Update chapter mutation
  const updateChapterMutation = trpc.chapter.updateChapter.useMutation({
    onSuccess: () => {
      if (chapterId) {
        utils.chapter.getChapterById.invalidate({ chapterId });
      }
      if (projectId) {
        utils.chapter.getChapters.invalidate({ projectId });
      }
    },
  });
  
  // Delete chapter mutation
  const deleteChapterMutation = trpc.chapter.deleteChapter.useMutation({
    onSuccess: () => {
      if (projectId) {
        utils.chapter.getChapters.invalidate({ projectId });
      }
    },
  });
  
  return {
    chapter,
    isLoading,
    error,
    createChapter: createChapterMutation.mutateAsync,
    updateChapter: updateChapterMutation.mutateAsync,
    deleteChapter: deleteChapterMutation.mutateAsync,
    isCreating: createChapterMutation.isLoading,
    isUpdating: updateChapterMutation.isLoading,
    isDeleting: deleteChapterMutation.isLoading,
  };
};

// Chapter content hook
export const useChapterContent = (chapterId: string | undefined) => {
  const utils = trpc.useContext();
  
  // Get chapter content query
  const { data: chapterContent, isLoading, error } = trpc.chapter.getChapterContent.useQuery(
    { chapterId: chapterId! },
    { enabled: !!chapterId }
  );
  
  // Update chapter content mutation
  const updateChapterContentMutation = trpc.chapter.updateChapterContent.useMutation({
    onSuccess: () => {
      if (chapterId) {
        utils.chapter.getChapterContent.invalidate({ chapterId });
      }
    },
  });
  
  return {
    chapterContent,
    isLoading,
    error,
    updateChapterContent: updateChapterContentMutation.mutateAsync,
    isUpdating: updateChapterContentMutation.isLoading,
  };
};

// Chapter reordering hook
export const useChapterReordering = (projectId: string | undefined) => {
  const utils = trpc.useContext();
  
  // Reorder chapters mutation
  const reorderChaptersMutation = trpc.chapter.reorderChapters.useMutation({
    onSuccess: () => {
      if (projectId) {
        utils.chapter.getChapters.invalidate({ projectId });
      }
    },
  });
  
  return {
    reorderChapters: reorderChaptersMutation.mutateAsync,
    isReordering: reorderChaptersMutation.isLoading,
  };
};

// Chapter versions hook
export const useChapterVersions = (chapterId: string | undefined) => {
  const utils = trpc.useContext();
  
  // Get chapter versions query
  const { data: chapterVersions, isLoading, error } = trpc.chapter.getChapterVersions.useQuery(
    { chapterId: chapterId! },
    { enabled: !!chapterId }
  );
  
  // Get chapter version query
  const getChapterVersion = (versionId: string) => {
    return trpc.chapter.getChapterVersion.useQuery(
      { chapterId: chapterId!, versionId },
      { enabled: !!chapterId && !!versionId }
    );
  };
  
  return {
    chapterVersions,
    isLoading,
    error,
    getChapterVersion,
  };
};
```

## Export Service

The export service handles document export creation, retrieval, and downloading using tRPC procedures.

### File: `src/services/hooks/export.hooks.ts`

```typescript
import { trpc } from '../trpc';

// Export list hook
export const useExports = (projectId: string | undefined) => {
  const { data: exports, isLoading, error } = trpc.export.getExports.useQuery(
    { projectId: projectId! },
    { enabled: !!projectId }
  );
  
  return {
    exports,
    isLoading,
    error,
  };
};

// Export formats hook
export const useExportFormats = () => {
  const { data: formats, isLoading, error } = trpc.export.getExportFormats.useQuery();
  
  return {
    formats,
    isLoading,
    error,
  };
};

// Export management hook
export const useExportManagement = (projectId: string | undefined) => {
  const utils = trpc.useContext();
  
  // Create export mutation
  const createExportMutation = trpc.export.createExport.useMutation({
    onSuccess: () => {
      if (projectId) {
        utils.export.getExports.invalidate({ projectId });
      }
    },
  });
  
  // Delete export mutation
  const deleteExportMutation = trpc.export.deleteExport.useMutation({
    onSuccess: () => {
      if (projectId) {
        utils.export.getExports.invalidate({ projectId });
      }
    },
  });
  
  // Helper for downloading exports
  const downloadExport = async (exportId: string, filename: string) => {
    const blob = await trpc.export.downloadExport.mutate({ exportId });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };
  
  return {
    createExport: createExportMutation.mutateAsync,
    deleteExport: deleteExportMutation.mutateAsync,
    downloadExport,
    isCreating: createExportMutation.isLoading,
    isDeleting: deleteExportMutation.isLoading,
  };
};
```

## AI Service

The AI service handles AI-powered content generation, including text and image generation using tRPC procedures.

### File: `src/services/hooks/ai.hooks.ts`

```typescript
import { trpc } from '../trpc';

// AI text generation hook
export const useAITextGeneration = () => {
  const generateTextMutation = trpc.ai.generateText.useMutation();
  
  return {
    generateText: generateTextMutation.mutateAsync,
    isGenerating: generateTextMutation.isLoading,
    error: generateTextMutation.error,
  };
};

// AI image generation hook
export const useAIImageGeneration = () => {
  const generateImageMutation = trpc.ai.generateImage.useMutation();
  
  return {
    generateImage: generateImageMutation.mutateAsync,
    isGenerating: generateImageMutation.isLoading,
    error: generateImageMutation.error,
  };
};

// AI generation saving hook
export const useAISaving = () => {
  const saveGenerationMutation = trpc.ai.saveGeneration.useMutation();
  
  return {
    saveGeneration: saveGenerationMutation.mutateAsync,
    isSaving: saveGenerationMutation.isLoading,
    error: saveGenerationMutation.error,
  };
};

// AI providers hook
export const useAIProviders = () => {
  const { data: providers, isLoading, error } = trpc.ai.getProviders.useQuery();
  
  return {
    providers,
    isLoading,
    error,
  };
};

// AI cost estimation hook
export const useAICostEstimation = () => {
  const getCostEstimateMutation = trpc.ai.getCostEstimate.useMutation();
  
  return {
    getCostEstimate: getCostEstimateMutation.mutateAsync,
    isEstimating: getCostEstimateMutation.isLoading,
    error: getCostEstimateMutation.error,
  };
};

// AI story element generation hooks
export const useAIStoryElementGeneration = (projectId: string | undefined) => {
  // Generation mutations
  const generateCharacterMutation = trpc.ai.generateCharacter.useMutation();
  const generateSettingMutation = trpc.ai.generateSetting.useMutation();
  const generatePlotMutation = trpc.ai.generatePlot.useMutation();
  const generateChapterMutation = trpc.ai.generateChapter.useMutation();
  
  return {
    generateCharacter: (data: any) => generateCharacterMutation.mutateAsync({ ...data, projectId: projectId! }),
    generateSetting: (data: any) => generateSettingMutation.mutateAsync({ ...data, projectId: projectId! }),
    generatePlot: (data: any) => generatePlotMutation.mutateAsync({ ...data, projectId: projectId! }),
    generateChapter: (data: any) => generateChapterMutation.mutateAsync({ ...data, projectId: projectId! }),
    isGeneratingCharacter: generateCharacterMutation.isLoading,
    isGeneratingSetting: generateSettingMutation.isLoading,
    isGeneratingPlot: generatePlotMutation.isLoading,
    isGeneratingChapter: generateChapterMutation.isLoading,
  };
};
```

## Error Handling

The API service layer includes centralized error handling through tRPC's built-in error handling capabilities.

### File: `src/services/hooks/error.hooks.ts`

```typescript
import { TRPCClientError } from '@trpc/client';
import { toast } from 'react-toastify';
import { useState, useCallback } from 'react';

export interface ApiError {
  message: string;
  code?: string;
  field?: string;
}

// Extract error details from tRPC errors
export const getErrorDetails = (error: unknown): ApiError => {
  if (error instanceof TRPCClientError) {
    const trpcError = error.data?.zodError || error.data;
    
    // Handle zod validation errors
    if (trpcError?.zodError) {
      const firstError = trpcError.zodError.fieldErrors[Object.keys(trpcError.zodError.fieldErrors)[0]][0];
      return {
        message: firstError,
        field: Object.keys(trpcError.zodError.fieldErrors)[0],
      };
    }
    
    // Handle tRPC errors with custom shape
    if (trpcError?.code) {
      return {
        message: trpcError.message || 'An error occurred',
        code: trpcError.code,
        field: trpcError.field,
      };
    }
    
    // Handle generic tRPC error
    return {
      message: error.message,
    };
  }
  
  // Handle other errors
  if (error instanceof Error) {
    return { message: error.message };
  }
  
  return { message: 'An unexpected error occurred' };
};

// Hook for handling API errors in UI components
export const useApiError = () => {
  const [error, setError] = useState<ApiError | null>(null);
  
  const handleError = useCallback((err: unknown) => {
    const errorDetails = getErrorDetails(err);
    setError(errorDetails);
    toast.error(errorDetails.message);
    return errorDetails;
  }, []);
  
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  return {
    error,
    handleError,
    clearError,
  };
};
```

## Implementation Plan

The API service layer should be implemented in the following order:

1. **tRPC Client Setup**: Implement the core tRPC client configuration.
2. **User Hooks**: Implement user management functionality.
3. **Authentication Hooks**: Implement user authentication functionality.
4. **Project Hooks**: Implement project management functionality.
5. **Character Hooks**: Implement character management functionality.
6. **Setting Hooks**: Implement setting management functionality.
7. **Plot Hooks**: Implement plot management functionality.
8. **Chapter Hooks**: Implement chapter management functionality.
9. **Export Hooks**: Implement export functionality.
10. **AI Hooks**: Implement AI generation functionality.

### Implementation Steps

1. **Set Up tRPC Client**:
   - Configure tRPC with React Query integration
   - Set up authentication and error handling
   - Create provider component for the React app

2. **Create Type Definitions**:
   - Ensure proper imports of server-defined types
   - Create additional frontend-specific type definitions as needed

3. **Implement Service Hooks**:
   - Create custom React hooks for each domain
   - Implement proper data fetching, caching, and mutation strategies
   - Handle loading states and errors

4. **Integration with Components**:
   - Update UI components to use the tRPC hooks
   - Implement proper loading and error states in the UI

### Testing Strategy

1. **Unit Tests**:
   - Test each custom hook in isolation
   - Mock tRPC responses for predictable testing

2. **Integration Tests**:
   - Test the integration between hooks and components
   - Verify proper data flow and UI updates

3. **End-to-End Tests**:
   - Test complete flows from UI interaction to API call and back
   - Verify proper error handling and loading states 