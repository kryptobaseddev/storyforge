import { toast } from "sonner";

/**
 * Hook for displaying toast notifications using sonner
 * 
 * Example usage:
 * const toast = useToast();
 * 
 * // Basic toast
 * toast("Hello world");
 * 
 * // Success toast
 * toast.success("Operation successful");
 * 
 * // Error toast
 * toast.error("Something went wrong");
 * 
 * // Promise toast
 * toast.promise(
 *   fetch('/api/data'),
 *   {
 *     loading: 'Loading...',
 *     success: 'Data loaded',
 *     error: 'Error loading data'
 *   }
 * );
 */
export function useToast() {
  return toast;
} 