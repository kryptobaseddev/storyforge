import { trpc } from '../utils/trpc';

export const useUserService = () => {
  const utils = trpc.useContext();

  // Get the current user's profile
  const getProfile = () => {
    return trpc.user.getProfile.useQuery({});
  };

  // Update the user's profile
  const updateProfile = () => {
    return trpc.user.updateProfile.useMutation({
      onSuccess: () => {
        // Invalidate the profile query to refetch data
        utils.user.getProfile.invalidate();
      },
    });
  };

  // Change the user's password
  const changePassword = () => {
    return trpc.user.changePassword.useMutation();
  };

  // Get user preferences
  const getPreferences = () => {
    return trpc.user.getPreferences.useQuery({});
  };

  // Update the user's preferences
  const updatePreferences = () => {
    return trpc.user.updatePreferences.useMutation({
      onSuccess: () => {
        // Invalidate the profile and preferences queries to refetch data
        utils.user.getProfile.invalidate();
        utils.user.getPreferences.invalidate();
      },
    });
  };

  return {
    getProfile,
    updateProfile,
    changePassword,
    getPreferences,
    updatePreferences,
  };
}; 