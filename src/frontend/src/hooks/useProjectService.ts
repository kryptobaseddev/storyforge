import { trpc } from '../utils/trpc';

export const useProjectService = () => {
  const utils = trpc.useContext();

  // Get all projects for the current user
  const getAllProjects = () => {
    return trpc.project.getAll.useQuery({});
  };

  // Get a single project by ID
  const getProject = (id: string) => {
    return trpc.project.getById.useQuery({ id });
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
    createProject,
    updateProject,
    deleteProject,
  };
}; 