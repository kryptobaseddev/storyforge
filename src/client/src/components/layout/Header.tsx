import React, { useEffect, useState } from "react";
import { useUI } from "@/context/UIContext";
import { useProject } from "@/context/ProjectContext";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Cog, Bell, Menu, Wand2, LogOut, User, UserCircle } from "lucide-react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { apiRequest } from "@/lib/queryClient";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

const toolTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/dashboard': 'Dashboard',
  '/story-wizard': 'Story Wizard',
  '/character-workshop': 'Character Workshop',
  '/realm-crafter': 'Realm Crafter',
  '/artifact-vault': 'Artifact Vault',
  '/plot-architect': 'Plot Architect',
  '/chapter-scribe': 'Chapter Scribe',
  '/story-oracle': 'Story Oracle',
  '/tome-binder': 'Tome Binder'
};

interface LegacyUser {
  id: number;
  username: string;
  displayName: string | null;
}

const Header: React.FC = () => {
  const { toggleSidebar, currentTool, toggleOracle, setMobileMenuOpen } = useUI();
  const { currentProject } = useProject();
  const [location, navigate] = useLocation();
  const { isLoaded, user, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const { toast } = useToast();
  const [legacyUser, setLegacyUser] = useState<LegacyUser | null>(null);
  const [authType, setAuthType] = useState<'clerk' | 'legacy' | 'none'>('none');

  // Check for legacy authentication
  useEffect(() => {
    const checkLegacyAuth = async () => {
      try {
        const res = await apiRequest('GET', '/api/user');
        const userData = await res.json();
        setLegacyUser(userData);
        setAuthType('legacy');
      } catch (error) {
        // No legacy auth, check if we have Clerk auth
        if (isLoaded && isSignedIn) {
          setAuthType('clerk');
        } else {
          setAuthType('none');
        }
      }
    };

    checkLegacyAuth();
  }, [isLoaded, isSignedIn]);

  // Update auth type when Clerk status changes
  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        setAuthType('clerk');
      } else if (!legacyUser) {
        setAuthType('none');
      }
    }
  }, [isLoaded, isSignedIn, legacyUser]);

  const handleToggleSidebar = () => {
    setMobileMenuOpen(true);
  };

  const getTitle = () => {
    return toolTitles[location] || 'StoryForge';
  };

  const handleLogout = async () => {
    // Try to log out of both systems
    try {
      // Try Clerk logout if available
      if (authType === 'clerk' && isSignedIn) {
        await signOut();
      }
      
      // Always try legacy logout
      await apiRequest('POST', '/api/logout');
      
      setLegacyUser(null);
      setAuthType('none');
      
      // Redirect to login page
      navigate('/login');
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of StoryForge",
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: "There was an error logging you out",
        variant: "destructive",
      });
    }
  };

  // Get user display information
  const getUserDisplayInfo = () => {
    if (authType === 'clerk' && user) {
      return {
        name: user.fullName || user.username || "User",
        email: user.primaryEmailAddress?.emailAddress || "No email",
        imageUrl: user.imageUrl,
        initials: getClerkUserInitials(),
      };
    } else if (authType === 'legacy' && legacyUser) {
      return {
        name: legacyUser.displayName || legacyUser.username || "User",
        email: "",
        imageUrl: null,
        initials: getLegacyUserInitials(),
      };
    }
    
    return {
      name: "User",
      email: "",
      imageUrl: null,
      initials: "?",
    };
  };

  // Get Clerk user initials for avatar
  const getClerkUserInitials = () => {
    if (!isLoaded || !user) return "?";
    
    // Use full name if available, otherwise use primaryEmailAddress
    const fullName = user.fullName;
    const email = user.primaryEmailAddress?.emailAddress;
    
    if (fullName) {
      // Get first and last initials if available
      const nameParts = fullName.split(" ");
      if (nameParts.length > 1) {
        return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
      }
      
      // Otherwise just return the first 1-2 characters of the name
      return fullName.substring(0, Math.min(2, fullName.length)).toUpperCase();
    } else if (email) {
      // If no name is available, use the first character of the email
      return email[0].toUpperCase();
    }
    
    return "?";
  };

  // Get legacy user initials for avatar
  const getLegacyUserInitials = () => {
    if (!legacyUser) return "?";
    
    const name = legacyUser.displayName || legacyUser.username;
    
    if (name) {
      // Get first and last initials if available
      const nameParts = name.split(" ");
      if (nameParts.length > 1) {
        return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
      }
      
      // Otherwise just return the first 1-2 characters of the name
      return name.substring(0, Math.min(2, name.length)).toUpperCase();
    }
    
    return "?";
  };

  // Show a minimal header while loading
  if ((authType === 'clerk' && !isLoaded) || authType === 'none') {
    return <div className="h-16 bg-slate-800 border-b border-slate-700"></div>;
  }

  const userInfo = getUserDisplayInfo();

  return (
    <header className="bg-slate-800 border-b border-slate-700 py-4 px-6 flex items-center justify-between">
      <div className="flex items-center">
        <button 
          onClick={handleToggleSidebar}
          className="md:hidden mr-4 text-slate-400 hover:text-white"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-spectral font-bold">{getTitle()}</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-700 relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <button className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-700">
          <Cog className="h-5 w-5" />
        </button>
        
        <Button 
          onClick={toggleOracle}
          className="flex items-center px-4 py-2 bg-primary hover:bg-primary-dark rounded-md text-white transition-all shadow-[0_0_15px_rgba(93,63,211,0.3)] hover:shadow-[0_0_20px_rgba(93,63,211,0.6)]"
        >
          <Wand2 className="mr-2 h-4 w-4" />
          <span>Ask Oracle</span>
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-9 w-9 cursor-pointer border-2 border-slate-700 hover:border-indigo-500 transition-colors">
              {userInfo.imageUrl ? (
                <AvatarImage src={userInfo.imageUrl} alt={userInfo.name} />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
                  {userInfo.initials}
                </AvatarFallback>
              )}
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-medium">{userInfo.name}</span>
                {userInfo.email && (
                  <span className="text-xs text-muted-foreground">{userInfo.email}</span>
                )}
                <span className="text-xs text-muted-foreground mt-1">
                  {authType === 'clerk' ? 'Clerk Authentication' : 'Legacy Authentication'}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer" 
              onClick={() => navigate('/user-profile')}
            >
              <User className="mr-2 h-4 w-4" />
              <span>My Account</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Cog className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer text-red-500 focus:text-red-500" 
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
