export type AuthMembership = {
  id: string;
  foodtruckId: string;
  foodtruckSlug: string;
  foodtruckName: string;
  role: string;
  status: string;
};

export type AuthMeResponse = {
  userId: string;
  externalAuthId: string;
  role: string;
  email: string | null;
  name: string | null;
  canAccessPlatform: boolean;
  requiresFoodtruckSelection: boolean;
  memberships: AuthMembership[];
  activeFoodtruck: AuthMembership | null;
};

export class AuthApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'AuthApiError';
  }
}

export async function fetchAuthMe(token: string): Promise<AuthMeResponse> {
  const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    throw new Error(
      'Defina EXPO_PUBLIC_API_BASE_URL para consultar /auth/me no mobile.',
    );
  }

  const response = await fetch(`${apiBaseUrl}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new AuthApiError(
      `A API respondeu ${response.status} ao consultar /auth/me no mobile.`,
      response.status,
    );
  }

  return (await response.json()) as AuthMeResponse;
}
