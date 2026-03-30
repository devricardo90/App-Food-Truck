import { useState } from 'react';
import { useAuth } from '@clerk/clerk-expo';
import { useMutation } from '@tanstack/react-query';
import { Link, useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { formatPrice } from '../../src/lib/foodtrucks-api';
import {
  createPendingOrder,
  OrdersApiError,
} from '../../src/lib/orders-api';
import { useCart } from '../../src/providers/cart-provider';

export default function CheckoutScreen() {
  const router = useRouter();
  const { getToken } = useAuth();
  const { cart } = useCart();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const clerkJwtTemplate =
    process.env.EXPO_PUBLIC_CLERK_JWT_TEMPLATE?.trim() || undefined;

  const createOrderMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken(
        clerkJwtTemplate ? { template: clerkJwtTemplate } : undefined,
      );

      if (!token) {
        throw new Error(
          'A sessao ativa nao retornou bearer token para criar o pedido.',
        );
      }

      if (!cart.foodtruckSlug || cart.items.length === 0) {
        throw new Error('Adicione itens ao carrinho antes de iniciar o checkout.');
      }

      return createPendingOrder(token, {
        foodtruckSlug: cart.foodtruckSlug,
        items: cart.items.map((item) => ({
          menuItemId: item.id,
          quantity: item.quantity,
        })),
      });
    },
    onSuccess: (order) => {
      console.log('Mobile checkout create order success:', {
        orderId: order.id,
        publicCode: order.publicCode,
        status: order.status,
      });
      setErrorMessage(null);
      router.push({
        pathname: '/(app)/payment/pending',
        params: { orderId: order.id },
      });
    },
    onError: (error) => {
      const message =
        error instanceof OrdersApiError || error instanceof Error
          ? error.message
          : 'Falha ao criar o pedido pendente.';
      console.log('Mobile checkout create order error:', {
        message,
        status: error instanceof OrdersApiError ? error.status : null,
      });
      setErrorMessage(message);
    },
  });

  const hasItems = cart.items.length > 0;

  return (
    <ScrollView
      className="flex-1 bg-sand"
      contentContainerClassName="px-6 pb-10 pt-16"
      showsVerticalScrollIndicator={false}
    >
      <Text className="text-xs font-semibold uppercase tracking-[2px] text-ember">
        Checkout
      </Text>
      <Text className="mt-3 text-3xl font-bold text-ink">
        Confirmacao final do pedido
      </Text>
      <Text className="mt-3 text-base leading-6 text-neutral-600">
        Esta tela prepara o handoff para pagamento sem promover o pedido para
        confirmado por conta propria.
      </Text>

      <View className="mt-8 rounded-[28px] border border-amber-950/10 bg-white p-6 shadow-sm">
        {hasItems ? (
          <>
            <Text className="text-lg font-semibold text-ink">
              {cart.foodtruckName}
            </Text>
            <Text className="mt-2 text-sm text-neutral-500">
              Pedido criado como `pending_payment` ate a confirmacao oficial do
              backend.
            </Text>
            <View className="mt-6 gap-3">
              {cart.items.map((item) => (
                <View
                  className="flex-row items-center justify-between"
                  key={item.id}
                >
                  <Text className="max-w-[70%] text-sm text-neutral-700">
                    {item.quantity}x {item.name}
                  </Text>
                  <Text className="text-sm font-semibold text-neutral-800">
                    {formatPrice(
                      String(Number(item.price) * item.quantity),
                      item.currency,
                    )}
                  </Text>
                </View>
              ))}
            </View>
            <Text className="mt-8 text-xl font-bold text-ink">
              Total {formatPrice(String(cart.totalAmount), cart.currency ?? 'EUR')}
            </Text>
          </>
        ) : (
          <Text className="text-base text-neutral-700">
            O carrinho precisa ter itens antes do checkout.
          </Text>
        )}
      </View>

      {errorMessage ? (
        <View className="mt-6 rounded-[20px] border border-rose-200 bg-rose-50 px-4 py-4">
          <Text className="text-sm leading-6 text-rose-900">
            {errorMessage}
          </Text>
        </View>
      ) : null}

      <View className="mt-8 gap-3">
        <Pressable
          className={`rounded-full px-4 py-4 ${
            hasItems && !createOrderMutation.isPending ? 'bg-pine' : 'bg-stone-300'
          }`}
          disabled={!hasItems || createOrderMutation.isPending}
          onPress={() => {
            setErrorMessage(null);
            createOrderMutation.mutate();
          }}
        >
          <Text className="text-center text-sm font-semibold text-white">
            {createOrderMutation.isPending
              ? 'Criando pedido pendente...'
              : 'Iniciar pagamento'}
          </Text>
        </Pressable>
        <Link asChild href="/(app)/cart">
          <Text className="rounded-full border border-neutral-300 px-4 py-4 text-center text-sm font-semibold text-neutral-700">
            Voltar ao carrinho
          </Text>
        </Link>
      </View>
    </ScrollView>
  );
}
