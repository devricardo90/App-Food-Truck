import { Link } from 'expo-router';
import { Text, View } from 'react-native';

import { orderSummaries } from '../../../../src/mocks/orders';

export default function OrdersHistoryScreen() {
  return (
    <View className="flex-1 bg-sand px-6 pt-16">
      <Text className="text-xs font-semibold uppercase tracking-[2px] text-ember">
        Historico
      </Text>
      <Text className="mt-3 text-3xl font-bold text-ink">Pedidos recentes</Text>
      <Text className="mt-3 text-base leading-6 text-neutral-600">
        Fallback principal para o cliente acompanhar pedidos quando a
        notificacao nao resolver a jornada.
      </Text>

      <View className="mt-8 gap-4">
        {orderSummaries.map((order) => (
          <Link asChild href={`/(app)/orders/${order.id}`} key={order.id}>
            <Text className="rounded-[24px] border border-amber-950/10 bg-white px-5 py-5 text-base font-medium text-ink shadow-sm">
              Pedido {order.code}
              {'\n'}
              <Text className="text-sm font-normal text-neutral-500">
                {order.truckName} • {order.statusLabel}
              </Text>
            </Text>
          </Link>
        ))}
      </View>
    </View>
  );
}
