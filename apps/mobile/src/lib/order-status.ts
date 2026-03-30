export function mapOrderStatusLabel(status: string) {
  switch (status) {
    case 'pending_payment':
      return 'Aguardando confirmacao de pagamento';
    case 'new':
      return 'Pedido confirmado';
    case 'in_progress':
      return 'Em preparo';
    case 'ready':
      return 'Pronto para retirada';
    case 'completed':
      return 'Concluido';
    case 'cancelled':
      return 'Cancelado';
    default:
      return status;
  }
}

export function isOrderStatusTerminal(status: string) {
  return status === 'completed' || status === 'cancelled';
}

export function getOperationalOrderRefreshInterval(status: string) {
  return isOrderStatusTerminal(status) ? false : 15000;
}

export function buildOrderTimeline(status: string) {
  const steps = [
    {
      label: 'Checkout criado',
      done: true,
    },
    {
      label: 'Pagamento confirmado',
      done: status !== 'pending_payment',
    },
    {
      label: 'Pedido em preparo',
      done:
        status === 'in_progress' ||
        status === 'ready' ||
        status === 'completed',
    },
    {
      label: 'Pedido pronto',
      done: status === 'ready' || status === 'completed',
    },
    {
      label: 'Pedido concluido',
      done: status === 'completed',
    },
  ];

  if (status === 'cancelled') {
    return [
      ...steps.slice(0, 2),
      {
        label: 'Pedido cancelado',
        done: true,
      },
    ];
  }

  return steps;
}

export function getOrderStatusTone(status: string) {
  switch (status) {
    case 'ready':
      return {
        badge: 'bg-emerald-100 text-emerald-800',
        panel: 'border-emerald-200 bg-emerald-50',
      };
    case 'completed':
      return {
        badge: 'bg-stone-200 text-stone-800',
        panel: 'border-stone-200 bg-stone-50',
      };
    case 'cancelled':
      return {
        badge: 'bg-rose-100 text-rose-800',
        panel: 'border-rose-200 bg-rose-50',
      };
    case 'in_progress':
      return {
        badge: 'bg-amber-100 text-amber-800',
        panel: 'border-amber-200 bg-amber-50',
      };
    default:
      return {
        badge: 'bg-sky-100 text-sky-800',
        panel: 'border-sky-200 bg-sky-50',
      };
  }
}
