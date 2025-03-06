import { trpc } from '../utils/trpc';

/**
 * Hook for authentication-related API calls
 * 
 * This hook provides a unified interface for all authentication operations
 * and handles token storage.
 */
export const useAuthService = () => {
  // Get tRPC client for direct mutation calls
  const client = trpc.useContext();

  /**
   * User registration
   */
  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: (data) => {
      // Store the token
      if (data && data.token) {
        localStorage.setItem('authToken', data.token);
      }
    },
  });

  /**
   * User login
   */
  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      // Store the token
      if (data && data.token) {
        localStorage.setItem('authToken', data.token);
      }
    },
  });

  /**
   * User logout
   */
  const logout = () => {
    // Remove the token
    localStorage.removeItem('authToken');
    
    // In a real implementation, we would call the server to invalidate the token
    // but since JWT is stateless, we can just remove it from localStorage
    
    // Use window.location.href to ensure a full page reload
    window.location.href = '/login';
  };

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = () => {
    return !!localStorage.getItem('authToken');
  };

  /**
   * Get current user profile
   */
  const profileQuery = trpc.auth.me.useQuery(undefined, {
    // Only fetch if user is authenticated
    enabled: isAuthenticated(),
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // Define other mutations
  const forgotPasswordMutation = trpc.auth.forgotPassword.useMutation();
  const resetPasswordMutation = trpc.auth.resetPassword.useMutation();
  const changePasswordMutation = trpc.auth.changePassword.useMutation();
  const refreshTokenMutation = trpc.auth.refresh.useMutation({
    onSuccess: (data) => {
      if (data && data.token) {
        localStorage.setItem('authToken', data.token);
      }
    }
  });
  const serverLogoutMutation = trpc.auth.logout.useMutation();

  return {
    register: registerMutation,
    login: loginMutation,
    logout,
    isAuthenticated,
    profile: profileQuery,
    forgotPassword: forgotPasswordMutation,
    resetPassword: resetPasswordMutation,
    changePassword: changePasswordMutation,
    refreshToken: refreshTokenMutation,
    serverLogout: serverLogoutMutation,
    client
  };
}; 