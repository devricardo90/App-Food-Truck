import { resolveAdminAuthContext } from '../../../src/lib/auth-context';
import { ConsoleShell } from '../../../src/components/console-shell';

export default async function TruckDashboardPage() {
  const backendAuthContext = await resolveAdminAuthContext();
  const activeFoodtruck =
    backendAuthContext.status === 'ready'
      ? backendAuthContext.data.activeFoodtruck
      : null;

  return (
    <ConsoleShell
      eyebrow="Area da barraca"
      title={activeFoodtruck?.foodtruckName ?? 'Dashboard da barraca'}
      description={
        activeFoodtruck
          ? `Contexto operacional real resolvido pela API para ${activeFoodtruck.foodtruckName}.`
          : 'Visao rapida de fila, disponibilidade operacional e alertas para operadores e gerentes.'
      }
      cards={[
        {
          title: 'Role ativa',
          value: activeFoodtruck?.role ?? 'pendente',
          hint: activeFoodtruck
            ? 'Permissao operacional recebida do contrato /auth/me.'
            : 'Nenhum foodtruck ativo foi resolvido para o usuario atual.',
        },
        {
          title: 'Foodtruck ativo',
          value: activeFoodtruck?.foodtruckSlug ?? 'sem-contexto',
          hint: activeFoodtruck
            ? 'Slug recebido do backend para identificar o contexto da barraca.'
            : 'Selecao de foodtruck ainda nao concluida no backend.',
        },
        {
          title: 'Memberships',
          value:
            backendAuthContext.status === 'ready'
              ? String(backendAuthContext.data.memberships.length)
              : '0',
          hint: 'Quantidade de memberships ativos retornados em /auth/me.',
        },
      ]}
    />
  );
}
