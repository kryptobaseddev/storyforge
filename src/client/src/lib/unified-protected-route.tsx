import { useUser, useAuth as useClerkAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "./queryClient";

interface UnifiedProtectedRouteProps {
  path: string;
  component: () => React.JSX.Element;
}

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export function UnifiedProtectedRoute({
  path,
  component: Component,
}: UnifiedProtectedRouteProps) {
  // Access Clerk authentication state
  const { isLoaded: clerkLoaded, isSignedIn, user: clerkUser } = useUser();
  const clerkAuth = useClerkAuth();
  
  // State for legacy authentication
  const [legacyAuthStatus, setLegacyAuthStatus] = useState<AuthStatus>('loading');
  const queryClient = useQueryClient();

  // Check legacy auth only if Clerk is not working
  useEffect(() => {
    // Don't check legacy auth if user is signed in with Clerk
    if (clerkLoaded && isSignedIn) {
      setLegacyAuthStatus('unauthenticated'); // We don't need legacy if Clerk works
      return;
    }

    // Check if user is authenticated with the legacy system
    const checkLegacyAuth = async () => {
      try {
        await apiRequest('GET', '/api/user');
        setLegacyAuthStatus('authenticated');
      } catch (error) {
        setLegacyAuthStatus('unauthenticated');
      }
    };

    checkLegacyAuth();
    
    // Set up an interval to periodically refresh the auth status (only for legacy)
    const interval = setInterval(() => {
      // Only check if not authenticated with Clerk
      if (!(clerkLoaded && isSignedIn)) {
        queryClient.invalidateQueries({ queryKey: ['/api/user'] });
        checkLegacyAuth();
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [queryClient, clerkLoaded, isSignedIn]);

  // Sync Clerk auth with our backend
  useEffect(() => {
    // If user is signed in with Clerk, sync the user data with our backend
    if (clerkLoaded && isSignedIn && clerkUser) {
      const syncClerkUser = async () => {
        try {
          console.log("Checking if Clerk user is already synced with database");
          
          // First, try checking auth status for full context
          try {
            const authStatusResponse = await fetch('/api/auth-status', { 
              credentials: 'include' 
            });
            
            if (authStatusResponse.ok) {
              const authStatus = await authStatusResponse.json();
              console.log("Current auth status:", authStatus);
              
              // Check if user is already connected via session
              if (authStatus.sessionAuth) {
                console.log("User already authenticated via session:", authStatus.sessionUser?.username);
                
                // Get full user data to update cache
                const userCheckResponse = await apiRequest('GET', '/api/user');
                const existingUser = await userCheckResponse.json();
                console.log("User exists in database:", existingUser.username);
                
                // User already exists in our database - update query cache
                queryClient.setQueryData(['/api/user'], existingUser);
                return; // No need to sync
              }
            }
          } catch (statusError) {
            console.error("Error checking auth status:", statusError);
          }
          
          // Next, try to get the user directly
          try {
            const userCheckResponse = await apiRequest('GET', '/api/user');
            const existingUser = await userCheckResponse.json();
            console.log("User exists in database:", existingUser.username);
            
            // User already exists in our database - update query cache
            queryClient.setQueryData(['/api/user'], existingUser);
            return; // No need to sync
          } catch (checkError: any) {
            // If error is not a "User not synced" error, we'll continue to sync
            if (checkError.status === 401) {
              console.log("User not found in database, will sync Clerk user");
            } else {
              console.error("Unexpected error checking user:", checkError);
            }
          }
          
          // Get token for auth
          let token;
          try {
            token = await clerkAuth.getToken();
            if (!token) {
              console.error("Could not get Clerk token - token is null");
              return;
            }
          } catch (tokenError) {
            console.error("Error getting Clerk token:", tokenError);
            return;
          }
          
          // Prepare user data for synchronization with fallbacks for missing fields
          const userData = {
            id: clerkUser.id,
            username: clerkUser.username || 
              clerkUser.primaryEmailAddress?.emailAddress?.split('@')[0] || 
              `user_${clerkUser.id.substring(0, 8)}`,
            email: clerkUser.primaryEmailAddress?.emailAddress || null,
            firstName: clerkUser.firstName || null,
            lastName: clerkUser.lastName || null,
            displayName: clerkUser.fullName || clerkUser.username || null,
            avatarInitial: (clerkUser.firstName?.charAt(0) || 
              clerkUser.username?.charAt(0) || 
              clerkUser.primaryEmailAddress?.emailAddress?.charAt(0) || 
              'U').toUpperCase()
          };
          
          console.log("Syncing Clerk user with backend:", userData.username);
          
          // Send to our backend's sync endpoint with the auth token
          const syncResponse = await fetch('/api/sync-clerk-user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ user: userData }),
            credentials: 'include'
          });
          
          // Check response
          if (!syncResponse.ok) {
            const errorText = await syncResponse.text();
            throw new Error(`Sync failed with status: ${syncResponse.status}, ${errorText}`);
          }
          
          // Process response
          const syncedUser = await syncResponse.json();
          console.log("User synchronized successfully:", syncedUser.username);
          
          // Update the user data in the query client cache
          queryClient.setQueryData(['/api/user'], syncedUser);
          
          // Force update state to trigger re-render
          queryClient.invalidateQueries({ queryKey: ['/api/user'] });
          
        } catch (error) {
          console.error("Error in Clerk user sync process:", error);
        }
      };
      
      // Execute the sync process
      syncClerkUser();
    }
  }, [clerkLoaded, isSignedIn, clerkUser, queryClient]);

  // Determine auth status combining both auth systems
  const isAuthenticated = (clerkLoaded && isSignedIn) || legacyAuthStatus === 'authenticated';
  const isCheckingAuth = !clerkLoaded || legacyAuthStatus === 'loading';

  if (isCheckingAuth) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Route>
    );
  }

  if (!isAuthenticated) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  return <Route path={path} component={Component} />;
}