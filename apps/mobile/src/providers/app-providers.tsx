import type { PropsWithChildren } from 'react';
import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { QueryClientProvider } from '@tanstack/react-query';

import { mobileQueryClient } from '../lib/query-client';
import { AuthBootstrapProvider } from './auth-bootstrap-provider';

export function AppProviders({ children }: PropsWithChildren) {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <QueryClientProvider client={mobileQueryClient}>
        <AuthBootstrapProvider>{children}</AuthBootstrapProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
