import { ConsoleShell } from '../../../src/components/console-shell';

export default function TruckDashboardPage() {
  return (
    <ConsoleShell
      eyebrow="Area da barraca"
      title="Dashboard da barraca"
      description="Visao rapida de fila, disponibilidade operacional e alertas para operadores e gerentes."
      cards={[
        {
          title: 'Pedidos novos',
          value: '12',
          hint: 'Entradas aguardando aceite operacional.',
        },
        { title: 'Em preparo', value: '7', hint: 'Pedidos ativos na cozinha.' },
        {
          title: 'Prontos',
          value: '4',
          hint: 'Itens aguardando retirada do cliente.',
        },
      ]}
    />
  );
}
