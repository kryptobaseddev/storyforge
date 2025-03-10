import { trpc } from '../utils/trpc';

export const usePlotService = () => {
  const utils = trpc.useContext();

  // Get all plots for a project with caching
  const getAllPlots = (projectId: string) => {
    return trpc.plot.getAll.useQuery({ projectId }, {
      // Keep data fresh for 5 minutes
      staleTime: 5 * 60 * 1000,
      // Cache data for 10 minutes
      cacheTime: 10 * 60 * 1000,
      // Enable this to only fetch when projectId is available
      enabled: !!projectId,
    });
  };

  // Get a single plot by ID with caching
  const getPlot = (projectId: string, plotId: string) => {
    return trpc.plot.getById.useQuery({ projectId, plotId }, {
      // Keep data fresh for 5 minutes
      staleTime: 5 * 60 * 1000,
      // Cache data for 10 minutes
      cacheTime: 10 * 60 * 1000,
      // Enable this to only fetch when both IDs are available
      enabled: !!projectId && !!plotId,
    });
  };

  // Create a new plot
  const createPlot = () => {
    return trpc.plot.create.useMutation({
      onSuccess: (data) => {
        // Invalidate the plots query to refetch the data
        utils.plot.getAll.invalidate({ projectId: data.projectId });
      },
    });
  };

  // Update an existing plot
  const updatePlot = () => {
    return trpc.plot.update.useMutation({
      onSuccess: (data) => {
        // Invalidate specific queries to refetch data
        utils.plot.getAll.invalidate({ projectId: data.projectId });
        utils.plot.getById.invalidate({ projectId: data.projectId, plotId: data.id });
      },
    });
  };

  // Delete a plot
  const deletePlot = () => {
    return trpc.plot.delete.useMutation({
      onSuccess: (_, variables) => {
        // Invalidate the plots query to refetch the data
        utils.plot.getAll.invalidate({ projectId: variables.projectId });
      },
    });
  };

  return {
    getAllPlots,
    getPlot,
    createPlot,
    updatePlot,
    deletePlot,
  };
}; 