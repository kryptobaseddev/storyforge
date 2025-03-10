import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryClient, apiRequest, getQueryFn } from "@/lib/queryClient";
import { Project, Character, Setting, Plot, Chapter } from "@shared/schema";
import { Object as StoryObject } from "@shared/schema";
import { useAuth } from "@/context/AuthContext";

// Define the ProjectWithDetails type that combines project with its related entities
export interface ProjectWithDetails extends Project {
  characters?: Character[];
  settings?: Setting[];
  objects?: StoryObject[];
  plots?: Plot[];
  chapters?: Chapter[];
}

// Define the context
type ProjectContextType = {
  currentProject: ProjectWithDetails | null;
  setCurrentProject: (project: ProjectWithDetails | null) => void;
  projects: Project[];
  isLoading: boolean;
  isError: boolean;
  refetchProjects: () => void;
};

// Create default values to make the context more resilient
const defaultProjectContext: ProjectContextType = {
  currentProject: null,
  setCurrentProject: () => {}, // Empty function as default
  projects: [],
  isLoading: false,
  isError: false,
  refetchProjects: () => {}, // Empty function as default
};

// Use default values to create the context
const ProjectContext = createContext<ProjectContextType>(defaultProjectContext);

// Provider component
export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [currentProject, setCurrentProject] = useState<ProjectWithDetails | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0); // Add a force update mechanism
  const { user } = useAuth(); // Get authentication state

  // Fetch projects data with proper error handling
  const { 
    data: projects = [], 
    isLoading, 
    isError,
    refetch: refetchProjects 
  } = useQuery({
    queryKey: ["/api/projects"],
    queryFn: getQueryFn({ on401: "returnNull" }), // Use the query function that handles auth errors gracefully
    staleTime: 60000, // 1 minute
    enabled: !!user, // Only run this query when user is authenticated
  });

  // Ensure context is properly initialized
  useEffect(() => {
    if (!isInitialized) {
      console.log("Project Context fully initialized");
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Reset current project when user logs out
  useEffect(() => {
    if (!user) {
      setCurrentProject(null);
    }
  }, [user]);

  // Initialize with first project if available and none is selected
  useEffect(() => {
    const initializeProject = async () => {
      try {
        // Don't initialize if user is not logged in
        if (!user) {
          console.log("User not logged in, not initializing project");
          return;
        }
        
        // Don't initialize if we already have a project or if data is still loading
        if (currentProject !== null) {
          console.log("Already have a current project, not initializing:", currentProject);
          return;
        }
        
        if (isLoading) {
          console.log("Data is still loading, not initializing yet");
          return;
        }
        
        // Check if we have projects to work with
        if (!Array.isArray(projects) || projects.length === 0) {
          console.log("No projects available to initialize with");
          // Force a refetch to ensure we have the latest data
          await queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
          return;
        }
        
        console.log("Initializing with first project:", projects[0]);
        
        // Fetch all related data for the project
        const projectId = projects[0].id;
        
        if (!projectId) {
          console.error("Project ID is undefined or invalid:", projects[0]);
          return;
        }
        
        console.log(`Fetching details for project ID: ${projectId}`);
        
        // Create fetch functions for each data type
        const fetchCharacters = async () => {
          console.log(`Fetching characters for project ID: ${projectId}`);
          const res = await apiRequest('GET', `/api/projects/${projectId}/characters`);
          if (!res.ok) {
            console.error(`Failed to fetch characters: ${res.statusText}`);
            return [];
          }
          const data = await res.json();
          console.log(`Received ${data.length} characters for project ID: ${projectId}`);
          return data;
        };
        
        const fetchSettings = async () => {
          console.log(`Fetching settings for project ID: ${projectId}`);
          const res = await apiRequest('GET', `/api/projects/${projectId}/settings`);
          const data = await res.json();
          console.log(`Received ${data.length} settings for project ID: ${projectId}`);
          return data;
        };
        
        const fetchObjects = async () => {
          console.log(`Fetching objects for project ID: ${projectId}`);
          const res = await apiRequest('GET', `/api/projects/${projectId}/objects`);
          const data = await res.json();
          console.log(`Received ${data.length} objects for project ID: ${projectId}`);
          return data;
        };
        
        const fetchPlots = async () => {
          console.log(`Fetching plots for project ID: ${projectId}`);
          const res = await apiRequest('GET', `/api/projects/${projectId}/plots`);
          const data = await res.json();
          console.log(`Received ${data.length} plots for project ID: ${projectId}`);
          return data;
        };
        
        const fetchChapters = async () => {
          console.log(`Fetching chapters for project ID: ${projectId}`);
          const res = await apiRequest('GET', `/api/projects/${projectId}/chapters`);
          const data = await res.json();
          console.log(`Received ${data.length} chapters for project ID: ${projectId}`);
          return data;
        };
        
        // Use Promise.all to fetch all data concurrently
        const [characters, settings, objects, plots, chapters] = await Promise.all([
          queryClient.fetchQuery({
            queryKey: ['/api/projects', projectId, 'characters'],
            queryFn: fetchCharacters,
          }),
          queryClient.fetchQuery({
            queryKey: ['/api/projects', projectId, 'settings'],
            queryFn: fetchSettings,
          }),
          queryClient.fetchQuery({
            queryKey: ['/api/projects', projectId, 'objects'],
            queryFn: fetchObjects,
          }),
          queryClient.fetchQuery({
            queryKey: ['/api/projects', projectId, 'plots'],
            queryFn: fetchPlots,
          }),
          queryClient.fetchQuery({
            queryKey: ['/api/projects', projectId, 'chapters'],
            queryFn: fetchChapters,
          }),
        ]);
        
        // Create a new project with all details
        const projectWithDetails: ProjectWithDetails = {
          ...projects[0],
          characters: Array.isArray(characters) ? characters : [],
          settings: Array.isArray(settings) ? settings : [],
          objects: Array.isArray(objects) ? objects : [],
          plots: Array.isArray(plots) ? plots : [],
          chapters: Array.isArray(chapters) ? chapters : [],
        };
        
        console.log("Setting current project with details:", projectWithDetails);
        
        // Set the current project
        setCurrentProject(projectWithDetails);
        console.log("Project details loaded successfully");
      } catch (error) {
        console.error("Failed to load project details:", error);
        // Fallback to just the project without details
        if (Array.isArray(projects) && projects.length > 0) {
          setCurrentProject({
            ...projects[0],
            characters: [],
            settings: [],
            objects: [],
            plots: [],
            chapters: [],
          });
        }
      }
    };
    
    // Use a short timeout to ensure we don't have race conditions with other initializations
    const timer = setTimeout(() => {
      initializeProject();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [projects, currentProject, isLoading, queryClient, user]);

  // Create the actual context value
  const contextValue: ProjectContextType = {
    currentProject,
    setCurrentProject,
    projects: Array.isArray(projects) ? projects : [],
    isLoading,
    isError,
    refetchProjects,
  };

  return (
    <ProjectContext.Provider value={contextValue}>
      {children}
    </ProjectContext.Provider>
  );
};

// Custom hook to use the context
export const useProject = () => {
  try {
    const context = useContext(ProjectContext);
    return context;
  } catch (error) {
    console.error("Error using Project context:", error);
    // Return default context in case of error
    return defaultProjectContext;
  }
};
