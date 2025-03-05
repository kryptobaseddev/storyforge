# StoryForge tRPC Frontend Integration Guide

This document provides step-by-step instructions for integrating the StoryForge frontend with the newly migrated tRPC backend.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Setting Up tRPC Client](#setting-up-trpc-client)
3. [Creating API Service Layer](#creating-api-service-layer)
4. [Implementing Authentication](#implementing-authentication)
5. [Migrating Existing Components](#migrating-existing-components)
6. [Error Handling](#error-handling)
7. [Testing](#testing)
8. [Performance Optimizations](#performance-optimizations)

## Prerequisites

Before starting the frontend integration, ensure you have:

- Node.js (v16+) installed
- The tRPC backend running successfully
- Confirmed all backend endpoints work using the testing scripts

Required packages:
```bash
npm install @trpc/client @trpc/react-query react-query zod
```

## Setting Up tRPC Client

### 1. Create a tRPC Client Configuration

Create a new file `src/frontend/src/utils/trpc.ts`:

```typescript
import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import { QueryClient } from '@tanstack/react-query';
import type { AppRouter } from '../../../backend/src/routers/_app';

// API URL (should come from environment variables in production)
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/trpc';

// Create the tRPC client
export const trpc = createTRPCReact<AppRouter>();

// Create a query client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Create the tRPC links
export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: API_URL,
      // Add headers to every request
      headers() {
        const token = localStorage.getItem('token');
        return {
          Authorization: token ? `Bearer ${token}` : '',
        };
      },
    }),
  ],
});
```

### 2. Set Up the tRPC Provider

Update your `src/frontend/src/App.tsx` to include the tRPC provider:

```typescript
import { trpc, trpcClient, queryClient } from './utils/trpc';
import { QueryClientProvider } from '@tanstack/react-query';

function App() {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {/* Your app components */}
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
```

## Creating API Service Layer

Create service modules for each domain area to encapsulate API calls:

### Example: User Service

Create `src/frontend/src/services/userService.ts`:

```typescript
import { trpc } from '../utils/trpc';

export const useUserService = () => {
  const getProfile = trpc.user.getProfile.useQuery(undefined, {
    // Only fetch when needed
    enabled: false,
  });

  const updateProfile = trpc.user.updateProfile.useMutation();
  
  const changePassword = trpc.user.changePassword.useMutation();
  
  const updatePreferences = trpc.user.updatePreferences.useMutation();

  return {
    getProfile,
    updateProfile,
    changePassword,
    updatePreferences,
  };
};
```

### Example: Project Service

Create `src/frontend/src/services/projectService.ts`:

```typescript
import { trpc } from '../utils/trpc';

export const useProjectService = () => {
  const getAllProjects = trpc.project.getAllByUser.useQuery(undefined, {
    // Only fetch when component mounts
    enabled: true,
  });
  
  const getProjectById = (id: string) => {
    return trpc.project.getById.useQuery({ id }, {
      // Only fetch when ID is available
      enabled: !!id,
    });
  };
  
  const createProject = trpc.project.create.useMutation({
    // Invalidate projects query after mutation
    onSuccess: () => {
      trpc.useContext().project.getAllByUser.invalidate();
    },
  });
  
  const updateProject = trpc.project.update.useMutation({
    // Invalidate specific project and all projects
    onSuccess: (_data, variables) => {
      trpc.useContext().project.getById.invalidate({ id: variables.id });
      trpc.useContext().project.getAllByUser.invalidate();
    },
  });
  
  const deleteProject = trpc.project.delete.useMutation({
    // Invalidate projects list after deletion
    onSuccess: () => {
      trpc.useContext().project.getAllByUser.invalidate();
    },
  });

  return {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
  };
};
```

## Implementing Authentication

### 1. Create an Auth Service

Create `src/frontend/src/services/authService.ts`:

```typescript
import { trpc } from '../utils/trpc';

export const useAuthService = () => {
  const login = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      // Store token in localStorage
      localStorage.setItem('token', data.token);
      // Invalidate user data
      trpc.useContext().user.getProfile.invalidate();
    },
  });
  
  const register = trpc.auth.register.useMutation();
  
  const logout = () => {
    localStorage.removeItem('token');
    // Invalidate all queries
    trpc.useContext().invalidate();
  };
  
  const verifyToken = trpc.auth.verifyToken.useQuery(undefined, {
    // Only run when token exists
    enabled: !!localStorage.getItem('token'),
    retry: false,
    onError: () => {
      // Clear invalid token
      localStorage.removeItem('token');
    },
  });
  
  const isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };

  return {
    login,
    register,
    logout,
    verifyToken,
    isAuthenticated,
  };
};
```

### 2. Create Authentication Context

Create `src/frontend/src/contexts/AuthContext.tsx`:

```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuthService } from '../services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const auth = useAuthService();

  useEffect(() => {
    // Check authentication on load
    const token = localStorage.getItem('token');
    if (token) {
      auth.verifyToken.refetch().then((result) => {
        setIsAuthenticated(!!result.data);
        setIsLoading(false);
      }).catch(() => {
        setIsAuthenticated(false);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await auth.login.mutateAsync({ email, password });
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      await auth.register.mutateAsync({ name, email, password });
      // Optionally auto-login after registration
      await login(email, password);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    auth.logout();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### 3. Add the Auth Provider to App

Update your `src/frontend/src/App.tsx`:

```typescript
import { trpc, trpcClient, queryClient } from './utils/trpc';
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {/* Your app components */}
        </AuthProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
```

## Migrating Existing Components

### Example: Login Component

Update `src/frontend/src/components/auth/Login.tsx`:

```typescript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
```

### Example: Project List Component

Update `src/frontend/src/components/projects/ProjectList.tsx`:

```typescript
import React from 'react';
import { Link } from 'react-router-dom';
import { useProjectService } from '../../services/projectService';

const ProjectList: React.FC = () => {
  const { getAllProjects, deleteProject } = useProjectService();
  const { data: projects, isLoading, error } = getAllProjects;

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject.mutateAsync({ id });
      } catch (err) {
        console.error('Failed to delete project:', err);
      }
    }
  };

  if (isLoading) return <div>Loading projects...</div>;
  if (error) return <div>Error loading projects: {error.message}</div>;

  return (
    <div className="project-list">
      <h2>My Projects</h2>
      <Link to="/projects/new" className="create-button">
        Create New Project
      </Link>
      
      {projects?.length === 0 ? (
        <p>No projects yet. Create your first project!</p>
      ) : (
        <div className="project-grid">
          {projects?.map((project) => (
            <div key={project.id} className="project-card">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="project-actions">
                <Link to={`/projects/${project.id}`}>Open</Link>
                <Link to={`/projects/${project.id}/edit`}>Edit</Link>
                <button 
                  onClick={() => handleDelete(project.id)}
                  disabled={deleteProject.isLoading}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectList;
```

## Error Handling

### Create Error Handler Utility

Create `src/frontend/src/utils/errorHandler.ts`:

```typescript
import { TRPCClientError } from '@trpc/client';

export type ErrorWithMessage = {
  message: string;
};

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof TRPCClientError) {
    // Handle tRPC specific errors
    const trpcError = error.data;
    if (trpcError && 'message' in trpcError) {
      return trpcError.message as string;
    }
    
    // For validation errors, typically in zodError
    if (trpcError && 'zodError' in trpcError) {
      const zodError = trpcError.zodError as any;
      if (zodError && zodError.fieldErrors) {
        const fields = Object.keys(zodError.fieldErrors);
        if (fields.length) {
          const fieldName = fields[0];
          const errorMsg = zodError.fieldErrors[fieldName][0];
          return `${fieldName}: ${errorMsg}`;
        }
      }
    }
  }
  
  if (isErrorWithMessage(error)) {
    return error.message;
  }
  
  return 'An unknown error occurred';
}
```

### Create Error Boundary Component

Create `src/frontend/src/components/common/ErrorBoundary.tsx`:

```typescript
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message || 'An unknown error occurred'}</p>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

## Testing

Create unit tests for your services:

### Example: Auth Service Test

Create `src/frontend/src/services/__tests__/authService.test.ts`:

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useAuthService } from '../authService';
import { trpc } from '../../utils/trpc';

// Mock the trpc module
jest.mock('../../utils/trpc', () => ({
  trpc: {
    auth: {
      login: {
        useMutation: jest.fn().mockReturnValue({
          mutateAsync: jest.fn().mockResolvedValue({ token: 'fake-token' }),
        }),
      },
      register: {
        useMutation: jest.fn().mockReturnValue({
          mutateAsync: jest.fn().mockResolvedValue({}),
        }),
      },
      verifyToken: {
        useQuery: jest.fn().mockReturnValue({
          refetch: jest.fn().mockResolvedValue({ data: true }),
        }),
      },
    },
    useContext: jest.fn().mockReturnValue({
      invalidate: jest.fn(),
      user: {
        getProfile: {
          invalidate: jest.fn(),
        },
      },
    }),
  },
}));

describe('useAuthService', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('stores token in localStorage after login', async () => {
    const { result } = renderHook(() => useAuthService());
    
    await act(async () => {
      await result.current.login({ email: 'test@example.com', password: 'password' });
    });
    
    expect(localStorage.getItem('token')).toBe('fake-token');
  });

  it('removes token from localStorage after logout', async () => {
    localStorage.setItem('token', 'fake-token');
    
    const { result } = renderHook(() => useAuthService());
    
    act(() => {
      result.current.logout();
    });
    
    expect(localStorage.getItem('token')).toBeNull();
    expect(trpc.useContext().invalidate).toHaveBeenCalled();
  });

  it('returns isAuthenticated true when token exists', () => {
    localStorage.setItem('token', 'fake-token');
    
    const { result } = renderHook(() => useAuthService());
    
    expect(result.current.isAuthenticated()).toBe(true);
  });

  it('returns isAuthenticated false when token does not exist', () => {
    const { result } = renderHook(() => useAuthService());
    
    expect(result.current.isAuthenticated()).toBe(false);
  });
});
```

## Performance Optimizations

### Use React Query Features

1. **Configure Query Caching**:

Update your `src/frontend/src/utils/trpc.ts`:

```typescript
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});
```

2. **Implement Optimistic Updates**:

Example in a component:

```typescript
const TodoList = () => {
  const utils = trpc.useContext();
  const { data: todos } = trpc.todo.list.useQuery();
  
  const addTodo = trpc.todo.add.useMutation({
    // When mutate is called:
    onMutate: async (newTodo) => {
      // Cancel outgoing fetches
      await utils.todo.list.cancel();
      
      // Get the current data
      const prevData = utils.todo.list.getData();
      
      // Optimistically update to the new value
      utils.todo.list.setData(undefined, (old) => [
        ...(old || []),
        { id: 'temp-id', ...newTodo },
      ]);
      
      // Return context with the previous data
      return { prevData };
    },
    onError: (err, newTodo, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      utils.todo.list.setData(undefined, context?.prevData);
    },
    onSettled: () => {
      // Always refetch after error or success
      utils.todo.list.invalidate();
    },
  });
  
  // Component JSX here
};
```

3. **Implement Prefetching**:

```typescript
const ProjectList = () => {
  const utils = trpc.useContext();
  const { data: projects } = trpc.project.list.useQuery();
  
  // Prefetch project details when hovering over a project
  const prefetchProject = (id: string) => {
    utils.project.getById.prefetch({ id });
  };
  
  return (
    <div>
      {projects?.map((project) => (
        <div 
          key={project.id} 
          onMouseEnter={() => prefetchProject(project.id)}
        >
          {project.title}
        </div>
      ))}
    </div>
  );
};
```

## Migration Strategy

1. **Start with Core Services**: Begin by implementing the authentication and user services
2. **Migrate Feature by Feature**: Migrate one feature at a time, testing thoroughly
3. **Keep Old Services During Transition**: Don't remove old API services until you've validated the new ones
4. **Use Feature Flags**: Consider using feature flags to toggle between old and new implementations
5. **Monitor Performance**: Watch for any performance issues and optimize as needed

Remember that tRPC provides end-to-end type safety, so leverage TypeScript's type checking to catch potential errors early in the development process. 