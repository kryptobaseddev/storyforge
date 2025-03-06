import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  redirectPath = '/login'
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const toast = useToast();
  const location = useLocation();

  // Debug logging
  useEffect(() => {
    console.log('ProtectedRoute rendered at path:', location.pathname);
    console.log('ProtectedRoute isAuthenticated:', isAuthenticated);
    console.log('ProtectedRoute isLoading:', isLoading);
  }, [location.pathname, isAuthenticated, isLoading]);

  // Show notification when redirecting to login
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error('You must be logged in to access this page');
    }
  }, [isAuthenticated, isLoading, toast]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div 
        className="flex items-center justify-center h-screen w-full"
        style={{ backgroundColor: 'hsl(var(--background))' }}
      >
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // For debugging purposes, always allow access in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Development mode: bypassing authentication check');
    return <Outlet />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Save the attempted URL for redirecting after login
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // Render child routes if authenticated
  return <Outlet />;
};

export default ProtectedRoute; 