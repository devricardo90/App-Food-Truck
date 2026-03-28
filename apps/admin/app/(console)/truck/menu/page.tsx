import { ConsoleShell } from '../../../../src/components/console-shell';

export default function TruckMenuPage() {
  return (
    <ConsoleShell
      eyebrow="Catalogo"
      title="Cardapio da barraca"
      description="Base para listar itens, ajustar disponibilidade e entrar na edicao operacional do menu."
      cards={[
        {
          title: 'Itens ativos',
          value: '18',
          hint: 'Itens disponiveis para pedido.',
        },
        {
          title: 'Pausados',
          value: '3',
          hint: 'Itens temporariamente indisponiveis.',
        },
        {
          title: 'Categorias',
          value: '4',
          hint: 'Agrupamentos do cardapio do dia.',
        },
      ]}
    />
  );
}
