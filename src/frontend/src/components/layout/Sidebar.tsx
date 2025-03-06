import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarProvider,
  SidebarSeparator,
} from '../ui/sidebar';

// Import Lucide icons
import { 
  Grid, 
  Folder, 
  Users, 
  Map, 
  GitBranch, 
  BookOpen, 
  Download,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';
import { useUI } from '../../context/UIContext';

/**
 * Sidebar Component
 * 
 * Primary navigation sidebar for the application
 */
interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  const { logout } = useAuth();
  const toast = useToast();
  const { setSidebarOpen } = useUI();
  
  // Define main navigation items with Lucide icons
  const mainNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Grid },
    { path: '/projects', label: 'Projects', icon: Folder },
  ];
  
  // Define project tools when in a project context
  const projectTools = [
    { path: '/project/characters', label: 'Characters', icon: Users },
    { path: '/project/settings', label: 'Settings', icon: Map },
    { path: '/project/plots', label: 'Plots', icon: GitBranch },
    { path: '/project/chapters', label: 'Chapters', icon: BookOpen },
    { path: '/project/exports', label: 'Exports', icon: Download },
  ];

  // Determine if we're in a project context (for future use)
  const isProjectContext = location.pathname.includes('/project/');
  
  const handleLogout = () => {
    logout();
    toast.success('You have been logged out');
  };
  
  // Close sidebar on mobile when navigating to a new page
  const handleNavigation = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <SidebarProvider defaultOpen={isOpen} open={isOpen}>
      <ShadcnSidebar 
        className="pt-16 border-r border-solid h-screen overflow-hidden fixed top-0 left-0 bottom-0 z-30"
        style={{ 
          width: isOpen ? '16rem' : '3rem',
          backgroundColor: 'hsl(var(--background))', 
          borderColor: 'hsl(var(--border))'
        }}
      >
        <SidebarContent className="h-[calc(100vh-4rem)] overflow-y-auto pb-20">
          <SidebarGroup>
            <SidebarMenu>
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
                
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      asChild={true}
                      isActive={isActive}
                    >
                      <Link 
                        to={item.path} 
                        className="w-full flex items-center text-foreground"
                        onClick={handleNavigation}
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        {item.label}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>

          {isProjectContext && (
            <SidebarGroup>
              <SidebarGroupLabel className="text-foreground">Project Tools</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {projectTools.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    
                    return (
                      <SidebarMenuItem key={item.path}>
                        <SidebarMenuButton
                          asChild={true}
                          isActive={isActive}
                        >
                          <Link 
                            to={item.path} 
                            className="w-full flex items-center text-foreground"
                            onClick={handleNavigation}
                          >
                            <Icon className="mr-2 h-4 w-4" />
                            {item.label}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
          
          <SidebarSeparator className="my-4" />
          
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild={true}
                  onClick={handleLogout}
                >
                  <button className="w-full flex items-center text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </ShadcnSidebar>
    </SidebarProvider>
  );
};

export default Sidebar; 