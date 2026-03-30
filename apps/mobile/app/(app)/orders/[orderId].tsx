import { useAuth } from '@clerk/clerk-expo';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { formatPrice } from '../../../src/lib/foodtrucks-api';
import { fetchOrderById } from '../../../src/lib/orders-api';

function mapOrderStatusLabel(status: string) {
  switch (status) {
    case 'pending_payment':
      return 'Aguardando confirmacao de pagamento';
    case 'new':
      return 'Pedido confirmado';
    case 'in_progress':
      return 'Em preparo';
    case 'ready':
      return 'Pronto para retirada';
    case 'completed':
      return 'Concluido';
    case 'cancelled':
      return 'Cancelado';
    default:
      return status;
  }
}

function buildOrderTimeline(status: string) {
  const steps = ['Checkout criado'];

  if (status !== 'pending_payment') {
    steps.push('Pagamento confirmado');
  }

  if (status === 'in_progress' || status === 'ready' || status === 'completed') {
    steps.push('Pedido em preparo');
  }

  if (status === 'ready' || status === 'completed') {
    steps.push('Pedido pronto');
  }

  if (status === 'completed') {
    steps.push('Pedido concluido');
  }

  if (status === 'cancelled') {
    steps.push('Pedido cancelado');
  }

  return steps;
}

export default function OrderDetailScreen() {
  const { getToken } = useAuth();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const clerkJwtTemplate =
    process.env.EXPO_PUBLIC_CLERK_JWT_TEMPLATE?.trim() || undefined;
  const orderQuery = useQuery({
    queryKey: ['order-detail', orderId],
    enabled: Boolean(orderId),
    queryFn: async () => {
      const token = await getToken(
        clerkJwtTemplate ? { template: clerkJwtTemplate } : undefined,
      );

      if (!token || !orderId) {
        throw new Error('Nao foi possivel autenticar a consulta do pedido.');
      }

      return fetchOrderById(token, orderId);
    },
    retry: false,
  });

  if (orderQuery.isPending) {
    return (
      <View className="flex-1 items-center justify-center bg-sand px-6">
        <Text className="text-lg font-semibold text-ink">
          Carregando pedido...
        </Text>
      </View>
    );
  }

  if (orderQuery.isError || !orderQuery.data) {
    return (
      <View className="flex-1 items-center justify-center bg-sand px-6">
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

  return (
    <ScrollView
      className="flex-1 bg-sand"
      contentContainerClassName="px-6 pb-10 pt-16"
      showsVerticalScrollIndicator={false}
    >
      <Text className="text-xs font-semibold uppercase tracking-[2px] text-ember">
        Pedido
      </Text>
      <Text className="mt-3 text-3xl font-bold text-ink">
        {order.publicCode}
      </Text>
      <Text className="mt-3 text-base leading-6 text-neutral-600">
        Status atual: {mapOrderStatusLabel(order.status)}
      </Text>
      <Text className="mt-2 text-sm text-neutral-500">
        Barraca: {order.eventTruck.foodtruckName}
      </Text>

      <View className="mt-8 rounded-[28px] border border-amber-950/10 bg-white p-6 shadow-sm">
        <Text className="text-sm uppercase tracking-[1.5px] text-neutral-500">
          Linha do tempo
        </Text>
        <View className="mt-4 gap-3">
          {timeline.map((step) => (
            <Text className="text-base text-neutral-700" key={step}>
              - {step}
            </Text>
          ))}
        </View>
      </View>

      <View className="mt-8 rounded-[28px] border border-amber-950/10 bg-white p-6 shadow-sm">
        <Text className="text-sm uppercase tracking-[1.5px] text-neutral-500">
          Resumo
        </Text>
        <View className="mt-4 gap-3">
          {order.items.map((item) => (
            <View className="flex-row items-center justify-between" key={item.id}>
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
          Payment status: {order.payment.status}
        </Text>
      </View>

      <View className="mt-8 gap-3">
        <Link asChild href="/(app)/(tabs)/orders">
          <Text className="rounded-full border border-neutral-300 px-4 py-4 text-center text-sm font-semibold text-neutral-700">
            Voltar ao historico
          </Text>
        </Link>
      </View>
    </ScrollView>
  );
}
