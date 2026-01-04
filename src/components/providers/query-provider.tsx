'use client';

/**
 * TanStack Query Provider
 *
 * Provides React Query client to the entire application.
 * Handles server state (courses, users, certificates, progress).
 *
 * Why Client Component:
 * - QueryClient must be instantiated in client context
 * - QueryClientProvider is a client-side context provider
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode} from 'react';
import { useState } from 'react';

interface QueryProviderProps {
  children: ReactNode;
}

/**
 * Query Provider Component
 *
 * Wraps children with TanStack Query context.
 * Creates a new QueryClient instance per user session.
 */
export function QueryProvider({ children }: QueryProviderProps) {
  // Create QueryClient instance once per component lifecycle
  // Using useState ensures the client is stable across re-renders
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Stale time: How long data is considered fresh
            staleTime: 60 * 1000, // 1 minute

            // Cache time: How long inactive data stays in cache
            gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)

            // Retry failed requests
            retry: 1,

            // Refetch on window focus (useful for keeping data fresh)
            refetchOnWindowFocus: false,

            // Refetch on reconnect
            refetchOnReconnect: false,
          },
          mutations: {
            // Retry failed mutations
            retry: 0,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
