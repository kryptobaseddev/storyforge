import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuthService } from '../hooks/useAuthService';
import { trpc } from '../utils/trpc';
import { useToast } from '../hooks/useToast';

interface UserPreferences {
  theme: string;
  fontSize: number;
  readingLevel: string;
  notificationSettings: Record<string, unknown>;
}

interface UserProfile {
  id: string;
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  age: number | null;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

// Input type for register function
interface RegisterInput {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  age?: number;
}

// Input type for profile update - matching the API expectations
interface UpdateProfileInput {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  avatar?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<unknown>;
  register: (data: RegisterInput) => Promise<unknown>;
  logout: () => void;
  updateProfile: (data: UpdateProfileInput) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  
  const auth = useAuthService();
  const toast = useToast();
  const updateProfileMutation = trpc.user.updateProfile.useMutation();
  
  // Use the profile query directly from the hook
  const { data: profileData, isError, error } = auth.profile;
  
  // Update user when profile data changes
  useEffect(() => {
    if (profileData) {
      setUser(profileData);
    }
  }, [profileData]);
  
  // Effect to check token on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Basic token validation (just checking if it exists)
      setIsAuthenticated(true);
    }
    
    // Set loading to false regardless of auth status
    setIsLoading(false);
  }, []);

  // Logout handler - using useCallback to avoid dependency issues
  const logout = useCallback(() => {
    auth.logout();
    setIsAuthenticated(false);
    setUser(null);
    toast.info('You have been logged out.');
  }, [auth, toast]);

  // Handle errors from profile query
  useEffect(() => {
    if (isError && error) {
      console.error('Error fetching user profile:', error);
      // If there's an authentication error, log out the user
      if (error.data?.code === 'UNAUTHORIZED') {
        toast.error('Your session has expired. Please log in again.');
        logout();
      }
    }
  }, [isError, error, toast, logout]);

  // Login handler
  const login = async (email: string, password: string) => {
    try {
      const result = await auth.login.mutateAsync({ email, password });
      setIsAuthenticated(true);
      
      // Set user from response if available
      if (result.user) {
        setUser(result.user);
      }
      
      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Register handler
  const register = async (data: RegisterInput) => {
    try {
      const result = await auth.register.mutateAsync(data);
      setIsAuthenticated(true);
      
      // Set user from response if available
      if (result.user) {
        setUser(result.user);
      }
      
      return result;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  // Update profile handler
  const updateProfile = async (data: UpdateProfileInput) => {
    try {
      // Use the update profile mutation directly
      await updateProfileMutation.mutateAsync(data);
      
      // Update local user state with proper handling of nullable fields
      setUser(prev => {
        if (!prev) return null;
        
        // Handle nullable fields properly
        const updatedUser = { ...prev };
        
        if (data.username) updatedUser.username = data.username;
        if (data.email) updatedUser.email = data.email;
        if ('firstName' in data) updatedUser.firstName = data.firstName || null;
        if ('lastName' in data) updatedUser.lastName = data.lastName || null;
        if ('age' in data) updatedUser.age = data.age === undefined ? null : data.age;
        
        return updatedUser;
      });
      
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Profile update error:', error);
      throw error;
    }
  };

  const value = {
    isAuthenticated,
    isLoading,
    user,
    login,
    register,
    logout,
    updateProfile,
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