import { trpc } from '../utils/trpc';

export const usePlotService = () => {
  const utils = trpc.useContext();

  // Get all plots for a project
  const getAllPlots = (projectId: string) => {
    return trpc.plot.getAllByProject.useQuery({ projectId });
  };

  // Get a single plot by ID
  const getPlot = (plotId: string) => {
    return trpc.plot.getById.useQuery({ plotId });
  };

  // Create a new plot
  const createPlot = () => {
    return trpc.plot.create.useMutation({
      onSuccess: (data) => {
        // Invalidate the plots query to refetch the data
        utils.plot.getAllByProject.invalidate({ projectId: data.projectId });
      },
    });
  };

  // Update an existing plot
  const updatePlot = () => {
    return trpc.plot.update.useMutation({
      onSuccess: (data) => {
        // Invalidate specific queries to refetch data
        utils.plot.getAllByProject.invalidate({ projectId: data.projectId });
        utils.plot.getById.invalidate({ plotId: data.id });
      },
    });
  };

  // Delete a plot
  const deletePlot = () => {
    return trpc.plot.delete.useMutation({
      onSuccess: (data) => {
        // Invalidate the plots query to refetch the data
        utils.plot.getAllByProject.invalidate({ projectId: data.projectId });
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