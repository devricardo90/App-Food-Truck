import { redirect } from 'next/navigation';

import { resolveAdminAuthContext } from '../../../src/lib/auth-context';

type TruckConsoleLayoutProps = {
  children: React.ReactNode;
};

export default async function TruckConsoleLayout({
  children,
}: TruckConsoleLayoutProps) {
  const backendAuthContext = await resolveAdminAuthContext();

  if (backendAuthContext.status !== 'ready') {
    return children;
  }

  if (backendAuthContext.data.requiresFoodtruckSelection) {
    redirect('/login' as const);
  }

  if (!backendAuthContext.data.activeFoodtruck) {
    redirect('/central' as const);
  }

  return children;
}
