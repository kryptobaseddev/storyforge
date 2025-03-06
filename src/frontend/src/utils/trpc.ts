import { createTRPCReact, httpBatchLink } from '@trpc/react-query';
import { inferRouterOutputs, inferRouterInputs } from '@trpc/server';
import { QueryClient } from '@tanstack/react-query';
import type { AppRouter } from '../../../backend/src/routers/_app';
import superjson from 'superjson';

// Environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/trpc';

// Create a query client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

// Helper function to get the token from local storage
export const getAuthToken = () => localStorage.getItem('authToken');

// Create the tRPC client
export const trpc = createTRPCReact<AppRouter>();

// Initialize the tRPC client
export const trpcClient = trpc.createClient({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: API_URL,
      headers() {
        const token = getAuthToken();
        return {
          Authorization: token ? `Bearer ${token}` : '',
        };
      },
    }),
  ],
});

// Useful types
export type RouterOutputs = inferRouterOutputs<AppRouter>;
export type RouterInputs = inferRouterInputs<AppRouter>; 