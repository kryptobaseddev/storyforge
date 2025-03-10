import React, { useState, useEffect } from "react";
import { useProject } from "@/context/ProjectContext";
import { useUI } from "@/context/UIContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, BookOpen, User, Mountain, Gem, Map, Wand2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { HoverGlow } from "@/components/ui/hover-glow";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ProjectWithDetails } from "@/context/ProjectContext";
import { ProjectForm } from "@/components/features/projects/ProjectForm";
import { ProjectDebugPanel } from "@/components/debug/ProjectDebugPanel";
import { queryClient } from "@/lib/queryClient";

const Dashboard: React.FC = () => {
  const { currentProject, projects, isLoading, isError, refetchProjects, setCurrentProject } = useProject();
  const { setCurrentTool } = useUI();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [debugMode, setDebugMode] = useState(true); // Set to true to show debug information
  const [userChecked, setUserChecked] = useState(false);

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is authenticated
        const userResponse = await fetch('/api/user', {
          credentials: 'include'
        });
        
        if (userResponse.status === 200 || userResponse.status === 304) {
          console.log("User is authenticated, fetching projects");
          // Explicitly fetch projects when user is authenticated
          refetchProjects();
        } else {
          console.log("User is not authenticated, cannot fetch projects");
          toast({
            title: "Authentication Required",
            description: "Please log in to access your projects",
            variant: "destructive"
          });
        }
        setUserChecked(true);
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    };
    
    checkAuth();
  }, [refetchProjects, toast]);

  // Initial load and refresh handling
  useEffect(() => {
    console.log("Dashboard: Current projects", projects);
    console.log("Dashboard: Current project", currentProject);
    
    // Only proceed if we've already checked authentication
    if (!userChecked) return;
    
    // Force a refetch if we don't have a currentProject but do have projects
    if (!currentProject && projects.length > 0) {
      console.log("Dashboard: No current project but projects exist, forcing refresh");
      // Set a timeout to prevent multiple immediate refreshes
      const timer = setTimeout(() => {
        refetchProjects();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [projects, currentProject, refetchProjects, userChecked]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    try {
      // First check if the user is authenticated by requesting the user endpoint
      const userResponse = await fetch('/api/user', {
        credentials: 'include' // Explicitly include credentials
      });
      
      if (userResponse.status !== 200 && userResponse.status !== 304) {
        console.error("User is not authenticated during refresh");
        toast({
          title: "Authentication Error",
          description: "Please log in again to access your projects",
          variant: "destructive"
        });
        setIsRefreshing(false);
        return;
      }
      
      console.log("User is authenticated, refreshing projects");
      
      // Fetch projects with explicit credentials
      const projectsResponse = await fetch('/api/projects', {
        credentials: 'include'  // Explicitly include credentials
      });
      
      if (!projectsResponse.ok) {
        throw new Error(`Error fetching projects: ${projectsResponse.statusText}`);
      }
      
      const fetchedProjects = await projectsResponse.json();
      console.log(`Fetched ${fetchedProjects.length} projects`);
      
      // Check if we actually received an array
      if (!Array.isArray(fetchedProjects)) {
        console.error("Unexpected response format:", fetchedProjects);
        throw new Error("Invalid response format from server");
      }
      
      // Update the query cache directly
      queryClient.setQueryData(['/api/projects'], fetchedProjects);
      
      // Manually update the projects state by calling refetchProjects
      await refetchProjects();
      
      // Force initialize project if needed
      if (!currentProject && fetchedProjects.length > 0) {
        // Select the first project manually
        console.log("Manually selecting first project after refresh");
        
        try {
          const projectId = fetchedProjects[0].id;
          console.log(`Manually loading project ID: ${projectId}`);
          
          // Fetch project details with credentials
          const fetchOptions = { credentials: 'include' as RequestCredentials };
          
          const charactersResponse = await fetch(`/api/projects/${projectId}/characters`, fetchOptions);
          const settingsResponse = await fetch(`/api/projects/${projectId}/settings`, fetchOptions);
          const objectsResponse = await fetch(`/api/projects/${projectId}/objects`, fetchOptions);
          const plotsResponse = await fetch(`/api/projects/${projectId}/plots`, fetchOptions);
          const chaptersResponse = await fetch(`/api/projects/${projectId}/chapters`, fetchOptions);
          
          const characters = await charactersResponse.json();
          const settings = await settingsResponse.json();
          const objects = await objectsResponse.json();
          const plots = await plotsResponse.json();
          const chapters = await chaptersResponse.json();
          
          console.log("Manual project data fetched successfully");
          
          // Set current project directly
          const projectWithDetails: ProjectWithDetails = {
            ...fetchedProjects[0],
            characters: Array.isArray(characters) ? characters : [],
            settings: Array.isArray(settings) ? settings : [],
            objects: Array.isArray(objects) ? objects : [],
            plots: Array.isArray(plots) ? plots : [],
            chapters: Array.isArray(chapters) ? chapters : [],
          };
          
          setCurrentProject(projectWithDetails);
          console.log("Manually set current project");
        } catch (error) {
          console.error("Error in manual project selection:", error);
          
          // Set minimal project to unblock the UI
          if (fetchedProjects.length > 0) {
            setCurrentProject({
              ...fetchedProjects[0],
              characters: [],
              settings: [],
              objects: [],
              plots: [],
              chapters: [],
            });
          }
        }
      }
      
      toast({
        title: "Projects Refreshed",
        description: "Latest project data has been loaded",
      });
    } catch (error) {
      console.error("Error during refresh:", error);
      toast({
        title: "Refresh Failed",
        description: "Could not refresh project data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCreateProject = () => {
    setIsCreateDialogOpen(true);
  };

  // Function to handle project selection (needed for the debug panel)
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
      
      // Create fetch functions with better debugging and explicit credentials
      const fetchOptions = { credentials: 'include' as RequestCredentials };
      
      const fetchCharacters = async () => {
        console.log("Fetching characters for project ID:", projectId);
        const response = await fetch(`/api/projects/${projectId}/characters`, fetchOptions);
        if (!response.ok) {
          console.error(`Error fetching characters: ${response.status} ${response.statusText}`);
          return [];
        }
        const data = await response.json();
        console.log(`Fetched ${data.length} characters for project`);
        return data;
      };
      
      const fetchSettings = async () => {
        console.log("Fetching settings for project ID:", projectId);
        const response = await fetch(`/api/projects/${projectId}/settings`, fetchOptions);
        if (!response.ok) {
          console.error(`Error fetching settings: ${response.status} ${response.statusText}`);
          return [];
        }
        const data = await response.json();
        console.log(`Fetched ${data.length} settings for project`);
        return data;
      };
      
      const fetchObjects = async () => {
        console.log("Fetching objects for project ID:", projectId);
        const response = await fetch(`/api/projects/${projectId}/objects`, fetchOptions);
        if (!response.ok) {
          console.error(`Error fetching objects: ${response.status} ${response.statusText}`);
          return [];
        }
        const data = await response.json();
        console.log(`Fetched ${data.length} objects for project`);
        return data;
      };
      
      const fetchPlots = async () => {
        console.log("Fetching plots for project ID:", projectId);
        const response = await fetch(`/api/projects/${projectId}/plots`, fetchOptions);
        if (!response.ok) {
          console.error(`Error fetching plots: ${response.status} ${response.statusText}`);
          return [];
        }
        const data = await response.json();
        console.log(`Fetched ${data.length} plots for project`);
        return data;
      };
      
      const fetchChapters = async () => {
        console.log("Fetching chapters for project ID:", projectId);
        const response = await fetch(`/api/projects/${projectId}/chapters`, fetchOptions);
        if (!response.ok) {
          console.error(`Error fetching chapters: ${response.status} ${response.statusText}`);
          return [];
        }
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

  if (isLoading) {
    return (
      <div className="flex-1 p-6 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-gray-400">Loading your creative workshop...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Debug Panel */}
        {debugMode && (
          <div className="mb-6">
            <ProjectDebugPanel
              projects={projects}
              currentProject={currentProject}
              onClose={() => setDebugMode(false)}
              onRefreshProjects={handleRefresh}
              onForceSelectProject={(projectId) => {
                // Force select a project by ID
                const event = {
                  target: { value: projectId.toString() }
                } as React.ChangeEvent<HTMLSelectElement>;
                handleProjectChange(event);
              }}
              isRefreshing={isRefreshing}
            />
          </div>
        )}
        
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-spectral font-bold text-white mb-2">Welcome back, Writer</h1>
            <p className="text-gray-400">Continue crafting your epic tale with these mystical tools</p>
          </div>
          <div className="flex gap-2">
            {!debugMode && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setDebugMode(true)}
                className="text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white"
              >
                Debug
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh} 
              disabled={isRefreshing}
              className="text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white"
            >
              {isRefreshing ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
          </div>
        </div>

        {!currentProject ? (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
            <h2 className="text-xl font-spectral font-semibold text-white mb-4">No Projects Yet</h2>
            <p className="text-gray-400 mb-6">Begin your literary journey by creating your first project.</p>
            <Button onClick={handleCreateProject} className="bg-primary hover:bg-primary-dark text-white">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Project
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-10">
              <h2 className="text-xl font-spectral font-semibold text-white mb-4 flex items-center">
                <BookOpen className="mr-2 h-5 w-5 text-amber-500" />
                Current Project
              </h2>
              <HoverGlow>
                <Card className="bg-gray-800 border-gray-700 text-white">
                  <CardHeader>
                    <div className="flex items-center">
                      <div className={`w-12 h-12 rounded-full ${currentProject.coverColor || "bg-primary"} flex items-center justify-center mr-4`}>
                        <span className="font-spectral font-bold text-xl">{currentProject.coverInitial || "P"}</span>
                      </div>
                      <div>
                        <CardTitle className="font-spectral text-2xl">{currentProject.name}</CardTitle>
                        <CardDescription className="text-gray-400">
                          Last edited: Today
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">{currentProject.description || "No description provided."}</p>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                      <div className="bg-gray-700 p-3 rounded-md flex flex-col items-center justify-center text-center">
                        <span className="text-2xl font-semibold text-blue-400">{currentProject.characters?.length || 0}</span>
                        <span className="text-xs text-gray-400">Characters</span>
                      </div>
                      <div className="bg-gray-700 p-3 rounded-md flex flex-col items-center justify-center text-center">
                        <span className="text-2xl font-semibold text-green-400">{currentProject.settings?.length || 0}</span>
                        <span className="text-xs text-gray-400">Settings</span>
                      </div>
                      <div className="bg-gray-700 p-3 rounded-md flex flex-col items-center justify-center text-center">
                        <span className="text-2xl font-semibold text-red-400">{currentProject.plots?.length || 0}</span>
                        <span className="text-xs text-gray-400">Plots</span>
                      </div>
                      <div className="bg-gray-700 p-3 rounded-md flex flex-col items-center justify-center text-center">
                        <span className="text-2xl font-semibold text-purple-400">{currentProject.chapters?.length || 0}</span>
                        <span className="text-xs text-gray-400">Chapters</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white mr-2">
                      Project Settings
                    </Button>
                    <Button className="bg-primary hover:bg-primary-dark text-white">
                      Continue Writing
                    </Button>
                  </CardFooter>
                </Card>
              </HoverGlow>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-spectral font-semibold text-white mb-4">Your Mystical Forges</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link href="/character-workshop">
                  <a className="block">
                    <HoverGlow color="primary">
                      <Card className="bg-gray-800 border-gray-700 hover:border-blue-600 cursor-pointer transition-all">
                        <CardHeader className="flex flex-row items-center space-y-0 gap-4">
                          <div className="w-12 h-12 rounded-full bg-blue-900 flex items-center justify-center">
                            <User className="h-6 w-6 text-blue-400" />
                          </div>
                          <div>
                            <CardTitle className="text-white font-spectral">Character Workshop</CardTitle>
                            <CardDescription className="text-gray-400">
                              Forge compelling heroes and villains
                            </CardDescription>
                          </div>
                        </CardHeader>
                        <CardFooter>
                          <div className="text-sm text-gray-400">
                            {currentProject.characters?.length || 0} characters created
                          </div>
                        </CardFooter>
                      </Card>
                    </HoverGlow>
                  </a>
                </Link>

                <Link href="/realm-crafter">
                  <a className="block">
                    <HoverGlow color="primary">
                      <Card className="bg-gray-800 border-gray-700 hover:border-green-600 cursor-pointer transition-all">
                        <CardHeader className="flex flex-row items-center space-y-0 gap-4">
                          <div className="w-12 h-12 rounded-full bg-green-900 flex items-center justify-center">
                            <Mountain className="h-6 w-6 text-green-400" />
                          </div>
                          <div>
                            <CardTitle className="text-white font-spectral">Realm Crafter</CardTitle>
                            <CardDescription className="text-gray-400">
                              Build immersive worlds and settings
                            </CardDescription>
                          </div>
                        </CardHeader>
                        <CardFooter>
                          <div className="text-sm text-gray-400">
                            {currentProject.settings?.length || 0} settings created
                          </div>
                        </CardFooter>
                      </Card>
                    </HoverGlow>
                  </a>
                </Link>

                <Link href="/artifact-vault">
                  <a className="block">
                    <HoverGlow color="primary">
                      <Card className="bg-gray-800 border-gray-700 hover:border-amber-600 cursor-pointer transition-all">
                        <CardHeader className="flex flex-row items-center space-y-0 gap-4">
                          <div className="w-12 h-12 rounded-full bg-amber-900 flex items-center justify-center">
                            <Gem className="h-6 w-6 text-amber-400" />
                          </div>
                          <div>
                            <CardTitle className="text-white font-spectral">Artifact Vault</CardTitle>
                            <CardDescription className="text-gray-400">
                              Craft magical items and treasures
                            </CardDescription>
                          </div>
                        </CardHeader>
                        <CardFooter>
                          <div className="text-sm text-gray-400">
                            {currentProject.objects?.length || 0} artifacts created
                          </div>
                        </CardFooter>
                      </Card>
                    </HoverGlow>
                  </a>
                </Link>

                <Link href="/plot-architect">
                  <a className="block">
                    <HoverGlow color="primary">
                      <Card className="bg-gray-800 border-gray-700 hover:border-red-600 cursor-pointer transition-all">
                        <CardHeader className="flex flex-row items-center space-y-0 gap-4">
                          <div className="w-12 h-12 rounded-full bg-red-900 flex items-center justify-center">
                            <Map className="h-6 w-6 text-red-400" />
                          </div>
                          <div>
                            <CardTitle className="text-white font-spectral">Plot Architect</CardTitle>
                            <CardDescription className="text-gray-400">
                              Design gripping plots and story arcs
                            </CardDescription>
                          </div>
                        </CardHeader>
                        <CardFooter>
                          <div className="text-sm text-gray-400">
                            {currentProject.plots?.length || 0} plots designed
                          </div>
                        </CardFooter>
                      </Card>
                    </HoverGlow>
                  </a>
                </Link>

                <Link href="/story-oracle">
                  <a className="block">
                    <HoverGlow color="ember">
                      <Card className="bg-gray-800 border-gray-700 hover:border-primary cursor-pointer transition-all">
                        <CardHeader className="flex flex-row items-center space-y-0 gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary-dark flex items-center justify-center">
                            <Wand2 className="h-6 w-6 text-primary-light" />
                          </div>
                          <div>
                            <CardTitle className="text-white font-spectral">Story Oracle</CardTitle>
                            <CardDescription className="text-gray-400">
                              Get AI assistance for your story
                            </CardDescription>
                          </div>
                        </CardHeader>
                        <CardFooter>
                          <div className="text-sm text-gray-400">
                            Mystical guidance for your creative journey
                          </div>
                        </CardFooter>
                      </Card>
                    </HoverGlow>
                  </a>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Create Project Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="bg-gray-800 text-white border-gray-700 max-w-lg">
          <div className="flex flex-col">
            <h2 id="dashboard-dialog-title" className="text-xl font-spectral font-semibold mb-4">Create New Project</h2>
            <p id="dashboard-dialog-description" className="sr-only">Create a new project to organize your story work</p>
            <ProjectForm 
              onSuccess={handleCreateSuccess}
              onCancel={() => setIsCreateDialogOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
