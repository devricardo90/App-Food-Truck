import type {
  FoodtruckCatalogResponseDto,
  FoodtruckDetailDto,
  FoodtruckListItemDto,
} from './foodtrucks.dto';

type DevelopmentFoodtruckRecord = {
  listItem: FoodtruckListItemDto;
  detail: FoodtruckDetailDto;
  catalog: FoodtruckCatalogResponseDto;
};

const funkyChicken: DevelopmentFoodtruckRecord = {
  listItem: {
    slug: 'funky-chicken',
    name: 'Funky Chicken',
    description:
      'Street food de frango crocante e burgers com operacao de almoco em Stockholm e Nacka.',
    displayName: 'Funky Chicken',
    acceptsOrders: true,
    capacityWindowMinutes: 15,
    maxOrdersPerWindow: 20,
    primaryCategory: 'hamburguer / street food',
    instagram: '@funkychickenfoodtruck',
    whatsapp: '+46 72 270 30 64',
    heroImageKey: 'funky-chicken/hero',
  },
  detail: {
    slug: 'funky-chicken',
    name: 'Funky Chicken',
    description:
      'Foodtruck baseada em Nacka Strand, conhecida por burgers e street food com forte identidade urbana.',
    displayName: 'Funky Chicken',
    acceptsOrders: true,
    capacityWindowMinutes: 15,
    maxOrdersPerWindow: 20,
    eventSlug: 'dev-lunch-service-stockholm',
    eventName: 'Lunch service / eventos em Stockholm e Nacka',
    primaryCategory: 'hamburguer / street food',
    instagram: '@funkychickenfoodtruck',
    whatsapp: '+46 72 270 30 64',
    heroImageKey: 'funky-chicken/hero',
    logoImageKey: 'funky-chicken/logo',
    operatingDays:
      'Segunda a sexta no almoco; fins de semana variam conforme agenda.',
    openingTime: '10:30',
    closingTime: '14:00',
  },
  catalog: {
    foodtruckSlug: 'funky-chicken',
    foodtruckName: 'Funky Chicken',
    eventSlug: 'dev-lunch-service-stockholm',
    categories: [
      {
        slug: 'pratos',
        name: 'Pratos',
        sortOrder: 0,
        items: [
          {
            id: 'chicken-over-rice',
            name: 'Chicken over rice',
            description:
              'Frango com arroz no estilo street food nova-iorquino.',
            price: '135.00',
            currency: 'SEK',
            isAvailable: true,
            dailyStockRemaining: null,
            sortOrder: 0,
            imageKey: null,
          },
          {
            id: 'veggie-over-rice',
            name: 'Veggie over rice',
            description:
              'Versao vegetariana com arroz. Preco pendente de validacao.',
            price: '0.00',
            currency: 'SEK',
            isAvailable: false,
            dailyStockRemaining: null,
            sortOrder: 1,
            imageKey: null,
          },
        ],
      },
      {
        slug: 'lanches',
        name: 'Lanches',
        sortOrder: 1,
        items: [
          {
            id: 'triple-cheese-burger-150g',
            name: 'Triple Cheese Burger 150g',
            description: 'Hamburguer com triplo queijo.',
            price: '132.00',
            currency: 'SEK',
            isAvailable: true,
            dailyStockRemaining: null,
            sortOrder: 0,
            imageKey: 'funky-chicken/burger',
          },
          {
            id: 'triple-cheese-burger-300g',
            name: 'Triple Cheese Burger 300g',
            description: 'Versao maior do hamburguer com triplo queijo.',
            price: '174.00',
            currency: 'SEK',
            isAvailable: true,
            dailyStockRemaining: null,
            sortOrder: 1,
            imageKey: 'funky-chicken/burger',
          },
        ],
      },
    ],
  },
};

