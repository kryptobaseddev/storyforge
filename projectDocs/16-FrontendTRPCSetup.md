# StoryForge - Frontend tRPC Integration Guide

This document provides step-by-step instructions for setting up and using the tRPC client in the frontend application to communicate with our tRPC-powered backend API.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [tRPC Client Setup](#trpc-client-setup)
4. [Using tRPC Hooks](#using-trpc-hooks)
5. [Error Handling](#error-handling)
6. [Best Practices](#best-practices)

## Prerequisites

Before setting up the tRPC client, ensure you have:

- Node.js 16.x or later
- npm 7.x or later
- Access to the StoryForge backend API
- Frontend project based on Next.js or React

## Installation

Install the required dependencies:

```bash
npm install @trpc/client @trpc/react-query @trpc/server @tanstack/react-query zod superjson
```

## tRPC Client Setup

### 1. Create Types Import from Backend

First, create a file to import types from the backend:

```typescript
// src/types/trpc.ts
import { type AppRouter } from '../../../backend/src/routers/_app';

export type Router = AppRouter;
```

### 2. Create the tRPC Client

Create a file for your tRPC client configuration:

```typescript
// src/utils/trpc.ts
import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink, loggerLink } from '@trpc/client';
import { QueryClient } from '@tanstack/react-query';
import superjson from 'superjson';
import type { Router } from '../types/trpc';

// Create the tRPC client
export const trpc = createTRPCReact<Router>();

// Create a QueryClient for React Query
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 1000, // 5 seconds
      refetchOnWindowFocus: false,
    },
  },
});

// Create the tRPC client configuration
export const trpcClient = trpc.createClient({
  links: [
    loggerLink({
      enabled: (opts) => process.env.NODE_ENV === 'development' || (opts.direction === 'down' && opts.result instanceof Error),
    }),
    httpBatchLink({
      url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/trpc',
      headers: () => {
        // Get the auth token from localStorage
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        
        return {
          Authorization: token ? `Bearer ${token}` : '',
        };
      },
    }),
  ],
  transformer: superjson,
});
```

### 3. Set Up the tRPC Provider

Wrap your application with the tRPC provider:

```typescript
// src/pages/_app.tsx
import { trpc, trpcClient, queryClient } from '../utils/trpc';
import { QueryClientProvider } from '@tanstack/react-query';

function MyApp({ Component, pageProps }) {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default MyApp;
```

## Using tRPC Hooks

Now you can use tRPC hooks throughout your application:

### Queries (fetching data)

```tsx
// Example component fetching projects
import { trpc } from '../utils/trpc';

function ProjectList() {
  // This hook works like useQuery from React Query
  const projectsQuery = trpc.project.getAll.useQuery();

  if (projectsQuery.isLoading) {
    return <div>Loading projects...</div>;
  }

  if (projectsQuery.error) {
    return <div>Error: {projectsQuery.error.message}</div>;
  }

  return (
    <div>
      <h1>My Projects</h1>
      <ul>
        {projectsQuery.data?.map((project) => (
          <li key={project.id}>{project.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Mutations (changing data)

```tsx
// Example component for creating a project
import { trpc } from '../utils/trpc';
import { useState } from 'react';

function CreateProject() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  // Get the query client to invalidate queries after mutation
  const utils = trpc.useContext();
  
  // This hook works like useMutation from React Query
  const createProjectMutation = trpc.project.create.useMutation({
    // When mutation succeeds, invalidate the projects query to refresh data
    onSuccess: () => {
      utils.project.getAll.invalidate();
      setTitle('');
      setDescription('');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createProjectMutation.mutate({
      title,
      description,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Title:</label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <button
        type="submit"
        disabled={createProjectMutation.isLoading}
      >
        {createProjectMutation.isLoading ? 'Creating...' : 'Create Project'}
      </button>
      
      {createProjectMutation.error && (
        <div style={{ color: 'red' }}>
          Error: {createProjectMutation.error.message}
        </div>
      )}
    </form>
  );
}
```

## Error Handling

tRPC provides detailed type information for errors. Here's how to handle them:

```tsx
import { TRPCClientError } from '@trpc/client';
import { trpc } from '../utils/trpc';

function ErrorHandlingExample() {
  const loginMutation = trpc.auth.login.useMutation({
    onError: (error) => {
      if (error instanceof TRPCClientError) {
        // You can check the error code
        if (error.data?.code === 'UNAUTHORIZED') {
          console.error('Invalid credentials');
        } else if (error.data?.code === 'INTERNAL_SERVER_ERROR') {
          console.error('Server error occurred');
        }
      }
    }
  });

  return (
    <div>
      {/* Component content */}
    </div>
  );
}
```

## Best Practices

1. **Organize by features**: Keep related queries and mutations together in feature-specific components or hooks.

2. **Create custom hooks**: Wrap tRPC calls in custom hooks for reusability:

```tsx
// src/hooks/useProjects.ts
import { trpc } from '../utils/trpc';

export function useProjects() {
  const utils = trpc.useContext();
  const projects = trpc.project.getAll.useQuery();
  
  const createProject = trpc.project.create.useMutation({
    onSuccess: () => {
      utils.project.getAll.invalidate();
    },
  });
  
  const deleteProject = trpc.project.delete.useMutation({
    onSuccess: () => {
      utils.project.getAll.invalidate();
    },
  });
  
  return {
    projects,
    createProject,
    deleteProject,
  };
}
```

3. **Optimize queries**: Use query options like `enabled`, `staleTime`, and `cacheTime` to control when and how data is fetched:

```tsx
// Only fetch character data when projectId is available
const characterQuery = trpc.character.getByProject.useQuery(
  { projectId },
  { enabled: !!projectId }
);
```

4. **Prefetch data**: Use prefetching for better user experience:

```tsx
// In a projects list, prefetch character data when hovering over a project
<div
  onMouseEnter={() => {
    trpc.character.getByProject.prefetch({ projectId: project.id });
  }}
>
  {project.title}
</div>
```

5. **Handle loading states**: Use React Suspense or loading indicators:

```tsx
function LoadingWrapper({ children, isLoading, error }) {
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;
  return children;
}

function ProjectPage() {
  const { projects, isLoading, error } = trpc.project.getAll.useQuery();
  
  return (
    <LoadingWrapper isLoading={isLoading} error={error}>
      <ProjectList projects={projects} />
    </LoadingWrapper>
  );
}
```

By following these guidelines, you'll be able to effectively integrate the tRPC client with your frontend application and take advantage of the end-to-end type safety that tRPC provides. 