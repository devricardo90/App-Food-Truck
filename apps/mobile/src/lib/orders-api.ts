export type CreateOrderItemInput = {
  menuItemId: string;
  quantity: number;
  note?: string;
};

export type CreateOrderInput = {
  foodtruckSlug: string;
  specialInstructions?: string;
  items: CreateOrderItemInput[];
};

export type OrderLine = {
  id: string;
  menuItemId: string | null;
  itemName: string;
  unitPrice: string;
  quantity: number;
  lineTotal: string;
  note?: string | null;
};

export type OrderSnapshot = {
  id: string;
  publicCode: string;
  status: string;
  subtotalAmount: string;
  totalAmount: string;
  currency: string;
  specialInstructions?: string | null;
  capacityWindowStart: string | null;
  capacityWindowEnd: string | null;
  eventTruck: {
    id: string;
    foodtruckSlug: string;
    foodtruckName: string;
    eventSlug: string;
  };
  items: OrderLine[];
  payment: {
    id: string;
    provider: string;
    status: string;
    amount: string;
    currency: string;
  };
  createdAt: string;
  updatedAt: string;
};

export class OrdersApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly detail: string | null = null,
  ) {
    super(message);
    this.name = 'OrdersApiError';
  }
}

function getApiBaseUrl() {
  const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    throw new Error('Defina EXPO_PUBLIC_API_BASE_URL para consumir a API.');
  }

  return apiBaseUrl;
}

async function readOrdersErrorDetail(response: Response) {
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

async function fetchAuthorizedFromApi<T>(
  path: string,
  token: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const detail = await readOrdersErrorDetail(response);
    throw new OrdersApiError(
      `A API respondeu ${response.status} em ${path}.${detail ? ` ${detail}` : ''}`,
      response.status,
      detail,
    );
  }

  return (await response.json()) as T;
}

export function createPendingOrder(token: string, payload: CreateOrderInput) {
  return fetchAuthorizedFromApi<OrderSnapshot>('/orders', token, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function fetchOrderById(token: string, orderId: string) {
  return fetchAuthorizedFromApi<OrderSnapshot>(
    `/orders/${encodeURIComponent(orderId)}`,
    token,
    {
      method: 'GET',
    },
  );
}
