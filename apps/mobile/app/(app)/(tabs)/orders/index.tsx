import { useAuth } from '@clerk/clerk-expo';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { formatPrice } from '../../../../src/lib/foodtrucks-api';
import { fetchOrders } from '../../../../src/lib/orders-api';
import {
  getOrderStatusTone,
  mapOrderStatusLabel,
} from '../../../../src/lib/order-status';

export default function OrdersHistoryScreen() {
  const { getToken } = useAuth();
  const clerkJwtTemplate =
    process.env.EXPO_PUBLIC_CLERK_JWT_TEMPLATE?.trim() || undefined;
  const ordersQuery = useQuery({
    queryKey: ['orders-history'],
    queryFn: async () => {
      const token = await getToken(
        clerkJwtTemplate ? { template: clerkJwtTemplate } : undefined,
      );

      if (!token) {
        throw new Error('Nao foi possivel autenticar a consulta dos pedidos.');
      }

      return fetchOrders(token);
    },
    refetchInterval: 15000,
    retry: false,
  });

  return (
    <ScrollView
      className="flex-1 bg-sand"
      contentContainerClassName="px-6 pb-10 pt-16"
      showsVerticalScrollIndicator={false}
    >
      <Text className="text-xs font-semibold uppercase tracking-[2px] text-ember">
        Historico
      </Text>
      <Text className="mt-3 text-3xl font-bold text-ink">Pedidos recentes</Text>
      <Text className="mt-3 text-base leading-6 text-neutral-600">
        Fallback principal para o cliente acompanhar pedidos quando a
        notificacao nao resolver a jornada.
      </Text>
      <Text className="mt-2 text-sm text-neutral-500">
        A tela reconsulta o status real periodicamente enquanto houver pedidos
        ativos.
      </Text>

      <View className="mt-8 gap-4">
        {ordersQuery.isPending ? (
          <Text className="rounded-[24px] border border-amber-950/10 bg-white px-5 py-5 text-sm leading-6 text-neutral-500 shadow-sm">
            Carregando pedidos do usuario autenticado...
          </Text>
        ) : ordersQuery.isError ? (
          <Text className="rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-5 text-sm leading-6 text-rose-900 shadow-sm">
            {ordersQuery.error instanceof Error
              ? ordersQuery.error.message
              : 'Falha ao consultar o historico de pedidos.'}
          </Text>
        ) : ordersQuery.data.length === 0 ? (
          <Text className="rounded-[24px] border border-amber-950/10 bg-white px-5 py-5 text-sm leading-6 text-neutral-500 shadow-sm">
            Nenhum pedido foi criado ainda para este usuario.
          </Text>
        ) : (
          ordersQuery.data.map((order) => (
            <Link asChild href={`/(app)/orders/${order.id}`} key={order.id}>
              <View className="rounded-[24px] border border-amber-950/10 bg-white px-5 py-5 shadow-sm">
                <View className="flex-row items-start justify-between gap-3">
                  <View className="flex-1">
                    <Text className="text-base font-medium text-ink">
                      Pedido {order.publicCode}
                    </Text>
                    <Text className="mt-2 text-sm font-normal text-neutral-500">
                      {order.eventTruck.foodtruckName}
                    </Text>
                    <Text className="mt-2 text-sm font-normal text-neutral-500">
                      {formatPrice(order.totalAmount, order.currency)}
                    </Text>
                  </View>
                  <Text
                    className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[1px] ${getOrderStatusTone(order.status).badge}`}
                  >
                    {mapOrderStatusLabel(order.status)}
                  </Text>
                </View>
              </View>
            </Link>
          ))
        )}
      </View>
    </ScrollView>
  );
}
