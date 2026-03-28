import { ConsoleShell } from '../../../../src/components/console-shell';

export default function TruckOrdersPage() {
  return (
    <ConsoleShell
      eyebrow="Operacao"
      title="Fila de pedidos"
      description="Entrada base para lista de pedidos, filtros por estado e acesso ao detalhe operacional."
      cards={[
        {
          title: 'Novos',
          value: '5',
          hint: 'Pedidos aguardando inicio de preparo.',
        },
        {
          title: 'Em preparo',
          value: '7',
          hint: 'Pedidos com cozinha em andamento.',
        },
        {
          title: 'Prontos',
          value: '4',
          hint: 'Retiradas pendentes no balcão.',
        },
      ]}
    />
  );
}
