# StoryForge - Frontend Integration Guide

This guide details how to integrate the tRPC backend with the React frontend for StoryForge.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Setting Up the tRPC Client](#setting-up-the-trpc-client)
- [Creating an API Service Layer](#creating-an-api-service-layer)
- [Implementing Authentication](#implementing-authentication)
- [Migrating Existing Components](#migrating-existing-components)
- [Error Handling](#error-handling)
- [Testing](#testing)
- [Performance Optimizations](#performance-optimizations)
- [Related Documentation](#related-documentation)

## Prerequisites

Before beginning frontend integration, ensure you have:

1. **Node.js** (v16+) installed
2. **The tRPC backend** running successfully
3. **Frontend environment** configured (React 18+)
4. **Required packages** installed:
   ```bash
   npm install @trpc/client @trpc/react-query react-query zod
   ```

## Setting Up the tRPC Client

### 1. Create a tRPC configuration file

Create a file at `src/frontend/src/utils/trpc.ts` with the following content:

```typescript
import { createTRPCReact, httpBatchLink } from '@trpc/react-query';
import { inferRouterOutputs, inferRouterInputs } from '@trpc/server';
import { QueryClient } from '@tanstack/react-query';
import type { AppRouter } from '../../../backend/src/routers/_app';

// Environment variables
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/trpc';

// Create a query client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

// Helper function to get the token from local storage
export const getAuthToken = () => localStorage.getItem('authToken');

// Create the tRPC client
export const trpc = createTRPCReact<AppRouter>();

// Initialize the tRPC client
export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: API_URL,
      headers() {
        const token = getAuthToken();
        return {
          Authorization: token ? `Bearer ${token}` : '',
        };
      },
    }),
  ],
});

// Useful types
export type RouterOutputs = inferRouterOutputs<AppRouter>;
export type RouterInputs = inferRouterInputs<AppRouter>;
```

### 2. Set up the tRPC provider in your app

Update your `src/frontend/src/App.tsx` to include the tRPC provider:

```tsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { trpc, trpcClient, queryClient } from './utils/trpc';
import { AuthProvider } from './contexts/AuthContext';
import Routes from './Routes';

function App() {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Routes />
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
```

## Creating an API Service Layer

Create service files to encapsulate tRPC calls. This creates a clean separation of concerns:

### User Service

Create `src/frontend/src/services/userService.ts`:

```typescript
import { trpc } from '../utils/trpc';

export const useUserService = () => {
  // Get the current user's profile
  const getProfile = () => {
    return trpc.user.getProfile.useQuery();
  };

  // Update the user's profile
  const updateProfile = () => {
    return trpc.user.updateProfile.useMutation();
  };

  // Change the user's password
  const changePassword = () => {
    return trpc.user.changePassword.useMutation();
  };

  return {
    getProfile,
    updateProfile,
    changePassword,
  };
};
```

### Project Service

Create `src/frontend/src/services/projectService.ts`:

```typescript
import { trpc } from '../utils/trpc';
import type { RouterInputs } from '../utils/trpc';

export const useProjectService = () => {
  // Get all projects for the current user
  const getAllProjects = () => {
    return trpc.project.getAllByUser.useQuery();
  };

  // Get a single project by ID
  const getProject = (projectId: string) => {
    return trpc.project.getById.useQuery({ projectId });
  };

  // Create a new project
  const createProject = () => {
    return trpc.project.create.useMutation({
      onSuccess: () => {
        // Invalidate the projects query to refetch the data
        trpc.project.getAllByUser.invalidate();
      },
    });
  };

  // Update an existing project
  const updateProject = () => {
    return trpc.project.update.useMutation({
      onSuccess: (data) => {
        // Invalidate specific queries to refetch data
        trpc.project.getAllByUser.invalidate();
        trpc.project.getById.invalidate({ projectId: data.id });
      },
    });
  };

  // Delete a project
  const deleteProject = () => {
    return trpc.project.delete.useMutation({
      onSuccess: () => {
        // Invalidate the projects query to refetch the data
        trpc.project.getAllByUser.invalidate();
      },
    });
  };

  return {
    getAllProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
  };
};
```

## Implementing Authentication

### 1. Create an Authentication Service

Create `src/frontend/src/services/authService.ts`:

```typescript
import { trpc } from '../utils/trpc';
import type { RouterInputs } from '../utils/trpc';

export const useAuthService = () => {
  // Registration mutation
  const register = () => {
    return trpc.auth.register.useMutation({
      onSuccess: (data) => {
        // Store the token
        localStorage.setItem('authToken', data.token);
      },
    });
  };

  // Login mutation
  const login = () => {
    return trpc.auth.login.useMutation({
      onSuccess: (data) => {
        // Store the token
        localStorage.setItem('authToken', data.token);
      },
    });
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('authToken');
    // Use window.location.href to ensure a full page reload
    window.location.href = '/login';
  };

  // Verify token
  const verifyToken = () => {
    return trpc.auth.verifyToken.useQuery(undefined, {
      // Only execute this query if we have a token
      enabled: !!localStorage.getItem('authToken'),
      retry: false,
      onError: () => {
        // If the token is invalid, remove it
        localStorage.removeItem('authToken');
      },
    });
  };

  return {
    register,
    login,
    logout,
    verifyToken,
  };
};
```

### 2. Create an Authentication Context

Create `src/frontend/src/contexts/AuthContext.tsx`:

```tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuthService } from '../services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any | null>(null);
  
  const auth = useAuthService();
  const { data: tokenData, isLoading: tokenLoading } = auth.verifyToken();
  
  // Effect to check token and set authentication state
  useEffect(() => {
    if (!tokenLoading) {
      setIsAuthenticated(!!tokenData?.valid);
      setIsLoading(false);
    }
  }, [tokenData, tokenLoading]);

  // Login handler
  const login = async (email: string, password: string) => {
    const loginMutation = auth.login();
    const result = await loginMutation.mutateAsync({ email, password });
    setIsAuthenticated(true);
    return result;
  };

  // Register handler
  const register = async (data: any) => {
    const registerMutation = auth.register();
    const result = await registerMutation.mutateAsync(data);
    setIsAuthenticated(true);
    return result;
  };

  // Logout handler
  const logout = () => {
    auth.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    isLoading,
    user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

## Migrating Existing Components

### Example: Login Component

Update `src/frontend/src/components/auth/Login.tsx`:

```tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { TextField, Button, Alert, Box, Typography, Container } from '@mui/material';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        
        {error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
```

### Example: Project List Component

Update `src/frontend/src/components/projects/ProjectList.tsx`:

```tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectService } from '../../services/projectService';
import { 
  Box, Typography, Button, Card, CardContent, 
  CardActions, Grid, CircularProgress, IconButton 
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';

const ProjectList: React.FC = () => {
  const navigate = useNavigate();
  const { getAllProjects, deleteProject } = useProjectService();
  const { data: projects, isLoading, error } = getAllProjects();
  const deleteMutation = deleteProject();

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error loading projects: {error.message}</Typography>;
  }

  const handleDelete = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteMutation.mutateAsync({ projectId });
      } catch (err: any) {
        console.error('Failed to delete project:', err);
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">My Projects</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/projects/new')}
        >
          Create New Project
        </Button>
      </Box>

      {projects?.length === 0 ? (
        <Typography>No projects found. Create your first project!</Typography>
      ) : (
        <Grid container spacing={3}>
          {projects?.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              <Card>
                <CardContent>
                  <Typography variant="h5">{project.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {project.description}
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Created: {new Date(project.createdAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => navigate(`/projects/${project.id}`)}>
                    Open
                  </Button>
                  <IconButton 
                    size="small" 
                    onClick={() => navigate(`/projects/${project.id}/edit`)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    color="error" 
                    onClick={() => handleDelete(project.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ProjectList;
```

## Error Handling

### 1. Create an Error Handler Utility

Create `src/frontend/src/utils/errorHandler.ts`:

```typescript
import { TRPCClientError } from '@trpc/client';
import type { AppRouter } from '../../../backend/src/routers/_app';

type ErrorWithMessage = {
  message: string;
};

// Check if the error has a message property
function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

// Get the error message from any error
export function getErrorMessage(error: unknown): string {
  if (isErrorWithMessage(error)) {
    return error.message;
  }
  
  // For TRPC client errors, get the formatted error message
  if (error instanceof TRPCClientError) {
    if (error.data?.zodError) {
      // Handle Zod validation errors
      const fieldErrors = error.data.zodError.fieldErrors;
      if (fieldErrors) {
        const errorMessages = Object.entries(fieldErrors)
          .map(([field, errors]) => `${field}: ${errors?.join(', ')}`)
          .join('; ');
        return `Validation error: ${errorMessages}`;
      }
    }
    
    // Return the formatted error message
    return error.message;
  }
  
  return String(error);
}

// Format form validation errors from Zod
export function formatZodErrors(error: unknown): Record<string, string> {
  const formattedErrors: Record<string, string> = {};
  
  if (error instanceof TRPCClientError && error.data?.zodError) {
    const { fieldErrors } = error.data.zodError;
    if (fieldErrors) {
      Object.entries(fieldErrors).forEach(([field, errors]) => {
        if (errors && errors.length > 0) {
          formattedErrors[field] = errors[0];
        }
      });
    }
  }
  
  return formattedErrors;
}
```

### 2. Create an Error Boundary Component

Create `src/frontend/src/components/common/ErrorBoundary.tsx`:

```tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    // You could also log the error to an error reporting service here
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            m: 2, 
            maxWidth: 600, 
            mx: 'auto', 
            textAlign: 'center',
            backgroundColor: '#f8f9fa'
          }}
        >
          <Typography variant="h5" color="error" gutterBottom>
            Something went wrong
          </Typography>
          <Typography variant="body1" sx={{ my: 2 }}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={this.handleRetry}
              sx={{ mr: 2 }}
            >
              Try Again
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => window.location.href = '/'}
            >
              Go to Home
            </Button>
          </Box>
        </Paper>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

## Testing

### Example: Test the Authentication Service

Create `src/frontend/src/services/__tests__/authService.test.ts`:

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useAuthService } from '../authService';
import { trpc } from '../../utils/trpc';

// Mock the trpc module
jest.mock('../../utils/trpc', () => ({
  trpc: {
    auth: {
      register: {
        useMutation: jest.fn(),
      },
      login: {
        useMutation: jest.fn(),
      },
      verifyToken: {
        useQuery: jest.fn(),
      },
    },
  },
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('useAuthService', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  it('should handle login successfully', async () => {
    const mockMutateAsync = jest.fn().mockResolvedValue({ token: 'test-token' });
    const mockUseMutation = jest.fn().mockReturnValue({
      mutateAsync: mockMutateAsync,
    });

    (trpc.auth.login.useMutation as jest.Mock).mockImplementation(() => ({
      mutateAsync: mockMutateAsync,
    }));

    const { result } = renderHook(() => useAuthService());
    
    const loginData = { email: 'test@example.com', password: 'password123' };
    
    await act(async () => {
      await result.current.login().mutateAsync(loginData);
    });

    expect(mockMutateAsync).toHaveBeenCalledWith(loginData);
    expect(localStorageMock.getItem('authToken')).toBe('test-token');
  });

  it('should handle logout correctly', () => {
    // Set up a token in localStorage
    localStorageMock.setItem('authToken', 'test-token');
    
    // Mock window.location.href
    const originalLocation = window.location;
    delete window.location;
    window.location = { ...originalLocation, href: '' } as any;
    
    const { result } = renderHook(() => useAuthService());
    
    act(() => {
      result.current.logout();
    });
    
    expect(localStorageMock.getItem('authToken')).toBeNull();
    expect(window.location.href).toBe('/login');
    
    // Restore window.location
    window.location = originalLocation;
  });
});
```

## Performance Optimizations

### 1. Configure Query Caching

The configuration in `src/frontend/src/utils/trpc.ts` already includes basic caching settings:

```typescript
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});
```

### 2. Implement Optimistic Updates

When creating or updating data, implement optimistic updates to improve the perceived performance:

```typescript
// In projectService.ts
const updateProject = () => {
  return trpc.project.update.useMutation({
    // Optimistic update
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries(['project', 'getById', { projectId: variables.projectId }]);
      
      // Snapshot the previous value
      const previousProject = queryClient.getQueryData(['project', 'getById', { projectId: variables.projectId }]);
      
      // Optimistically update to the new value
      queryClient.setQueryData(['project', 'getById', { projectId: variables.projectId }], {
        ...previousProject,
        ...variables,
      });
      
      // Return a context object with the snapshot
      return { previousProject };
    },
    // If the mutation fails, use the context to roll back
    onError: (err, variables, context) => {
      if (context?.previousProject) {
        queryClient.setQueryData(
          ['project', 'getById', { projectId: variables.projectId }],
          context.previousProject
        );
      }
    },
    // Always refetch after error or success
    onSettled: (data) => {
      queryClient.invalidateQueries(['project', 'getById', { projectId: data.id }]);
      queryClient.invalidateQueries(['project', 'getAllByUser']);
    },
  });
};
```

### 3. Implement Prefetching

For predictable user flows, prefetch data to improve the user experience:

```tsx
// In ProjectList.tsx
import { useEffect } from 'react';
import { trpc } from '../../utils/trpc';

const ProjectList: React.FC = () => {
  const { data: projects } = trpc.project.getAllByUser.useQuery();
  
  // Prefetch project details for each project
  useEffect(() => {
    if (projects) {
      projects.forEach(project => {
        // Prefetch project details
        trpc.project.getById.prefetch({ projectId: project.id });
      });
    }
  }, [projects]);
  
  // ... rest of the component
};
```

## Related Documentation

For more information, refer to:
- [15-tRPCMigrationPlan.md](./15-tRPCMigrationPlan.md) - Overview of the tRPC migration
- [15.1-ImplementedEndpoints.md](./15.1-ImplementedEndpoints.md) - Complete list of implemented endpoints
- [16-APITestingGuide.md](./16-APITestingGuide.md) - Guide for API testing 