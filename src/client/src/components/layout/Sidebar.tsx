import React, { useState, useEffect } from "react";
import { useUI } from "@/context/UIContext";
import { useProject } from "@/context/ProjectContext";
import { Link, useLocation } from "wouter";
import { NavItem } from "@/types";
import { Project } from "@shared/schema";
import type { ProjectWithDetails } from "@/context/ProjectContext";
import { 
  Home, User, Mountain, Gem, Map, 
  BookOpen, Wand2, Book, ChevronDown, LogOut,
  Sparkles, PlusCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ProjectForm } from "@/components/features/projects/ProjectForm";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

const navigationItems: NavItem[] = [
  { name: "Dashboard", path: "/dashboard", icon: "home", type: "wizard", color: "text-gray-400" },
  { name: "Story Wizard", path: "/story-wizard", icon: "sparkles", type: "wizard", color: "text-purple-400" },
  { name: "Character Workshop", path: "/character-workshop", icon: "user", type: "character", color: "text-blue-400" },
  { name: "Realm Crafter", path: "/realm-crafter", icon: "mountain", type: "realm", color: "text-green-400" },
  { name: "Artifact Vault", path: "/artifact-vault", icon: "gem", type: "artifact", color: "text-amber-400" },
  { name: "Plot Architect", path: "/plot-architect", icon: "map", type: "plot", color: "text-red-400" },
  { name: "Chapter Scribe", path: "/chapter-scribe", icon: "book-open", type: "chapter", color: "text-purple-400" },
  { name: "Story Oracle", path: "/story-oracle", icon: "wand2", type: "oracle", color: "text-blue-400" },
  { name: "Tome Binder", path: "/tome-binder", icon: "book", type: "tome", color: "text-green-400" }
];

const iconComponents: Record<string, React.ReactNode> = {
  "home": <Home className="w-5 h-5" />,
  "sparkles": <Sparkles className="w-5 h-5" />,
  "user": <User className="w-5 h-5" />,
  "mountain": <Mountain className="w-5 h-5" />,
  "gem": <Gem className="w-5 h-5" />,
  "map": <Map className="w-5 h-5" />,
  "book-open": <BookOpen className="w-5 h-5" />,
  "wand2": <Wand2 className="w-5 h-5" />,
  "book": <Book className="w-5 h-5" />
};

