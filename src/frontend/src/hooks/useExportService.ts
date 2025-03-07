import { trpc } from '../utils/trpc';

export const useExportService = () => {
  const utils = trpc.useContext();

  // Get all exports for a project
  const getAllExports = (projectId: string) => {
    return trpc.export.getExports.useQuery({ projectId });
  };

  // Get a single export by ID
  const getExport = (projectId: string, id: string) => {
    return trpc.export.getExportById.useQuery({ projectId, id });
  };

  // Create a new export
  const createExport = () => {
    return trpc.export.createExport.useMutation({
      onSuccess: (data) => {
        // Invalidate the exports query to refetch the data
        utils.export.getExports.invalidate({ projectId: data.projectId });
      },
    });
  };

  // Delete an export
  const deleteExport = () => {
    return trpc.export.deleteExport.useMutation({
      onSuccess: (_, variables) => {
        // Invalidate the exports query to refetch the data
        utils.export.getExports.invalidate({ projectId: variables.projectId });
      },
    });
  };

  // Download an export file
  const downloadExport = () => {
    return trpc.export.downloadExport.useMutation();
  };

  return {
    getAllExports,
    getExport,
    createExport,
    deleteExport,
    downloadExport,
  };
}; 