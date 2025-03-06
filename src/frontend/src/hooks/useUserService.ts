import { trpc } from '../utils/trpc';

export const useUserService = () => {
  // Get the current user's profile
  const getProfile = () => {
    return trpc.user.getProfile.useQuery();
  };

  // Update the user's profile
  const updateProfile = () => {
    return trpc.user.updateProfile.useMutation({
      onSuccess: () => {
        // Invalidate the profile query to refetch data
        trpc.user.getProfile.invalidate();
      },
    });
  };

  // Change the user's password
  const changePassword = () => {
    return trpc.user.changePassword.useMutation();
  };

  // Update user preferences
  const updatePreferences = () => {
    return trpc.user.updatePreferences.useMutation({
      onSuccess: () => {
        // Invalidate the profile query to refetch data
        trpc.user.getProfile.invalidate();
      },
    });
  };

  return {
    getProfile,
    updateProfile,
    changePassword,
    updatePreferences,
  };
}; 