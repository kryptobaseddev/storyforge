import { useEffect } from "react";
import { useLocation } from "wouter";
import { useUser, useClerk } from "@clerk/clerk-react";
import { Loader2 } from "lucide-react";

/**
 * This component handles all Clerk authentication redirects and callbacks.
 * It's designed to catch any authentication-related paths and redirect to the appropriate page.
 */
export default function ClerkCatchAll() {
  const navigate = useLocation()[1];
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();

  // Log the current URL for debugging
  useEffect(() => {
    console.log("ClerkCatchAll: Current URL:", window.location.href);
    console.log("ClerkCatchAll: Auth state:", { isLoaded, isSignedIn });
  }, [isLoaded, isSignedIn]);

  // Handle authentication state changes
  useEffect(() => {
    if (!isLoaded) return; // Wait until Clerk has loaded
    
    const handleAuth = async () => {
      try {
        if (isSignedIn && user) {
          console.log("User authenticated:", user.primaryEmailAddress?.emailAddress);
          
          // Redirect to dashboard now that user is authenticated
          navigate("/dashboard");
        } else {
          console.log("User not authenticated, redirecting to login");
          
          // If the path contains "sign-out", perform a sign out
          if (window.location.pathname.includes("sign-out")) {
            try {
              await signOut();
            } catch (error) {
              console.error("Error signing out:", error);
            }
          }
          
          // Redirect to login if not authenticated
          navigate("/login");
        }
      } catch (error) {
        console.error("Error in authentication flow:", error);
        navigate("/login");
      }
    };

    handleAuth();
  }, [isLoaded, isSignedIn, user, navigate, signOut]);

  // Show a loading indicator while authentication is processed
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <div className="text-center">
        <Loader2 className="h-10 w-10 animate-spin mx-auto text-indigo-500 mb-4" />
        <p className="text-white">Authenticating...</p>
        <p className="text-slate-400 text-sm mt-2">Processing your authentication...</p>
      </div>
    </div>
  );
}