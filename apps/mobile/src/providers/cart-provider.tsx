import type { PropsWithChildren } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

type CartLineInput = {
  id: string;
  name: string;
  price: string;
  currency: string;
};

type CartAddItemInput = CartLineInput & {
  foodtruckSlug: string;
  foodtruckName: string;
};

type CartLine = CartLineInput & {
  quantity: number;
};

type CartState = {
  foodtruckSlug: string | null;
  foodtruckName: string | null;
  items: CartLine[];
  totalItems: number;
  totalAmount: number;
  currency: string | null;
  note: string | null;
};

type CartContextValue = {
  cart: CartState;
  addItem: (input: CartAddItemInput) => void;
  incrementItem: (itemId: string) => void;
  decrementItem: (itemId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function buildEmptyCart(): CartState {
  return {
    foodtruckSlug: null,
    foodtruckName: null,
    items: [],
    totalItems: 0,
    totalAmount: 0,
    currency: null,
    note: null,
  };
}

function buildCartState(
  foodtruckSlug: string | null,
  foodtruckName: string | null,
  items: CartLine[],
  note: string | null,
): CartState {
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalAmount = items.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0,
  );

  return {
    foodtruckSlug,
    foodtruckName,
    items,
    totalItems,
    totalAmount,
    currency: items[0]?.currency ?? null,
    note,
  };
}

export function CartProvider({ children }: PropsWithChildren) {
  const [cart, setCart] = useState<CartState>(() => buildEmptyCart());

  const addItem = useCallback((input: CartAddItemInput) => {
    setCart((currentCart) => {
      const isSameTruck =
        !currentCart.foodtruckSlug ||
        currentCart.foodtruckSlug === input.foodtruckSlug;
      const currentItems = isSameTruck ? currentCart.items : [];
      const existingItem = currentItems.find((item) => item.id === input.id);

      const nextItems = existingItem
        ? currentItems.map((item) =>
            item.id === input.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          )
        : [
            ...currentItems,
            {
              id: input.id,
              name: input.name,
              price: input.price,
              currency: input.currency,
              quantity: 1,
            },
          ];

      return buildCartState(
        input.foodtruckSlug,
        input.foodtruckName,
        nextItems,
        isSameTruck
          ? null
          : `Carrinho reiniciado para ${input.foodtruckName}. No MVP, o pedido aceita uma barraca por vez.`,
      );
    });
  }, []);

  const incrementItem = useCallback((itemId: string) => {
    setCart((currentCart) =>
      buildCartState(
        currentCart.foodtruckSlug,
        currentCart.foodtruckName,
        currentCart.items.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item,
        ),
        null,
      ),
    );
  }, []);

  const decrementItem = useCallback((itemId: string) => {
    setCart((currentCart) => {
      const nextItems = currentCart.items
        .map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0);

      if (nextItems.length === 0) {
        return buildEmptyCart();
      }

      return buildCartState(
        currentCart.foodtruckSlug,
        currentCart.foodtruckName,
        nextItems,
        null,
      );
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart(buildEmptyCart());
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      addItem,
      incrementItem,
      decrementItem,
      clearCart,
    }),
    [addItem, cart, clearCart, decrementItem, incrementItem],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within CartProvider.');
  }

  return context;
}
