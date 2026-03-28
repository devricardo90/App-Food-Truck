import { redirect } from 'next/navigation';

import { resolveAdminAuthContext } from '../../../src/lib/auth-context';

type CentralConsoleLayoutProps = {
  children: React.ReactNode;
};

export default async function CentralConsoleLayout({
  children,
}: CentralConsoleLayoutProps) {
  const backendAuthContext = await resolveAdminAuthContext();

  if (backendAuthContext.status !== 'ready') {
    return children;
  }

  if (!backendAuthContext.data.canAccessPlatform) {
    if (backendAuthContext.data.activeFoodtruck) {
      redirect('/truck' as const);
    }

    redirect('/login' as const);
  }

  return children;
}
