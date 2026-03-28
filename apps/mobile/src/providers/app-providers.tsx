import type { PropsWithChildren } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';

import { mobileQueryClient } from '../lib/query-client';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={mobileQueryClient}>
      {children}
    </QueryClientProvider>
  );
}
