import React, { Suspense, useEffect } from "react";
import { Switch, Route, Link, useLocation, Router as WouterRouter } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { SignIn, SignUp, SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";
import { Loader2 } from "lucide-react";
import NotFound from "@/pages/not-found";
import MainLayout from "@/components/layout/MainLayout";
import Dashboard from "@/pages/dashboard";
import StoryWizard from "@/pages/story-wizard";
import CharacterWorkshop from "@/pages/character-workshop";
import RealmCrafter from "@/pages/realm-crafter";
import ArtifactVault from "@/pages/artifact-vault";
import PlotArchitect from "@/pages/plot-architect";
import ChapterScribe from "@/pages/chapter-scribe";
import StoryOraclePage from "@/pages/story-oracle";
import TomeBinder from "@/pages/tome-binder";
import LoginPage from "@/pages/login";
import AuthPage from "@/pages/auth-page";
import AuthDebugPage from "@/pages/auth-debug";
import ClerkDebugPage from "@/pages/clerk-debug";
import ClerkAuthPage from "@/pages/clerk-auth";
import ClerkCatchAll from "@/pages/clerk-catch-all";
import { UnifiedProtectedRoute } from "./lib/unified-protected-route";

// Define reusable Clerk components
const ClerkSignIn = () => (
  <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-slate-900 to-slate-800">
    <div className="max-w-md w-full bg-slate-800 rounded-lg shadow-lg p-6">
      <h1 className="text-xl font-bold text-center mb-4 text-white">Sign In</h1>
      <SignIn 
        routing="path" 
        path="/sign-in" 
        signUpUrl="/sign-up" 
        redirectUrl="/dashboard"
        afterSignInUrl="/dashboard"
      />
    </div>
  </div>
);

const ClerkSignUp = () => (
  <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-slate-900 to-slate-800">
    <div className="max-w-md w-full bg-slate-800 rounded-lg shadow-lg p-6">
      <h1 className="text-xl font-bold text-center mb-4 text-white">Sign Up</h1>
      <SignUp 
        routing="path" 
        path="/sign-up" 
        signInUrl="/sign-in" 
        redirectUrl="/dashboard"
        afterSignUpUrl="/dashboard"
      />
    </div>
  </div>
);

const UserProfile = () => (
  <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-slate-900 to-slate-800">
    <div className="max-w-md w-full bg-slate-800 rounded-lg shadow-lg p-6">
      <h1 className="text-xl font-bold text-center mb-4 text-white">User Profile</h1>
      <p className="text-slate-300 text-center mb-4">
        You can manage your account settings, including email, password, and more.
      </p>
      
      <div className="flex justify-center mb-6">
        <SignedIn>
          <div className="flex flex-col items-center space-y-4">
            <UserButton />
            <span className="text-sm text-slate-400">Click your avatar to manage your account</span>
          </div>
        </SignedIn>
        <SignedOut>
          <p className="text-slate-300 text-center">
            Please sign in to manage your account.
          </p>
        </SignedOut>
      </div>
      
      <div className="flex justify-center">
        <Link 
          to="/dashboard" 
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white font-medium"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  </div>
);

// Create wrapped functional components for protected routes
const DashboardWrapper = () => <Dashboard />;
const StoryWizardWrapper = () => <StoryWizard />;
const CharacterWorkshopWrapper = () => <CharacterWorkshop />;
const RealmCrafterWrapper = () => <RealmCrafter />;
const ArtifactVaultWrapper = () => <ArtifactVault />;
const PlotArchitectWrapper = () => <PlotArchitect />;
const ChapterScribeWrapper = () => <ChapterScribe />;
const StoryOracleWrapper = () => <StoryOraclePage />;
const TomeBinderWrapper = () => <TomeBinder />;

// Clerk callback handler - handles auth redirects from Clerk
const ClerkRedirect = () => {
  // This component exists to handle various callback states from Clerk
  // and redirect to the main app when authentication is complete
  const navigate = useLocation()[1];
  const { isLoaded, isSignedIn } = useUser();
  
  useEffect(() => {
    if (isLoaded) {
      // If the user is signed in, redirect to the dashboard
      if (isSignedIn) {
        navigate('/dashboard');
      } else {
        // If not signed in after callback, redirect to auth page
        navigate('/auth');
      }
    }
  }, [isLoaded, isSignedIn, navigate]);
  
  // Display a loading state while checking auth status
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <div className="text-center">
        <Loader2 className="h-10 w-10 animate-spin mx-auto text-indigo-500 mb-4" />
        <p className="text-white">Authenticating...</p>
      </div>
    </div>
  );
};

// Add comprehensive Clerk callback routes
// This covers all possible Clerk callback patterns

function Router() {
  // Create a stateful location that captures unknown routes
  const [location] = useLocation();
  
  // Log the current location for debugging
  useEffect(() => {
    console.log("Current location:", location);
  }, [location]);
  
  return (
    <Switch>
      {/* Protected routes using our unified protection */}
      <UnifiedProtectedRoute path="/" component={DashboardWrapper} />
      <UnifiedProtectedRoute path="/dashboard" component={DashboardWrapper} />
      <UnifiedProtectedRoute path="/story-wizard" component={StoryWizardWrapper} />
      <UnifiedProtectedRoute path="/character-workshop" component={CharacterWorkshopWrapper} />
      <UnifiedProtectedRoute path="/realm-crafter" component={RealmCrafterWrapper} />
      <UnifiedProtectedRoute path="/artifact-vault" component={ArtifactVaultWrapper} />
      <UnifiedProtectedRoute path="/plot-architect" component={PlotArchitectWrapper} />
      <UnifiedProtectedRoute path="/chapter-scribe" component={ChapterScribeWrapper} />
      <UnifiedProtectedRoute path="/story-oracle" component={StoryOracleWrapper} />
      <UnifiedProtectedRoute path="/tome-binder" component={TomeBinderWrapper} />
      
      {/* Authentication routes */}
      <Route path="/login" component={LoginPage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/sign-in" component={ClerkSignIn} />
      <Route path="/sign-up" component={ClerkSignUp} />
      <Route path="/user-profile" component={UserProfile} />
      <Route path="/auth-debug" component={AuthDebugPage} />
      <Route path="/clerk-debug" component={ClerkDebugPage} />
      <Route path="/clerk-auth" component={ClerkAuthPage} />
      
      {/* Standard Clerk callback paths */}
      <Route path="/sso-callback" component={ClerkCatchAll} />
      <Route path="/callback" component={ClerkCatchAll} />
      <Route path="/verify" component={ClerkCatchAll} />
      
      {/* Additional wildcard routes for Clerk callback URLs */}
      <Route path="/oauth/*" component={ClerkCatchAll} />
      <Route path="/api/callback/*" component={ClerkCatchAll} />
      <Route path="/api/oauth/*" component={ClerkCatchAll} />
      <Route path="/google-callback/*" component={ClerkCatchAll} />
      <Route path="/github-callback/*" component={ClerkCatchAll} />
      <Route path="/discord-callback/*" component={ClerkCatchAll} />
      <Route path="/sign-out/*" component={ClerkCatchAll} />
      
      {/* 404 fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <>
      <MainLayout>
        <Router />
      </MainLayout>
      <Toaster />
    </>
  );
}

export default App;
