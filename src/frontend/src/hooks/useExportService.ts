import { trpc } from '../utils/trpc';

export const useExportService = () => {
  const utils = trpc.useContext();

  // Get all exports for a project
  const getAllExports = (projectId: string) => {
    return trpc.export.getAllByProject.useQuery({ projectId });
  };

  // Get a single export by ID
  const getExport = (exportId: string) => {
    return trpc.export.getExportById.useQuery({ exportId });
  };

  // Create a new export
  const createExport = () => {
    return trpc.export.createExport.useMutation({
      onSuccess: (data) => {
        // Invalidate the exports query to refetch the data
        utils.export.getAllByProject.invalidate({ projectId: data.projectId });
      },
    });
  };

  // Delete an export
  const deleteExport = () => {
    return trpc.export.deleteExport.useMutation({
      onSuccess: (data) => {
        // Invalidate the exports query to refetch the data
        utils.export.getAllByProject.invalidate({ projectId: data.projectId });
      },
    });
  };

  // Download an export file
  const downloadExport = (exportId: string) => {
    return trpc.export.downloadExport.useQuery({ exportId });
  };

  return {
    getAllExports,
    getExport,
    createExport,
    deleteExport,
    downloadExport,
  };
}; 