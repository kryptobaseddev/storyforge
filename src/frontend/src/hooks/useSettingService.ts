import { trpc } from '../utils/trpc';

export const useSettingService = () => {
  const utils = trpc.useContext();

  // Get all settings for a project
  const getAllSettings = (projectId: string) => {
    return trpc.setting.getAll.useQuery({ projectId });
  };

  // Get a single setting by ID
  const getSetting = (projectId: string, settingId: string) => {
    return trpc.setting.getById.useQuery({ projectId, settingId });
  };

  // Create a new setting
  const createSetting = () => {
    return trpc.setting.create.useMutation({
      onSuccess: (data) => {
        // Invalidate the settings query to refetch the data
        utils.setting.getAll.invalidate({ projectId: data.projectId });
      },
    });
  };

  // Update an existing setting
  const updateSetting = () => {
    return trpc.setting.update.useMutation({
      onSuccess: (data) => {
        // Invalidate specific queries to refetch data
        utils.setting.getAll.invalidate({ projectId: data.projectId });
        utils.setting.getById.invalidate({ projectId: data.projectId, settingId: data.id });
      },
    });
  };

  // Delete a setting
  const deleteSetting = () => {
    return trpc.setting.delete.useMutation({
      onSuccess: (_, variables) => {
        // Invalidate the settings query to refetch the data
        utils.setting.getAll.invalidate({ projectId: variables.projectId });
      },
    });
  };

  return {
    getAllSettings,
    getSetting,
    createSetting,
    updateSetting,
    deleteSetting,
  };
}; 