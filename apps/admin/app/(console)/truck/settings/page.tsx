import { ConsoleShell } from '../../../../src/components/console-shell';

export default function TruckSettingsPage() {
  return (
    <ConsoleShell
      eyebrow="Configuracoes"
      title="Configurações básicas da barraca"
      description="Espaco para dados locais, disponibilidade operacional e controles da equipe da barraca."
      cards={[
        {
          title: 'Status operacional',
          value: 'Aberta',
          hint: 'Recebendo pedidos no evento atual.',
        },
        {
          title: 'Equipe ativa',
          value: '6',
          hint: 'Membros vinculados à barraca.',
        },
        {
          title: 'Janelas configuradas',
          value: '8',
          hint: 'Slots de preparo definidos para o dia.',
        },
      ]}
    />
  );
}
