export type TruckSummary = {
  id: string;
  name: string;
  category: string;
  status: string;
  description: string;
};

export type MenuItemSummary = {
  id: string;
  truckId: string;
  name: string;
  description: string;
  priceLabel: string;
};

export const trucks: TruckSummary[] = [
  {
    id: 'smoke-house',
    name: 'Smoke House',
    category: 'Burger',
    status: 'Aceitando pedidos',
    description: 'Burgers artesanais e fila rapida para retirada.',
  },
  {
    id: 'taco-lab',
    name: 'Taco Lab',
    category: 'Mexicano',
    status: 'Preparando em 15 min',
    description: 'Tacos e bowls com foco em operacao rapida de evento.',
  },
];

export const menuItems: MenuItemSummary[] = [
  {
    id: 'classic-burger',
    truckId: 'smoke-house',
    name: 'Classic Burger',
    description: 'Pao brioche, smash burger e cheddar.',
    priceLabel: 'EUR 11,00',
  },
  {
    id: 'fries-bacon',
    truckId: 'smoke-house',
    name: 'Fries Bacon',
    description: 'Batata frita com bacon crocante e molho da casa.',
    priceLabel: 'EUR 6,50',
  },
  {
    id: 'taco-al-pastor',
    truckId: 'taco-lab',
    name: 'Taco Al Pastor',
    description: 'Tortilha artesanal com porco marinado e abacaxi.',
    priceLabel: 'EUR 8,90',
  },
];

export function findTruckById(truckId?: string) {
  return trucks.find((truck) => truck.id === truckId);
}

export function findMenuItemsByTruck(truckId?: string) {
  return menuItems.filter((item) => item.truckId === truckId);
}

export function findMenuItemById(truckId?: string, itemId?: string) {
  return menuItems.find(
    (item) => item.truckId === truckId && item.id === itemId,
  );
}
