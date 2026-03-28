import { Link, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

import { findTruckById } from '../../../../src/mocks/trucks';

export default function TruckDetailScreen() {
  const { truckId } = useLocalSearchParams<{ truckId: string }>();
  const truck = findTruckById(truckId);

  if (!truck) {
    return (
      <View className="flex-1 items-center justify-center bg-sand px-6">
        <Text className="text-lg font-semibold text-ink">
          Barraca nao encontrada
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-sand px-6 pt-16">
      <Text className="text-xs font-semibold uppercase tracking-[2px] text-ember">
        Barraca
      </Text>
      <Text className="mt-3 text-3xl font-bold text-ink">{truck.name}</Text>
      <Text className="mt-3 text-base leading-6 text-neutral-600">
        {truck.description}
      </Text>

      <View className="mt-8 rounded-[28px] border border-amber-950/10 bg-white p-6 shadow-sm">
        <Text className="text-sm uppercase tracking-[1.5px] text-neutral-500">
          Status
        </Text>
        <Text className="mt-2 text-xl font-semibold text-ink">
          {truck.status}
        </Text>
        <Text className="mt-4 text-sm text-neutral-500">
          Categoria: {truck.category}
        </Text>
      </View>

      <View className="mt-8 gap-3">
        <Link asChild href={`/(app)/trucks/${truck.id}/menu`}>
          <Text className="rounded-full bg-pine px-4 py-4 text-center text-sm font-semibold text-white">
            Abrir cardapio
          </Text>
        </Link>
        <Link asChild href="/(app)/(tabs)/trucks">
          <Text className="rounded-full border border-neutral-300 px-4 py-4 text-center text-sm font-semibold text-neutral-700">
            Voltar para barracas
          </Text>
        </Link>
      </View>
    </View>
  );
}
