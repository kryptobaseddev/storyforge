import { useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

/**
 * Hook for managing toast notifications
 * @returns Methods for displaying and managing toast notifications
 */
function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  /**
   * Add a new toast notification
   */
  const addToast = useCallback((
    message: string, 
    type: ToastType = 'info', 
    duration: number = 5000
  ) => {
    const id = Date.now().toString();
    
    const newToast: Toast = {
      id,
      message,
      type,
      duration,
    };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto-remove toast after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    
    return id;
  }, []);

  /**
   * Remove a toast by ID
   */
  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  /**
   * Convenience method for success toast
   */
  const success = useCallback((message: string, duration?: number) => {
    return addToast(message, 'success', duration);
  }, [addToast]);

  /**
   * Convenience method for error toast
   */
  const error = useCallback((message: string, duration?: number) => {
    return addToast(message, 'error', duration);
  }, [addToast]);

  /**
   * Convenience method for warning toast
   */
  const warning = useCallback((message: string, duration?: number) => {
    return addToast(message, 'warning', duration);
  }, [addToast]);

  /**
   * Convenience method for info toast
   */
  const info = useCallback((message: string, duration?: number) => {
    return addToast(message, 'info', duration);
  }, [addToast]);

  /**
   * Clear all toasts
   */
  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
    clearAll,
  };
}

export default useToast; 