import { ConsoleShell } from '../../../../src/components/console-shell';

export default function CentralSupportPage() {
  return (
    <ConsoleShell
      eyebrow="Suporte"
      title="Visão de suporte operacional"
      description="Base para consulta de incidentes, leitura de estados e apoio ao atendimento sem operar a barraca."
      cards={[
        {
          title: 'Casos abertos',
          value: '3',
          hint: 'Incidentes aguardando análise.',
        },
        {
          title: 'Pedidos críticos',
          value: '2',
          hint: 'Fluxos com atenção operacional.',
        },
        {
          title: 'Barracas monitoradas',
          value: '6',
          hint: 'Operações com alerta recente.',
        },
      ]}
    />
  );
}
