import { TRPCClientError } from '@trpc/client';

interface ErrorWithMessage {
  message: string;
}

interface ZodFieldErrors {
  [key: string]: string[] | undefined;
}

interface ZodError {
  fieldErrors?: ZodFieldErrors;
}

interface TRPCErrorData {
  zodError?: ZodError;
}

/**
 * Check if the error has a message property
 */
function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

/**
 * Extract a user-friendly error message from any error
 */
export function getErrorMessage(error: unknown): string {
  if (isErrorWithMessage(error)) {
    return error.message;
  }
  
  // For TRPC client errors, get the formatted error message
  if (error instanceof TRPCClientError) {
    const errorData = error.data as TRPCErrorData | undefined;
    
    if (errorData?.zodError) {
      // Handle Zod validation errors
      const fieldErrors = errorData.zodError.fieldErrors;
      if (fieldErrors) {
        const errorMessages = Object.entries(fieldErrors)
          .map(([field, errors]) => {
            if (!errors || errors.length === 0) return '';
            return `${field}: ${errors.join(', ')}`;
          })
          .filter(Boolean)
          .join('; ');
          
        return `Validation error: ${errorMessages || 'Invalid input'}`;
      }
    }
    
    // Return the formatted error message
    return error.message;
  }
  
  return String(error);
}

/**
 * Format Zod validation errors into a record of field -> error message
 */
export function formatZodErrors(error: unknown): Record<string, string> {
  const formattedErrors: Record<string, string> = {};
  
  if (error instanceof TRPCClientError) {
    const errorData = error.data as TRPCErrorData | undefined;
    
    if (errorData?.zodError?.fieldErrors) {
      const fieldErrors = errorData.zodError.fieldErrors;
      
      Object.entries(fieldErrors).forEach(([field, errors]) => {
        if (errors && errors.length > 0) {
          formattedErrors[field] = errors[0];
        }
      });
    }
  }
  
  return formattedErrors;
} 