const soulisticFoodTruck: DevelopmentFoodtruckRecord = {
  listItem: {
    slug: 'soulistic-food-truck',
    name: 'Soulistic Food Truck',
    description:
      'Soul food com operacao fixa e catering em Stockholm, com foco em pratos cremosos e frango frito.',
    displayName: 'Soulistic Food Truck',
    acceptsOrders: true,
    capacityWindowMinutes: 20,
    maxOrdersPerWindow: 18,
    primaryCategory: 'southern soul food / frango frito',
    instagram: null,
    whatsapp: '+46 73 996 25 19',
    heroImageKey: 'soulistic-food-truck/hero',
  },
  detail: {
    slug: 'soulistic-food-truck',
    name: 'Soulistic Food Truck',
    description:
      'Operacao inspirada em Southern soul food, conectada ao Soulistic Foods Diner e voltada para atendimento fixo e catering em Stockholm.',
    displayName: 'Soulistic Food Truck',
    acceptsOrders: true,
    capacityWindowMinutes: 20,
    maxOrdersPerWindow: 18,
    eventSlug: 'dev-soulistic-stockholm',
    eventName:
      'Operacao fixa / catering em Daghammarskjolds vagen 31, Stockholm',
    primaryCategory: 'southern soul food / frango frito',
    instagram: null,
    whatsapp: '+46 73 996 25 19',
    heroImageKey: 'soulistic-food-truck/hero',
    logoImageKey: 'soulistic-food-truck/logo',
    operatingDays: null,
    openingTime: null,
    closingTime: null,
  },
  catalog: {
    foodtruckSlug: 'soulistic-food-truck',
    foodtruckName: 'Soulistic Food Truck',
    eventSlug: 'dev-soulistic-stockholm',
    categories: [
      {
        slug: 'pratos',
        name: 'Pratos',
        sortOrder: 0,
        items: [
          {
            id: 'mac-and-cheese',
            name: 'Mac & Cheese',
            description: 'Massa cremosa com queijo no estilo soul food.',
            price: '159.00',
            currency: 'SEK',
            isAvailable: true,
            dailyStockRemaining: null,
            sortOrder: 0,
            imageKey: 'soulistic-food-truck/grain-bowl',
          },
          {
            id: 'creamed-corn',
            name: 'Creamed Corn',
            description: 'Milho cremoso como acompanhamento.',
            price: '189.00',
            currency: 'SEK',
            isAvailable: true,
            dailyStockRemaining: null,
            sortOrder: 1,
            imageKey: 'soulistic-food-truck/smoothie',
          },
        ],
      },
      {
        slug: 'lanches',
        name: 'Lanches',
        sortOrder: 1,
        items: [
          {
            id: 'crispy-fried-chicken-burger',
            name: 'Crispy Fried Chicken Burger',
            description: 'Hamburguer de frango crocante.',
            price: '249.00',
            currency: 'SEK',
            isAvailable: true,
            dailyStockRemaining: null,
            sortOrder: 0,
            imageKey: 'soulistic-food-truck/wrap',
          },
        ],
      },
    ],
  },
};

