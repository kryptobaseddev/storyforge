import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Utility function to merge class names
/**
 * The cn function serves several important purposes in your React application:
 * 
 * 1. Conditional class names: It allows you to conditionally apply CSS classes based on props, state, or other conditions
 * 2. Class name merging: It intelligently merges Tailwind CSS classes, resolving conflicts when the same property is defined multiple times
 * 3. Component customization: It enables your UI components to accept custom class names from parent components while maintaining their base styles
 */

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
