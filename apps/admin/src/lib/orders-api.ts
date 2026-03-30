import { auth } from '@clerk/nextjs/server';

import type { AdminAuthMembership } from './auth-context';

export type AdminTruckOrderQueueItem = {
  id: string;
  publicCode: string;
  status: string;
  totalAmount: string;
  currency: string;
  customerName: string | null;
  customerEmail: string | null;
  createdAt: string;
};

export type AdminTruckOrderQueueResponse = {
  activeFoodtruck: {
    id: string;
    foodtruckSlug: string;
    foodtruckName: string;
    eventSlug: string;
  };
  pendingPaymentCount: number;
  newCount: number;
  inProgressCount: number;
  readyCount: number;
  orders: AdminTruckOrderQueueItem[];
};

export async function fetchTruckOrderQueue(
  membership: AdminAuthMembership,
): Promise<AdminTruckOrderQueueResponse> {
  const apiBaseUrl =
    process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;
  const clerkJwtTemplate =
    process.env.CLERK_JWT_TEMPLATE ?? process.env.NEXT_PUBLIC_CLERK_JWT_TEMPLATE;

  if (!apiBaseUrl) {
    throw new Error(
      'Defina `API_BASE_URL` ou `NEXT_PUBLIC_API_BASE_URL` para consultar a fila de pedidos real.',
    );
  }

  const authState = await auth();
  const token = await authState.getToken(
    clerkJwtTemplate ? { template: clerkJwtTemplate } : undefined,
  );

  if (!token) {
    throw new Error(
      'A sessao do admin nao retornou bearer token para consultar a fila de pedidos.',
    );
  }

  const response = await fetch(`${apiBaseUrl}/orders/foodtruck-queue`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'x-foodtruck-id': membership.foodtruckId,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(
      `A API respondeu ${response.status} ao consultar a fila de pedidos de ${membership.foodtruckSlug}.`,
    );
  }

  return (await response.json()) as AdminTruckOrderQueueResponse;
}

export function formatOrderStatusLabel(status: string) {
  switch (status) {
    case 'pending_payment':
      return 'Aguardando pagamento';
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