const ceylonFoodTruck: DevelopmentFoodtruckRecord = {
  listItem: {
    slug: 'ceylon-food-truck',
    name: 'Ceylon Food Truck',
    description:
      'Street food inspirada no Sri Lanka, com curries, burgers e wraps em operacao por eventos e ruas da Suecia.',
    displayName: 'Ceylon Food Truck',
    acceptsOrders: true,
    capacityWindowMinutes: 20,
    maxOrdersPerWindow: 18,
    primaryCategory: 'comida do Sri Lanka / curry / burgers / wraps',
    instagram: '@ceylonfoodtruck',
    whatsapp: null,
    heroImageKey: 'ceylon-food-truck/hero',
  },
  detail: {
    slug: 'ceylon-food-truck',
    name: 'Ceylon Food Truck',
    description:
      'Foodtruck com base operacional associada a Stockholm e proposta focada em sabores do Sri Lanka para eventos e operacao urbana.',
    displayName: 'Ceylon Food Truck',
    acceptsOrders: true,
    capacityWindowMinutes: 20,
    maxOrdersPerWindow: 18,
    eventSlug: 'dev-ceylon-stockholm',
    eventName: 'Eventos e ruas da Suecia; base em Stockholm',
    primaryCategory: 'comida do Sri Lanka / curry / burgers / wraps',
    instagram: '@ceylonfoodtruck',
    whatsapp: null,
    heroImageKey: 'ceylon-food-truck/hero',
    logoImageKey: 'ceylon-food-truck/logo',
    operatingDays: null,
    openingTime: null,
    closingTime: null,
  },
  catalog: {
    foodtruckSlug: 'ceylon-food-truck',
    foodtruckName: 'Ceylon Food Truck',
    eventSlug: 'dev-ceylon-stockholm',
    categories: [
      {
        slug: 'pratos',
        name: 'Pratos',
        sortOrder: 0,
        items: [
          {
            id: 'curry',
            name: 'Curry',
            description: 'Curries inspirados no Sri Lanka.',
            price: '249.00',
            currency: 'SEK',
            isAvailable: true,
            dailyStockRemaining: null,
            sortOrder: 0,
            imageKey: 'ceylon-food-truck/curry',
          },
        ],
      },
      {
        slug: 'lanches',
        name: 'Lanches',
        sortOrder: 1,
        items: [
          {
            id: 'burger',
            name: 'Burger',
            description:
              'Hamburguer com influencia de street food do Sri Lanka.',
            price: '289.00',
            currency: 'SEK',
            isAvailable: true,
            dailyStockRemaining: null,
            sortOrder: 0,
            imageKey: 'ceylon-food-truck/street-food',
          },
          {
            id: 'wrap',
            name: 'Wrap',
            description: 'Wrap de street food com sabores do Sri Lanka.',
            price: '349.00',
            currency: 'SEK',
            isAvailable: true,
            dailyStockRemaining: null,
            sortOrder: 1,
            imageKey: 'ceylon-food-truck/tea-dessert',
          },
        ],
      },
    ],
  },
};

const fuegoDelSurGrill: DevelopmentFoodtruckRecord = {
  listItem: {
    slug: 'fuego-del-sur-grill',
    name: 'Fuego del Sur Grill',
    description:
      'Parrilla argentina premium com chorizo, cortes na brasa e experiencia de fogo ao vivo em eventos de Stockholm.',
    displayName: 'Fuego del Sur Grill',
    acceptsOrders: true,
    capacityWindowMinutes: 18,
    maxOrdersPerWindow: 16,
    primaryCategory: 'argentina / grill / parrilla / churrasco',
    instagram: '@fuegodelsur.stockholm',
    whatsapp: null,
    heroImageKey: 'fuego-del-sur-grill/hero',
  },
  detail: {
    slug: 'fuego-del-sur-grill',
    name: 'Fuego del Sur Grill',
    description:
      'Foodtruck com posicionamento premium, foco em parrilla argentina, fogo ao vivo e catering para eventos corporativos e festivais gastronomicos.',
    displayName: 'Fuego del Sur Grill',
    acceptsOrders: true,
    capacityWindowMinutes: 18,
    maxOrdersPerWindow: 16,
    eventSlug: 'dev-fuego-del-sur-stockholm',
    eventName:
      'Eventos corporativos, festivais gastronomicos e catering em Stockholm',
    primaryCategory: 'argentina / grill / parrilla / churrasco',
    instagram: '@fuegodelsur.stockholm',
    whatsapp: null,
    heroImageKey: 'fuego-del-sur-grill/hero',
    logoImageKey: 'fuego-del-sur-grill/logo',
    operatingDays: null,
    openingTime: null,
    closingTime: null,
  },
  catalog: {
    foodtruckSlug: 'fuego-del-sur-grill',
    foodtruckName: 'Fuego del Sur Grill',
    eventSlug: 'dev-fuego-del-sur-stockholm',
    categories: [
      {
        slug: 'pratos',
        name: 'Pratos',
        sortOrder: 0,
        items: [
          {
            id: 'parrilla-plate',
            name: 'Parrilla Plate',
            description:
              'Selecao de carnes grelhadas servidas com acompanhamentos.',
            price: '189.00',
            currency: 'SEK',
            isAvailable: true,
            dailyStockRemaining: null,
            sortOrder: 0,
            imageKey: 'fuego-del-sur-grill/parrilla-plate',
          },
        ],
      },
      {
        slug: 'lanches',
        name: 'Lanches',
        sortOrder: 1,
        items: [
          {
            id: 'chorizo-roll',
            name: 'Chorizo Roll',
            description: 'Linguica argentina grelhada no pao com chimichurri.',
            price: '129.00',
            currency: 'SEK',
            isAvailable: true,
            dailyStockRemaining: null,
            sortOrder: 0,
            imageKey: 'fuego-del-sur-grill/choripan',
          },
          {
            id: 'chimichurri-beef-sandwich',
            name: 'Chimichurri Beef Sandwich',
            description:
              'Sanduiche de carne fatiada com molho chimichurri artesanal.',
            price: '149.00',
            currency: 'SEK',
            isAvailable: true,
            dailyStockRemaining: null,
            sortOrder: 1,
            imageKey: 'fuego-del-sur-grill/steak-sandwich',
          },
          {
            id: 'empanada-de-carne',
            name: 'Empanada de Carne',
            description:
              'Pastel assado argentino recheado com carne temperada.',
            price: '55.00',
            currency: 'SEK',
            isAvailable: true,
            dailyStockRemaining: null,
            sortOrder: 2,
            imageKey: null,
          },
        ],
      },
    ],
  },
};

