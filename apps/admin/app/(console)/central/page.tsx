import { resolveAdminAuthContext } from '../../../src/lib/auth-context';
import { ConsoleShell } from '../../../src/components/console-shell';

export default async function CentralDashboardPage() {
  const backendAuthContext = await resolveAdminAuthContext();
  const canAccessPlatform =
    backendAuthContext.status === 'ready'
      ? backendAuthContext.data.canAccessPlatform
      : false;

  return (
    <ConsoleShell
      eyebrow="Area central"
      title="Dashboard central"
      description={
        canAccessPlatform
          ? 'Escopo central confirmado pelo backend para governanca e suporte operacional.'
          : 'Ponto de entrada para governanca, alertas operacionais e visao consolidada da plataforma.'
      }
      cards={[
        {
          title: 'Role global',
          value:
            backendAuthContext.status === 'ready'
              ? backendAuthContext.data.role
              : 'pendente',
          hint: 'Role principal recebida do contrato /auth/me.',
        },
        {
          title: 'Acesso central',
          value: canAccessPlatform ? 'liberado' : 'negado',
          hint: 'Resultado direto do campo canAccessPlatform no backend.',
        },
        {
          title: 'Memberships',
          value:
            backendAuthContext.status === 'ready'
              ? String(backendAuthContext.data.memberships.length)
              : '0',
          hint: 'Memberships carregados junto com o contexto autenticado.',
        },
      ]}
    />
  );
}
