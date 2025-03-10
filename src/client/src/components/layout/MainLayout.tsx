import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useUI } from "@/context/UIContext";
import { useLocation } from "wouter";
import StoryOracle from "@/components/features/ai/StoryOracle";
import { useUser, SignedIn, SignedOut } from "@clerk/clerk-react";
import { apiRequest } from "@/lib/queryClient";

type MainLayoutProps = {
  children: React.ReactNode;
};

const toolPathMap: Record<string, {tool: string, title: string}> = {
  '/': { tool: 'dashboard', title: 'Dashboard' },
  '/dashboard': { tool: 'dashboard', title: 'Dashboard' },
  '/story-wizard': { tool: 'wizard', title: 'Story Wizard' },
  '/character-workshop': { tool: 'character', title: 'Character Workshop' },
  '/realm-crafter': { tool: 'realm', title: 'Realm Crafter' },
  '/artifact-vault': { tool: 'artifact', title: 'Artifact Vault' },
  '/plot-architect': { tool: 'plot', title: 'Plot Architect' },
  '/chapter-scribe': { tool: 'chapter', title: 'Chapter Scribe' },
  '/story-oracle': { tool: 'oracle', title: 'Story Oracle' },
  '/tome-binder': { tool: 'tome', title: 'Tome Binder' }
};

// Auth routes where we should use a simplified layout
const authRoutes = ["/sign-in", "/sign-up", "/login", "/user-profile"];

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  // Wrap context usage in try/catch to provide better error handling
  try {
    const { setCurrentTool, oracleOpen } = useUI();
    const [location] = useLocation();
    const { isLoaded, isSignedIn } = useUser();
    const [legacyAuth, setLegacyAuth] = useState<boolean | null>(null);

    // Check if the user is authenticated with the legacy system
    useEffect(() => {
      const checkLegacyAuth = async () => {
        try {
          await apiRequest('GET', '/api/user');
          setLegacyAuth(true);
        } catch (error) {
          setLegacyAuth(false);
        }
      };

      checkLegacyAuth();
    }, []);

    useEffect(() => {
      // Update current tool based on location
      try {
        const pathInfo = toolPathMap[location];
        if (pathInfo) {
          document.title = `StoryForge - ${pathInfo.title}`;
          setCurrentTool(pathInfo.tool as any);
        } else {
          setCurrentTool(null);
        }
      } catch (error) {
        console.error("Error in MainLayout useEffect:", error);
      }
    }, [location, setCurrentTool]);

    // For auth pages, render a simpler layout
    if (authRoutes.includes(location)) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-200 font-inter">
          {children}
        </div>
      );
    }

    // Determine if the user is authenticated with either system
    const isAuthenticated = isSignedIn || legacyAuth;

    // If we're still checking authentication status, show a loading state
    if ((!isLoaded && legacyAuth === null) || (isLoaded && legacyAuth === null)) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-900 text-slate-200">
          <div className="text-center p-8 bg-slate-800 rounded-lg shadow-lg">
            <h1 className="text-xl font-bold mb-4">Loading StoryForge...</h1>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex h-screen overflow-hidden bg-slate-900 text-slate-200 font-inter">
        {/* Show sidebar and header only for authenticated users */}
        {isAuthenticated ? (
          <>
            <Sidebar />
            <main className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800">
              <Header />
              {children}
              
              {/* Story Oracle Assistant - conditionally rendered */}
              {oracleOpen && <StoryOracle />}
            </main>
          </>
        ) : (
          <main className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800">
            {children}
          </main>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error in MainLayout:", error);
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900 text-slate-200">
        <div className="text-center p-8 bg-slate-800 rounded-lg shadow-lg">
          <h1 className="text-xl font-bold mb-4">Something went wrong</h1>
          <p className="mb-4">We encountered an error while loading the application.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white font-medium"
          >
            Reload Application
          </button>
        </div>
      </div>
    );
  }
};

export default MainLayout;