const casaBrasil: DevelopmentFoodtruckRecord = {
  listItem: {
    slug: 'casa-brasil',
    name: 'Casa Brasil',
    description:
      'Marca brasileira focada em salgados, sobremesas e acai, com proposta casual, jovem e de alto apelo visual.',
    displayName: 'Casa Brasil',
    acceptsOrders: true,
    capacityWindowMinutes: 10,
    maxOrdersPerWindow: 24,
    primaryCategory: 'snacks brasileiros / doces / acai',
    instagram: '@casabrasil.se',
    whatsapp: null,
    heroImageKey: 'casa-brasil/hero',
  },
  detail: {
    slug: 'casa-brasil',
    name: 'Casa Brasil',
    description:
      'Marca brasileira voltada para snack, doce e refresco, com acai como produto ancora e forte aderencia a eventos de rua, parks e ativacoes de marca.',
    displayName: 'Casa Brasil',
    acceptsOrders: true,
    capacityWindowMinutes: 10,
    maxOrdersPerWindow: 24,
    eventSlug: 'dev-casa-brasil-stockholm',
    eventName: 'Festivais, markets, pracas e eventos privados em Stockholm',
    primaryCategory: 'snacks brasileiros / doces / acai',
    instagram: '@casabrasil.se',
    whatsapp: null,
    heroImageKey: 'casa-brasil/hero',
    logoImageKey: 'casa-brasil/logo',
    operatingDays: null,
    openingTime: null,
    closingTime: null,
  },
  catalog: {
    foodtruckSlug: 'casa-brasil',
    foodtruckName: 'Casa Brasil',
    eventSlug: 'dev-casa-brasil-stockholm',
    categories: [
      {
        slug: 'sobremesas',
        name: 'Sobremesas',
        sortOrder: 0,
        items: [
          {
            id: 'acai-bowl-tradicional',
            name: 'Acai Bowl Tradicional',
            description:
              'Acai cremoso servido com granola, banana e leite condensado opcional.',
            price: '89.00',
            currency: 'SEK',
            isAvailable: true,
            dailyStockRemaining: null,
            sortOrder: 0,
            imageKey: 'casa-brasil/acai-tradicional',
          },
          {
            id: 'acai-bowl-premium',
            name: 'Acai Bowl Premium',
            description:
              'Acai com morango, banana, leite em po, granola e cobertura extra.',
            price: '109.00',
            currency: 'SEK',
            isAvailable: true,
            dailyStockRemaining: null,
            sortOrder: 1,
            imageKey: 'casa-brasil/acai-premium',
          },
          {
            id: 'brigadeiro-box',
            name: 'Brigadeiro Box',
            description:
              'Caixa com brigadeiros tradicionais feitos com chocolate e granulado.',
            price: '69.00',
            currency: 'SEK',
            isAvailable: true,
            dailyStockRemaining: null,
            sortOrder: 2,
            imageKey: 'casa-brasil/brigadeiro-box',
          },
          {
            id: 'beijinho-box',
            name: 'Beijinho Box',
            description:
              'Docinho brasileiro de coco em porcao para compartilhar.',
            price: '69.00',
            currency: 'SEK',
            isAvailable: true,
            dailyStockRemaining: null,
            sortOrder: 3,
            imageKey: 'casa-brasil/beijinho-box',
          },
        ],
      },
      {
        slug: 'lanches',
        name: 'Lanches',
        sortOrder: 1,
        items: [
          {
            id: 'coxinha-de-frango',
            name: 'Coxinha de Frango',
            description:
              'Salgado brasileiro recheado com frango desfiado e massa macia.',
            price: '49.00',
            currency: 'SEK',
            isAvailable: true,
            dailyStockRemaining: null,
            sortOrder: 0,
            imageKey: 'casa-brasil/coxinha',
          },
          {
            id: 'pao-de-queijo',
            name: 'Pao de Queijo',
            description:
              'Porcao de pao de queijo assado, crocante por fora e macio por dentro.',
            price: '59.00',
            currency: 'SEK',
            isAvailable: true,
            dailyStockRemaining: null,
            sortOrder: 1,
            imageKey: 'casa-brasil/pao-de-queijo',
          },
          {
            id: 'pastel-de-queijo',
            name: 'Pastel de Queijo',
            description:
              'Pastel brasileiro frito com recheio cremoso de queijo.',
            price: '79.00',
            currency: 'SEK',
            isAvailable: true,
            dailyStockRemaining: null,
            sortOrder: 2,
            imageKey: 'casa-brasil/pastel-de-queijo',
          },
        ],
      },
      {
        slug: 'bebidas',
        name: 'Bebidas',
        sortOrder: 2,
        items: [
          {
            id: 'guarana-lata',
            name: 'Guarana Lata',
            description: 'Refrigerante brasileiro servido gelado.',
            price: '29.00',
            currency: 'SEK',
            isAvailable: true,
            dailyStockRemaining: null,
            sortOrder: 0,
            imageKey: 'casa-brasil/guarana',
          },
        ],
      },
    ],
  },
};

