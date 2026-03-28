import { useQuery } from '@tanstack/react-query';
import { Link, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

import {
  formatPrice,
  getFoodtruckCatalog,
} from '../../../../../src/lib/foodtrucks-api';

export default function MenuItemDetailScreen() {
  const { truckId, itemId } = useLocalSearchParams<{
    truckId: string;
    itemId: string;
  }>();
  const catalogQuery = useQuery({
    queryKey: ['foodtruck-catalog', truckId],
    queryFn: async () => getFoodtruckCatalog(truckId),
    enabled: Boolean(truckId),
  });
  const item = catalogQuery.data?.categories
    .flatMap((category) => category.items)
    .find((entry) => entry.id === itemId);

  if (catalogQuery.isPending) {
    return (
      <View className="flex-1 items-center justify-center bg-sand px-6">
        <Text className="text-lg font-semibold text-ink">
          Carregando item...
        </Text>
      </View>
    );
  }

  if (catalogQuery.isError || !catalogQuery.data || !item) {
    return (
      <View className="flex-1 items-center justify-center bg-sand px-6">
        <Text className="text-lg font-semibold text-ink">
          Item indisponivel
        </Text>
        <Text className="mt-3 text-center text-sm leading-6 text-neutral-500">
          {catalogQuery.isError
            ? catalogQuery.error.message
            : 'O item solicitado nao foi encontrado no catalogo da barraca.'}
        </Text>
      </View>
    );
  }

  const catalog = catalogQuery.data;

  return (
    <View className="flex-1 bg-sand px-6 pt-16">
      <Text className="text-xs font-semibold uppercase tracking-[2px] text-ember">
        Item
      </Text>
      <Text className="mt-3 text-3xl font-bold text-ink">{item.name}</Text>
      <Text className="mt-3 text-base leading-6 text-neutral-600">
        {item.description ?? 'Sem descricao cadastrada para este item.'}
      </Text>

      <View className="mt-8 rounded-[28px] border border-amber-950/10 bg-white p-6 shadow-sm">
        <Text className="text-sm uppercase tracking-[1.5px] text-neutral-500">
          Preco
        </Text>
        <Text className="mt-2 text-xl font-semibold text-ink">
          {formatPrice(item.price)}
        </Text>
        <Text className="mt-4 text-sm text-neutral-500">
          Barraca ativa: {catalog.foodtruckName}
        </Text>
      </View>

      <View className="mt-8 gap-3">
        <Link asChild href="/(app)/cart">
          <Text className="rounded-full bg-pine px-4 py-4 text-center text-sm font-semibold text-white">
            Adicionar ao carrinho
          </Text>
        </Link>
        <Link asChild href={`/(app)/trucks/${catalog.foodtruckSlug}/menu`}>
          <Text className="rounded-full border border-neutral-300 px-4 py-4 text-center text-sm font-semibold text-neutral-700">
            Voltar ao cardapio
          </Text>
        </Link>
      </View>
    </View>
  );
}
