import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Project, InsertProject } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { ProjectWithDetails } from "@/types";

export const useProjectService = () => {
  const { toast } = useToast();
  const [error, setError] = useState<Error | null>(null);

  // Fetch all projects
  const {
    data: projects = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  // Fetch single project
  const fetchProject = (id: number) => {
    return useQuery<ProjectWithDetails>({
      queryKey: ['/api/projects', id],
      enabled: id > 0,
    });
  };

  // Create project mutation
  const createMutation = useMutation({
    mutationFn: async (project: InsertProject) => {
      const response = await apiRequest('POST', '/api/projects', project);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      toast({
        title: "Project created",
        description: "Your new project has been created successfully",
      });
    },
    onError: (error: Error) => {
      setError(error);
      toast({
        title: "Error creating project",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update project mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, project }: { id: number; project: Partial<Project> }) => {
      const response = await apiRequest('PUT', `/api/projects/${id}`, project);
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      queryClient.invalidateQueries({ queryKey: ['/api/projects', variables.id] });
      toast({
        title: "Project updated",
        description: "Your project has been updated successfully",
      });
    },
    onError: (error: Error) => {
      setError(error);
      toast({
        title: "Error updating project",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete project mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/projects/${id}`, undefined);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      toast({
        title: "Project deleted",
        description: "Your project has been deleted successfully",
      });
    },
    onError: (error: Error) => {
      setError(error);
      toast({
        title: "Error deleting project",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Helper functions
  const createProject = async (project: InsertProject) => {
    return createMutation.mutateAsync(project);
  };

  const updateProject = async (id: number, project: Partial<Project>) => {
    return updateMutation.mutateAsync({ id, project });
  };

  const deleteProject = async (id: number) => {
    return deleteMutation.mutateAsync(id);
  };

  // No longer inserting mock data - we'll use real data from the database
  if (projects.length === 0 && !isLoading) {
    console.log("No projects found in database");
  }

  return {
    projects,
    isLoading,
    isError,
    error,
    fetchProject,
    createProject,
    updateProject,
    deleteProject,
    refetchProjects: refetch,
  };
};