const formosaBubbleAndBites: DevelopmentFoodtruckRecord = {
  listItem: {
    slug: 'formosa-bubble-and-bites',
    name: 'Formosa Bubble & Bites',
    description:
      'Street food taiwanesa com bubble tea, snacks quentes e proposta jovem para eventos urbanos em Stockholm.',
    displayName: 'Formosa Bubble & Bites',
    acceptsOrders: true,
    capacityWindowMinutes: 10,
    maxOrdersPerWindow: 24,
    primaryCategory: 'taiwanese street food / bubble tea',
    instagram: '@formosabites.se',
    whatsapp: null,
    heroImageKey: 'formosa-bubble-and-bites/hero',
  },
  detail: {
    slug: 'formosa-bubble-and-bites',
    name: 'Formosa Bubble & Bites',
    description:
      'Operacao jovem e urbana de bubble tea e asian street food, pensada para pontos de alto fluxo, parques e eventos em Stockholm.',
    displayName: 'Formosa Bubble & Bites',
    acceptsOrders: true,
    capacityWindowMinutes: 10,
    maxOrdersPerWindow: 24,
    eventSlug: 'dev-formosa-stockholm',
    eventName: 'Pontos urbanos, parques e eventos em Stockholm',
    primaryCategory: 'taiwanese street food / bubble tea',
    instagram: '@formosabites.se',
    whatsapp: null,
    heroImageKey: 'formosa-bubble-and-bites/hero',
    logoImageKey: 'formosa-bubble-and-bites/logo',
    operatingDays: null,
    openingTime: null,
    closingTime: null,
  },
  catalog: {
    foodtruckSlug: 'formosa-bubble-and-bites',
    foodtruckName: 'Formosa Bubble & Bites',
    eventSlug: 'dev-formosa-stockholm',
    categories: [
      {
        slug: 'bebidas',
        name: 'Bebidas',
        sortOrder: 0,
        items: [
          {
            id: 'brown-sugar-bubble-tea',
            name: 'Brown Sugar Bubble Tea',
            description: 'Bubble tea com leite e xarope de acucar mascavo.',
            price: '69.00',
            currency: 'SEK',
            isAvailable: true,
            dailyStockRemaining: null,
            sortOrder: 0,
            imageKey: 'formosa-bubble-and-bites/brown-sugar-bubble-tea',
          },
          {
            id: 'taro-milk-tea',
            name: 'Taro Milk Tea',
            description: 'Cha com leite e taro, servido gelado.',
            price: '72.00',
            currency: 'SEK',
            isAvailable: true,
            dailyStockRemaining: null,
            sortOrder: 1,
            imageKey: 'formosa-bubble-and-bites/brown-sugar-bubble-tea',
          },
        ],
      },
      {
        slug: 'lanches',
        name: 'Lanches',
        sortOrder: 1,
        items: [
          {
            id: 'popcorn-chicken',
            name: 'Popcorn Chicken',
            description:
              'Frango crocante em pedacos no estilo street food taiwanes.',
            price: '95.00',
            currency: 'SEK',
            isAvailable: true,
            dailyStockRemaining: null,
            sortOrder: 0,
            imageKey: 'formosa-bubble-and-bites/popcorn-chicken',
          },
          {
            id: 'bao-de-frango',
            name: 'Bao de Frango',
            description: 'Pao bao macio com recheio de frango temperado.',
            price: '89.00',
            currency: 'SEK',
            isAvailable: true,
            dailyStockRemaining: null,
            sortOrder: 1,
            imageKey: 'formosa-bubble-and-bites/night-market-snack',
          },
        ],
      },
      {
        slug: 'pratos',
        name: 'Pratos',
        sortOrder: 2,
        items: [
          {
            id: 'taiwanese-rice-bowl',
            name: 'Taiwanese Rice Bowl',
            description:
              'Bowl de arroz com proteina marinada e toppings asiaticos.',
            price: '139.00',
            currency: 'SEK',
            isAvailable: true,
            dailyStockRemaining: null,
            sortOrder: 0,
            imageKey: 'formosa-bubble-and-bites/night-market-snack',
          },
        ],
      },
    ],
  },
};

const developmentFoodtrucks: DevelopmentFoodtruckRecord[] = [
  funkyChicken,
  soulisticFoodTruck,
  ceylonFoodTruck,
  fuegoDelSurGrill,
  casaBrasil,
  formosaBubbleAndBites,
];

export function listDevelopmentFoodtrucks() {
  return developmentFoodtrucks.map((record) => record.listItem);
}

export function getDevelopmentFoodtruckDetail(foodtruckSlug: string) {
  return developmentFoodtrucks.find(
    (record) => record.detail.slug === foodtruckSlug,
  )?.detail;
}

export function getDevelopmentFoodtruckCatalog(foodtruckSlug: string) {
  return developmentFoodtrucks.find(
    (record) => record.catalog.foodtruckSlug === foodtruckSlug,
  )?.catalog;
}
