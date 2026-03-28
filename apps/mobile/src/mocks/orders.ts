export type OrderSummary = {
  id: string;
  code: string;
  truckName: string;
  statusLabel: string;
  timeline: string[];
};

export const orderSummaries: OrderSummary[] = [
  {
    id: 'order-1024',
    code: '#1024',
    truckName: 'Smoke House',
    statusLabel: 'Ready for pickup',
    timeline: ['Pagamento confirmado', 'Pedido em preparo', 'Pedido pronto'],
  },
  {
    id: 'order-1023',
    code: '#1023',
    truckName: 'Taco Lab',
    statusLabel: 'In progress',
    timeline: ['Pagamento confirmado', 'Fila da cozinha iniciada'],
  },
];

export function findOrderById(orderId?: string) {
  return orderSummaries.find((order) => order.id === orderId);
}
