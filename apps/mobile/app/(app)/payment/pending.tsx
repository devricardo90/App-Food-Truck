import { useAuth } from '@clerk/clerk-expo';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { formatPrice } from '../../../src/lib/foodtrucks-api';
import { fetchOrderById } from '../../../src/lib/orders-api';
import {
  getOperationalOrderRefreshInterval,
  mapOrderStatusLabel,
} from '../../../src/lib/order-status';

export default function PaymentPendingScreen() {
  const { getToken } = useAuth();
  const { orderId } = useLocalSearchParams<{ orderId?: string }>();
  const clerkJwtTemplate =
    process.env.EXPO_PUBLIC_CLERK_JWT_TEMPLATE?.trim() || undefined;

  const orderQuery = useQuery({
    queryKey: ['checkout-order', orderId],
    enabled: Boolean(orderId),
    queryFn: async () => {
      const token = await getToken(
        clerkJwtTemplate ? { template: clerkJwtTemplate } : undefined,
      );

      if (!token || !orderId) {
        throw new Error('Nao foi possivel autenticar a reconsulta do pedido.');
      }

      return fetchOrderById(token, orderId);
    },
    refetchInterval: (query) =>
      query.state.data
        ? getOperationalOrderRefreshInterval(query.state.data.status)
        : 15000,
    retry: false,
  });

  return (
    <ScrollView
      className="flex-1 bg-sand"
      contentContainerClassName="px-6 pb-10 pt-16"
      showsVerticalScrollIndicator={false}
    >
      <Text className="text-xs font-semibold uppercase tracking-[2px] text-ember">
        Pagamento
      </Text>
      <Text className="mt-3 text-3xl font-bold text-ink">
        Aguardando confirmacao oficial
      </Text>
      <Text className="mt-3 text-base leading-6 text-neutral-600">
        O frontend permanece em estado intermediario ate o backend confirmar o
        pagamento.
      </Text>

      <View className="mt-8 rounded-[28px] border border-amber-950/10 bg-white p-6 shadow-sm">
        {!orderId ? (
          <Text className="text-sm leading-6 text-neutral-600">
            Nenhum pedido real foi informado para esta etapa.
          </Text>
        ) : orderQuery.isPending ? (
          <Text className="text-sm leading-6 text-neutral-600">
            Recarregando o pedido criado no checkout...
          </Text>
        ) : orderQuery.isError ? (
          <Text className="text-sm leading-6 text-rose-900">
            {orderQuery.error instanceof Error
              ? orderQuery.error.message
              : 'Falha ao reconsultar o pedido pendente.'}
          </Text>
        ) : orderQuery.data ? (
          <>
            <Text className="text-lg font-semibold text-ink">
              Pedido {orderQuery.data.publicCode}
            </Text>
            <Text className="mt-2 text-sm text-neutral-500">
              Status atual: {mapOrderStatusLabel(orderQuery.data.status)}
            </Text>
            <Text className="mt-2 text-sm text-neutral-500">
              Barraca: {orderQuery.data.eventTruck.foodtruckName}
            </Text>
            <Text className="mt-2 text-sm text-neutral-500">
              A tela reconsulta automaticamente enquanto o pedido segue ativo.
            </Text>
            <Text className="mt-6 text-xl font-bold text-ink">
              Total{' '}
              {formatPrice(
                orderQuery.data.totalAmount,
                orderQuery.data.currency,
              )}
            </Text>
            <Text className="mt-2 text-sm text-neutral-500">
              Payment provider: {orderQuery.data.payment.provider} | status:{' '}
              {orderQuery.data.payment.status}
            </Text>
          </>
        ) : null}
      </View>

      <View className="mt-8 gap-3">
        <Link
          asChild
          href={
            orderId ? `/(app)/orders/${orderId}` : '/(app)/(tabs)/orders'
          }
        >
          <Text className="rounded-full bg-pine px-4 py-4 text-center text-sm font-semibold text-white">
            Reconsultar pedido
          </Text>
        </Link>
        <Link asChild href="/(app)/cart">
          <Text className="rounded-full border border-neutral-300 px-4 py-4 text-center text-sm font-semibold text-neutral-700">
            Voltar ao carrinho
          </Text>
        </Link>
      </View>
    </ScrollView>
  );
}
