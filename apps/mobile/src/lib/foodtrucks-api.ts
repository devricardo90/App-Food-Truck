export type FoodtruckListItem = {
  slug: string;
  name: string;
  description: string | null;
  displayName: string;
  acceptsOrders: boolean;
  capacityWindowMinutes: number;
  maxOrdersPerWindow: number;
  primaryCategory: string | null;
  instagram: string | null;
  whatsapp: string | null;
  heroImageKey: string | null;
};

export type FoodtruckDetail = FoodtruckListItem & {
  eventSlug: string;
  eventName: string;
  logoImageKey: string | null;
  operatingDays: string | null;
  openingTime: string | null;
  closingTime: string | null;
};

export type FoodtruckCatalogItem = {
  id: string;
  name: string;
  description: string | null;
  price: string;
  currency: string;
  isAvailable: boolean;
  dailyStockRemaining: number | null;
  sortOrder: number;
  imageKey: string | null;
};

export type FoodtruckCatalogCategory = {
  slug: string;
  name: string;
  sortOrder: number;
  items: FoodtruckCatalogItem[];
};

export type FoodtruckCatalog = {
  foodtruckSlug: string;
  foodtruckName: string;
  eventSlug: string;
  categories: FoodtruckCatalogCategory[];
};

function getApiBaseUrl() {
  const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    throw new Error('Defina EXPO_PUBLIC_API_BASE_URL para consumir a API.');
  }

  return apiBaseUrl;
}

async function fetchFromApi<T>(path: string): Promise<T> {
  const response = await fetch(`${getApiBaseUrl()}${path}`);

  if (!response.ok) {
    throw new Error(`A API respondeu ${response.status} em ${path}.`);
  }

  return (await response.json()) as T;
}

export function listFoodtrucks() {
  return fetchFromApi<FoodtruckListItem[]>('/foodtrucks');
}

export function getFoodtruckDetail(foodtruckSlug: string) {
  return fetchFromApi<FoodtruckDetail>(
    `/foodtrucks/${encodeURIComponent(foodtruckSlug)}`,
  );
}

export function getFoodtruckCatalog(foodtruckSlug: string) {
  return fetchFromApi<FoodtruckCatalog>(
    `/foodtrucks/${encodeURIComponent(foodtruckSlug)}/catalog`,
  );
}

export function formatPrice(price: string, currency = 'EUR') {
  const numericValue = Number(price);

  if (Number.isNaN(numericValue)) {
    return price;
  }

  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency,
  }).format(numericValue);
}
