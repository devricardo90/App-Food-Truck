import { Link } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { formatPrice } from '../../src/lib/foodtrucks-api';
import { useCart } from '../../src/providers/cart-provider';

export default function CartScreen() {
  const { cart, clearCart, decrementItem, incrementItem } = useCart();
  const hasItems = cart.items.length > 0;

  return (
    <ScrollView
      className="flex-1 bg-sand"
      contentContainerClassName="px-6 pb-10 pt-16"
      showsVerticalScrollIndicator={false}
    >
      <Text className="text-xs font-semibold uppercase tracking-[2px] text-ember">
        Carrinho
      </Text>
      <Text className="mt-3 text-3xl font-bold text-ink">
        Revisao antes do checkout
      </Text>

      {hasItems ? (
        <View className="mt-8 rounded-[28px] border border-amber-950/10 bg-white p-6 shadow-sm">
          <Text className="text-lg font-semibold text-ink">
            {cart.foodtruckName}
          </Text>
          <Text className="mt-2 text-sm text-neutral-500">
            Um carrinho por barraca durante o MVP.
          </Text>
          {cart.note ? (
            <View className="mt-4 rounded-[20px] border border-amber-200 bg-amber-50 px-4 py-4">
              <Text className="text-sm leading-6 text-amber-950">
                {cart.note}
              </Text>
            </View>
          ) : null}

          <View className="mt-6 gap-4">
            {cart.items.map((item) => (
              <View
                className="rounded-[20px] border border-stone-200 bg-stone-50 p-4"
                key={item.id}
              >
                <Text className="text-base font-medium text-neutral-800">
                  {item.name}
                </Text>
                <Text className="mt-2 text-sm text-neutral-500">
                  {formatPrice(item.price, item.currency)} por unidade
                </Text>
                <View className="mt-4 flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    <Pressable
                      className="rounded-full border border-neutral-300 px-4 py-2"
                      onPress={() => decrementItem(item.id)}
                    >
                      <Text className="text-sm font-semibold text-neutral-700">
                        -1
                      </Text>
                    </Pressable>
                    <Text className="text-sm font-semibold text-neutral-700">
                      {item.quantity}x
                    </Text>
                    <Pressable
                      className="rounded-full border border-neutral-300 px-4 py-2"
                      onPress={() => incrementItem(item.id)}
                    >
                      <Text className="text-sm font-semibold text-neutral-700">
                        +1
                      </Text>
                    </Pressable>
                  </View>
                  <Text className="text-sm font-semibold text-neutral-800">
                    {formatPrice(
                      String(Number(item.price) * item.quantity),
                      item.currency,
                    )}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <Text className="mt-8 text-sm uppercase tracking-[1.5px] text-neutral-500">
            {cart.totalItems} item(ns)
          </Text>
          <Text className="mt-2 text-xl font-bold text-ink">
            Total {formatPrice(String(cart.totalAmount), cart.currency ?? 'EUR')}
          </Text>
        </View>
      ) : (
        <View className="mt-8 rounded-[28px] border border-amber-950/10 bg-white p-6 shadow-sm">
          <Text className="text-lg font-semibold text-ink">
            Seu carrinho esta vazio
          </Text>
          <Text className="mt-3 text-sm leading-6 text-neutral-500">
            Adicione um item a partir do catalogo de uma barraca para iniciar o
            pedido.
          </Text>
        </View>
      )}

      <View className="mt-8 gap-3">
        {hasItems ? (
          <Link asChild href="/(app)/checkout">
            <Text className="rounded-full bg-pine px-4 py-4 text-center text-sm font-semibold text-white">
              Seguir para checkout
            </Text>
          </Link>
        ) : null}
        {hasItems ? (
          <Pressable
            className="rounded-full border border-neutral-300 px-4 py-4"
            onPress={clearCart}
          >
            <Text className="text-center text-sm font-semibold text-neutral-700">
              Limpar carrinho
            </Text>
          </Pressable>
        ) : null}
        <Link asChild href="/(app)/(tabs)/trucks">
          <Text className="rounded-full border border-neutral-300 px-4 py-4 text-center text-sm font-semibold text-neutral-700">
            Voltar para barracas
          </Text>
        </Link>
      </View>
    </ScrollView>
  );
}
