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

export type AdminTruckOrderStatusAction = {
  targetStatus: 'in_progress' | 'ready' | 'completed';
  label: string;
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

export async function updateTruckOrderStatus(
  membership: AdminAuthMembership,
  orderId: string,
  targetStatus: AdminTruckOrderStatusAction['targetStatus'],
) {
  const apiBaseUrl =
    process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;
  const clerkJwtTemplate =
    process.env.CLERK_JWT_TEMPLATE ?? process.env.NEXT_PUBLIC_CLERK_JWT_TEMPLATE;

  if (!apiBaseUrl) {
    throw new Error(
      'Defina `API_BASE_URL` ou `NEXT_PUBLIC_API_BASE_URL` para atualizar o status real do pedido.',
    );
  }

  const authState = await auth();
  const token = await authState.getToken(
    clerkJwtTemplate ? { template: clerkJwtTemplate } : undefined,
  );

  if (!token) {
    throw new Error(
      'A sessao do admin nao retornou bearer token para atualizar o status do pedido.',
    );
  }

  const response = await fetch(`${apiBaseUrl}/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'x-foodtruck-id': membership.foodtruckId,
    },
    body: JSON.stringify({
      targetStatus,
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    const detail = await readAdminOrderErrorDetail(response);

    throw new Error(
      [
        `A API respondeu ${response.status} ao atualizar o pedido ${orderId}.`,
        detail,
      ]
        .filter(Boolean)
        .join(' '),
    );
  }
}

async function readAdminOrderErrorDetail(response: Response) {
  try {
    const contentType = response.headers.get('content-type') ?? '';

    if (contentType.includes('application/json')) {
      const payload = (await response.json()) as {
        message?: string | string[];
        error?: string;
      };

      if (Array.isArray(payload.message)) {
        return payload.message.join(' | ');
      }

      if (typeof payload.message === 'string') {
        return payload.message;
      }

      if (typeof payload.error === 'string') {
        return payload.error;
      }
    }

    const text = (await response.text()).trim();

    return text || null;
  } catch {
    return null;
  }
}

export function getOperationalOrderActions(
  status: string,
): AdminTruckOrderStatusAction[] {
  switch (status) {
    case 'new':
      return [
        {
          targetStatus: 'in_progress',
          label: 'Iniciar preparo',
        },
      ];
    case 'in_progress':
      return [
        {
          targetStatus: 'ready',
          label: 'Marcar pronto',
        },
      ];
    case 'ready':
      return [
        {
          targetStatus: 'completed',
          label: 'Concluir retirada',
        },
      ];
    default:
      return [];
  }
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
