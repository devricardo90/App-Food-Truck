import { ConsoleShell } from '../../../src/components/console-shell';

export default function CentralDashboardPage() {
  return (
    <ConsoleShell
      eyebrow="Area central"
      title="Dashboard central"
      description="Ponto de entrada para governanca, alertas operacionais e visao consolidada da plataforma."
      cards={[
        {
          title: 'Barracas ativas',
          value: '24',
          hint: 'Operando no evento atual.',
        },
        {
          title: 'Alertas',
          value: '3',
          hint: 'Incidentes aguardando triagem.',
        },
        {
          title: 'Acessos admins',
          value: '11',
          hint: 'Usuarios com role central ativa.',
        },
      ]}
    />
  );
}
