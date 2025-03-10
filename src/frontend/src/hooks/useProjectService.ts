import { trpc } from '../utils/trpc';

export const useProjectService = () => {
  const utils = trpc.useContext();

  // Get all projects for the current user with caching
  const getAllProjects = () => {
    return trpc.project.getAll.useQuery({}, {
      // Keep data fresh for 5 minutes (300000ms)
      staleTime: 5 * 60 * 1000,
      // Cache data for 10 minutes (600000ms)
      cacheTime: 10 * 60 * 1000,
      // Refetch on window focus to ensure data is up-to-date
      refetchOnWindowFocus: true,
    });
  };

  // Get a single project by ID with caching
  const getProject = (id: string) => {
    return trpc.project.getById.useQuery({ id }, {
      // Keep data fresh for 5 minutes
      staleTime: 5 * 60 * 1000,
      // Cache data for 10 minutes
      cacheTime: 10 * 60 * 1000,
      // Don't refetch on window focus for project details to avoid unnecessary loading
      refetchOnWindowFocus: false,
      // Enable this to prefetch project data
      enabled: !!id,
    });
  };

  // Prefetch a project by ID (can be called when hovering over a project in the list)
  const prefetchProject = async (id: string) => {
    await utils.project.getById.prefetch({ id });
  };

  // Create a new project
  const createProject = () => {
    return trpc.project.create.useMutation({
      onSuccess: () => {
        // Invalidate the projects query to refetch the data
        utils.project.getAll.invalidate();
      },
    });
  };

  // Update an existing project
  const updateProject = () => {
    return trpc.project.update.useMutation({
      onSuccess: (data) => {
        // Invalidate specific queries to refetch data
        utils.project.getAll.invalidate();
        utils.project.getById.invalidate({ id: data.id });
      },
    });
  };

  // Delete a project
  const deleteProject = () => {
    return trpc.project.delete.useMutation({
      onSuccess: () => {
        // Invalidate the projects query to refetch the data
        utils.project.getAll.invalidate();
      },
    });
  };

  return {
    getAllProjects,
    getProject,
    prefetchProject,
    createProject,
    updateProject,
    deleteProject,
  };
}; 