import { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  code?: string;
  field?: string;
}

/**
 * Processes an API error and returns a standardized error object
 */
export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof AxiosError && error.response) {
    // Handle structured API errors
    const { data, status } = error.response;
    
    if (data.message) {
      return {
        message: data.message,
        code: data.code,
        field: data.field
      };
    }
    
    // Handle different status codes
    switch (status) {
      case 400:
        return { message: 'Invalid request. Please check your data.' };
      case 401:
        return { message: 'Authentication required. Please log in.' };
      case 403:
        return { message: 'You do not have permission to perform this action.' };
      case 404:
        return { message: 'The requested resource was not found.' };
      case 422:
        return { message: 'Validation error. Please check your input.' };
      case 500:
        return { message: 'Server error. Please try again later.' };
      default:
        return { message: 'An unexpected error occurred.' };
    }
  }
  
  // Handle network errors
  if (error instanceof AxiosError && error.request) {
    return { message: 'Network error. Please check your connection.' };
  }
  
  // Handle other errors
  return { 
    message: error instanceof Error ? error.message : 'An unexpected error occurred.'
  };
};

export default handleApiError; 