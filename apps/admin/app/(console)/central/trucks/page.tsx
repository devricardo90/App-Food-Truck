import { ConsoleShell } from '../../../../src/components/console-shell';

export default function CentralTrucksPage() {
  return (
    <ConsoleShell
      eyebrow="Governanca"
      title="Lista de barracas"
      description="Base para consulta, cadastro futuro e governanca operacional das barracas da plataforma."
      cards={[
        {
          title: 'Ativas',
          value: '24',
          hint: 'Barracas ativas no evento corrente.',
        },
        {
          title: 'Pendentes',
          value: '2',
          hint: 'Aguardando revisão cadastral.',
        },
        {
          title: 'Bloqueadas',
          value: '1',
          hint: 'Operação temporariamente suspensa.',
        },
      ]}
    />
  );
}
