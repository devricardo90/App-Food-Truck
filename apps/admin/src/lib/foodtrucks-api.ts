import type { AdminAuthMembership } from './auth-context';

export type AdminFoodtruckCatalogItem = {
  id: string;
  name: string;
  description: string | null;
  price: string;
  isAvailable: boolean;
  dailyStockRemaining: number | null;
  sortOrder: number;
};

export type AdminFoodtruckCatalogCategory = {
  slug: string;
  name: string;
  sortOrder: number;
  items: AdminFoodtruckCatalogItem[];
};

export type AdminFoodtruckCatalogResponse = {
  foodtruckSlug: string;
  foodtruckName: string;
  eventSlug: string;
  categories: AdminFoodtruckCatalogCategory[];
};

export async function fetchFoodtruckCatalog(
  membership: AdminAuthMembership,
): Promise<AdminFoodtruckCatalogResponse> {
  const apiBaseUrl =
    process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    throw new Error(
      'Defina `API_BASE_URL` ou `NEXT_PUBLIC_API_BASE_URL` para consultar o catalogo real.',
    );
  }

  const response = await fetch(
    `${apiBaseUrl}/foodtrucks/${membership.foodtruckSlug}/catalog`,
    {
      cache: 'no-store',
    },
  );

  if (!response.ok) {
    throw new Error(
      `A API respondeu ${response.status} ao consultar o catalogo de ${membership.foodtruckSlug}.`,
    );
  }

  return (await response.json()) as AdminFoodtruckCatalogResponse;
}

export function formatAdminPrice(price: string) {
  const numericValue = Number(price);

  if (Number.isNaN(numericValue)) {
    return price;
  }

  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(numericValue);
}