const Sidebar: React.FC = () => {
  const { sidebarExpanded, toggleSidebar, currentTool, isMobileMenuOpen, setMobileMenuOpen } = useUI();
  const { currentProject, projects, setCurrentProject, refetchProjects } = useProject();
  const [location] = useLocation();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isProjectMenuOpen, setIsProjectMenuOpen] = useState(false);
  const { toast } = useToast();
  
  // Close mobile menu when location changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location, setMobileMenuOpen]);
  
  const handleProjectChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    console.log("Project selection changed to:", value);
    
    // Handle the create new project option
    if (value === "create-new") {
      setIsCreateDialogOpen(true);
      return;
    }
    
    const projectId = parseInt(value);
    if (isNaN(projectId)) {
      console.log("Invalid project ID:", value);
      return;
    }
    
    try {
      // Find the project in the existing list
      const selectedProject = projects.find(p => p.id === projectId);
      if (!selectedProject) {
        console.log("Selected project not found in projects list");
        return;
      }
      
      console.log("Loading details for project:", selectedProject.name);
      
      // Create fetch functions with better debugging
      const fetchCharacters = async () => {
        console.log("Fetching characters for project ID:", projectId);
        const response = await fetch(`/api/projects/${projectId}/characters`);
        const data = await response.json();
        console.log(`Fetched ${data.length} characters for project`);
        return data;
      };
      
      const fetchSettings = async () => {
        console.log("Fetching settings for project ID:", projectId);
        const response = await fetch(`/api/projects/${projectId}/settings`);
        const data = await response.json();
        console.log(`Fetched ${data.length} settings for project`);
        return data;
      };
      
      const fetchObjects = async () => {
        console.log("Fetching objects for project ID:", projectId);
        const response = await fetch(`/api/projects/${projectId}/objects`);
        const data = await response.json();
        console.log(`Fetched ${data.length} objects for project`);
        return data;
      };
      
      const fetchPlots = async () => {
        console.log("Fetching plots for project ID:", projectId);
        const response = await fetch(`/api/projects/${projectId}/plots`);
        const data = await response.json();
        console.log(`Fetched ${data.length} plots for project`);
        return data;
      };
      
      const fetchChapters = async () => {
        console.log("Fetching chapters for project ID:", projectId);
        const response = await fetch(`/api/projects/${projectId}/chapters`);
        const data = await response.json();
        console.log(`Fetched ${data.length} chapters for project`);
        return data;
      };
      
      // Fetch all related data for the project
      const [characters, settings, objects, plots, chapters] = await Promise.all([
        fetchCharacters(),
        fetchSettings(),
        fetchObjects(),
        fetchPlots(),
        fetchChapters()
      ]);
      
      console.log("All project data fetched successfully");
      
      // Create the project with details object
      const projectWithDetails: ProjectWithDetails = {
        ...selectedProject,
        characters: Array.isArray(characters) ? characters : [],
        settings: Array.isArray(settings) ? settings : [],
        objects: Array.isArray(objects) ? objects : [],
        plots: Array.isArray(plots) ? plots : [],
        chapters: Array.isArray(chapters) ? chapters : [],
      };
      
      console.log("Setting current project to:", projectWithDetails);
      
      // Set current project with all details
      setCurrentProject(projectWithDetails);
      
      // Update query cache
      queryClient.setQueryData(['/api/projects', projectId, 'characters'], characters);
      queryClient.setQueryData(['/api/projects', projectId, 'settings'], settings);
      queryClient.setQueryData(['/api/projects', projectId, 'objects'], objects);
      queryClient.setQueryData(['/api/projects', projectId, 'plots'], plots);
      queryClient.setQueryData(['/api/projects', projectId, 'chapters'], chapters);
      
      toast({
        title: "Project Changed",
        description: `Now working on: ${selectedProject.name}`,
      });
    } catch (error) {
      console.error("Error loading project details:", error);
      toast({
        title: "Error",
        description: "Could not load project details",
        variant: "destructive",
      });
    }
  };
  
  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false);
    refetchProjects();
    toast({
      title: "Success",
      description: "Project created successfully!",
    });
  };

  const getToolClasses = (path: string) => {
    const isActive = location === path;
    return cn(
      "flex items-center px-4 py-2 rounded",
      isActive ? "bg-gray-700 text-white" : "text-gray-400 hover:text-white hover:bg-gray-700"
    );
  };

  const sidebar = (
    <aside className={cn(
      "flex flex-col bg-gray-800 border-r border-gray-700 transition-all duration-300 ease-in-out z-50",
      sidebarExpanded ? "w-64" : "w-16",
      isMobileMenuOpen ? "fixed inset-y-0 left-0 w-64" : "hidden md:flex",
      !isMobileMenuOpen && !sidebarExpanded ? "md:w-16" : ""
    )}>
      <div className="p-4 flex items-center border-b border-gray-700">
        <div className="w-8 h-8 flex items-center justify-center rounded bg-primary text-white mr-3 flex-shrink-0">
          <BookOpen className="w-4 h-4" />
        </div>
        {(sidebarExpanded || isMobileMenuOpen) && (
          <h1 className="text-xl font-spectral font-bold text-amber-500">StoryForge</h1>
        )}
        
        {isMobileMenuOpen && (
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="ml-auto text-gray-400 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      {/* Project Selector */}
      <div className="px-4 py-3 border-b border-gray-700">
        <div className="flex items-center justify-between">
          {(sidebarExpanded || isMobileMenuOpen) && (
            <h2 className="text-sm text-gray-400 uppercase">Current Project</h2>
          )}
          <button 
            className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-700"
            onClick={() => setIsProjectMenuOpen(!isProjectMenuOpen)}
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-2 flex items-center">
          <div className={cn(
            "rounded-full flex items-center justify-center flex-shrink-0",
            currentProject?.coverColor || "bg-primary",
            sidebarExpanded || isMobileMenuOpen ? "w-8 h-8" : "w-8 h-8"
          )}>
            <span className="font-spectral font-bold">
              {currentProject?.coverInitial || "P"}
            </span>
          </div>
          
          {(sidebarExpanded || isMobileMenuOpen) && (
            <select 
              className="bg-gray-700 border-gray-600 rounded text-white ml-2 w-full py-1 px-2 text-sm"
              value={currentProject?.id || ""}
              onChange={handleProjectChange}
              style={{ backgroundColor: "#374151" }}
            >
              {!currentProject && (
                <option value="">Select Project</option>
              )}
              {projects.map(project => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
              <option value="create-new">+ Create New Project</option>
            </select>
          )}
        </div>
        
        {/* Project Actions */}
        {isProjectMenuOpen && (sidebarExpanded || isMobileMenuOpen) && (
          <div className="mt-3 border-t border-gray-700 pt-3">
            <Button 
              className="w-full flex items-center justify-center text-sm h-8 bg-primary/20 hover:bg-primary/30 text-primary-foreground"
              onClick={() => {
                setIsCreateDialogOpen(true);
                setIsProjectMenuOpen(false);
              }}
            >
              <PlusCircle className="h-3.5 w-3.5 mr-2" />
              Create New Project
            </Button>
          </div>
        )}
      </div>

      {/* Tool Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul>
          {navigationItems.map((item) => (
            <li key={item.path} className="mb-1">
              <Link href={item.path}>
                <div className={getToolClasses(item.path)}>
                  <span className={cn("w-5 text-center", item.color)}>
                    {iconComponents[item.icon]}
                  </span>
                  {(sidebarExpanded || isMobileMenuOpen) && (
                    <span className="ml-3">{item.name}</span>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* User Menu */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
            <span className="font-spectral">J</span>
          </div>
          
          {(sidebarExpanded || isMobileMenuOpen) && (
            <>
              <div className="ml-3">
                <p className="text-sm font-medium">Jessica Writer</p>
                <p className="text-xs text-gray-500">Pro Account</p>
              </div>
              <button className="ml-auto text-gray-400 hover:text-white p-1 rounded hover:bg-gray-700">
                <LogOut className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {sidebar}
      
      {/* Create Project Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="bg-gray-800 text-white border-gray-700 max-w-lg">
          <div className="flex flex-col">
            <h2 id="project-dialog-title" className="text-xl font-spectral font-semibold mb-4">Create New Project</h2>
            <p id="project-dialog-description" className="sr-only">Create a new project to organize your story work</p>
            <ProjectForm 
              onSuccess={handleCreateSuccess}
              onCancel={() => setIsCreateDialogOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Sidebar;
