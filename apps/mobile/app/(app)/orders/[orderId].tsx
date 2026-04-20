import { useAuth } from '@clerk/clerk-expo';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { withClerkApiToken } from '../../../src/lib/clerk-api-token';
import { formatPrice } from '../../../src/lib/foodtrucks-api';
import { fetchOrderById } from '../../../src/lib/orders-api';
import {
  buildOrderTimeline,
  getOperationalOrderRefreshInterval,
  getOrderStatusTone,
  mapOrderStatusLabel,
} from '../../../src/lib/order-status';

export default function OrderDetailScreen() {
  const { getToken } = useAuth();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const orderQuery = useQuery({
    queryKey: ['order-detail', orderId],
    enabled: Boolean(orderId),
    queryFn: async () => {
      if (!orderId) {
        throw new Error('Nao foi possivel autenticar a consulta do pedido.');
      }

      return withClerkApiToken(getToken, (token) =>
        fetchOrderById(token, orderId),
      );
    },
    refetchInterval: (query) =>
      query.state.data
        ? getOperationalOrderRefreshInterval(query.state.data.status)
        : 15000,
    retry: false,
  });

  if (orderQuery.isPending) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-50 px-6">
        <Text className="text-lg font-semibold text-ink">
          Carregando pedido...
        </Text>
      </View>
    );
  }

  if (orderQuery.isError || !orderQuery.data) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-50 px-6">
        <Text className="text-lg font-semibold text-ink">
          Pedido nao encontrado
        </Text>
        <Text className="mt-3 text-center text-sm leading-6 text-neutral-500">
          {orderQuery.error instanceof Error
            ? orderQuery.error.message
            : 'O pedido solicitado nao foi encontrado para o usuario autenticado.'}
        </Text>
      </View>
    );
  }

  const order = orderQuery.data;
  const timeline = buildOrderTimeline(order.status);
  const statusTone = getOrderStatusTone(order.status);

  return (
    <ScrollView
      className="flex-1 bg-neutral-50"
      contentContainerClassName="px-6 pb-10 pt-16"
      showsVerticalScrollIndicator={false}
    >
      <Text className="text-xs font-semibold uppercase tracking-[2px] text-pine">
        Pedido
      </Text>
      <Text className="mt-3 text-3xl font-bold text-ink">
        {order.publicCode}
      </Text>
      <View
        className={`mt-6 rounded-lg border px-5 py-5 shadow-sm ${statusTone.panel}`}
      >
        <Text className="text-sm uppercase tracking-[1.5px] text-neutral-500">
          Status atual
        </Text>
        <Text className="mt-3 text-xl font-semibold text-ink">
          {mapOrderStatusLabel(order.status)}
        </Text>
        <Text className="mt-2 text-sm leading-6 text-neutral-600">
          Barraca: {order.eventTruck.foodtruckName}
        </Text>
        <Text className="mt-2 text-sm leading-6 text-neutral-600">
          A tela reconsulta automaticamente enquanto o pedido nao estiver em
          estado final.
        </Text>
      </View>

      <View className="mt-8 rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
        <Text className="text-sm uppercase tracking-[1.5px] text-neutral-500">
          Linha do tempo
        </Text>
        <View className="mt-4 gap-3">
          {timeline.map((step) => (
            <View className="flex-row items-center gap-3" key={step.label}>
              <View
                className={
                  step.done
                    ? 'h-2.5 w-2.5 rounded-full bg-pine'
                    : 'h-2.5 w-2.5 rounded-full bg-neutral-300'
                }
              />
              <Text
                className={
                  step.done
                    ? 'text-base text-neutral-800'
                    : 'text-base text-neutral-500'
                }
              >
                {step.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View className="mt-8 rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
        <Text className="text-sm uppercase tracking-[1.5px] text-neutral-500">
          Resumo
        </Text>
        <View className="mt-4 gap-3">
          {order.items.map((item) => (
            <View
              className="flex-row items-center justify-between"
              key={item.id}
            >
              <Text className="max-w-[70%] text-sm text-neutral-700">
                {item.quantity}x {item.itemName}
              </Text>
              <Text className="text-sm font-semibold text-neutral-800">
                {formatPrice(item.lineTotal, order.currency)}
              </Text>
            </View>
          ))}
        </View>
        <Text className="mt-6 text-xl font-bold text-ink">
          Total {formatPrice(order.totalAmount, order.currency)}
        </Text>
        <Text className="mt-2 text-sm text-neutral-500">
          Pagamento: {order.payment.status}
        </Text>
      </View>

      <View className="mt-8 gap-3">
        <Link asChild href="/(app)/(tabs)/orders">
          <Text className="rounded-lg border border-neutral-300 px-4 py-4 text-center text-sm font-semibold text-neutral-700">
            Voltar ao historico
          </Text>
        </Link>
      </View>
    </ScrollView>
  );
}
