import { Link, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

import { findOrderById } from '../../../src/mocks/orders';

export default function OrderDetailScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const order = findOrderById(orderId);

  if (!order) {
    return (
      <View className="flex-1 items-center justify-center bg-sand px-6">
        <Text className="text-lg font-semibold text-ink">
          Pedido nao encontrado
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-sand px-6 pt-16">
      <Text className="text-xs font-semibold uppercase tracking-[2px] text-ember">
        Pedido
      </Text>
      <Text className="mt-3 text-3xl font-bold text-ink">{order.code}</Text>
      <Text className="mt-3 text-base leading-6 text-neutral-600">
        Status atual: {order.statusLabel}
      </Text>

      <View className="mt-8 rounded-[28px] border border-amber-950/10 bg-white p-6 shadow-sm">
        <Text className="text-sm uppercase tracking-[1.5px] text-neutral-500">
          Linha do tempo
        </Text>
        <View className="mt-4 gap-3">
          {order.timeline.map((step) => (
            <Text className="text-base text-neutral-700" key={step}>
              • {step}
            </Text>
          ))}
        </View>
      </View>

      <View className="mt-8 gap-3">
        <Link asChild href="/(app)/(tabs)/orders">
          <Text className="rounded-full border border-neutral-300 px-4 py-4 text-center text-sm font-semibold text-neutral-700">
            Voltar ao historico
          </Text>
        </Link>
      </View>
    </View>
  );
}
