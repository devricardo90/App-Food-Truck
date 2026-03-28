import { Link, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

import {
  findMenuItemsByTruck,
  findTruckById,
} from '../../../../../src/mocks/trucks';

export default function MenuScreen() {
  const { truckId } = useLocalSearchParams<{ truckId: string }>();
  const truck = findTruckById(truckId);
  const items = findMenuItemsByTruck(truckId);

  if (!truck) {
    return (
      <View className="flex-1 items-center justify-center bg-sand px-6">
        <Text className="text-lg font-semibold text-ink">
          Cardapio indisponivel
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-sand px-6 pt-16">
      <Text className="text-xs font-semibold uppercase tracking-[2px] text-ember">
        Cardapio
      </Text>
      <Text className="mt-3 text-3xl font-bold text-ink">{truck.name}</Text>
      <Text className="mt-3 text-base leading-6 text-neutral-600">
        Itens disponiveis para o pedido do cliente.
      </Text>

      <View className="mt-8 gap-4">
        {items.map((item) => (
          <Link
            asChild
            href={`/(app)/trucks/${truck.id}/menu/${item.id}`}
            key={item.id}
          >
            <Text className="rounded-[24px] border border-amber-950/10 bg-white px-5 py-5 text-base font-medium text-ink shadow-sm">
              {item.name}
              {'\n'}
              <Text className="text-sm font-normal text-neutral-500">
                {item.description} • {item.priceLabel}
              </Text>
            </Text>
          </Link>
        ))}
      </View>

      <View className="mt-8">
        <Link asChild href="/(app)/cart">
          <Text className="rounded-full bg-neutral-950 px-4 py-4 text-center text-sm font-semibold text-white">
            Ir para carrinho
          </Text>
        </Link>
      </View>
    </View>
  );
}
