import { useQuery } from '@tanstack/react-query';
import { Link, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

import {
  formatPrice,
  getFoodtruckCatalog,
} from '../../../../../src/lib/foodtrucks-api';

export default function MenuScreen() {
  const { truckId } = useLocalSearchParams<{ truckId: string }>();
  const catalogQuery = useQuery({
    queryKey: ['foodtruck-catalog', truckId],
    queryFn: async () => getFoodtruckCatalog(truckId),
    enabled: Boolean(truckId),
  });

  if (catalogQuery.isPending) {
    return (
      <View className="flex-1 items-center justify-center bg-sand px-6">
        <Text className="text-lg font-semibold text-ink">
          Carregando cardapio...
        </Text>
      </View>
    );
  }

  if (catalogQuery.isError || !catalogQuery.data) {
    return (
      <View className="flex-1 items-center justify-center bg-sand px-6">
        <Text className="text-lg font-semibold text-ink">
          Cardapio indisponivel
        </Text>
        <Text className="mt-3 text-center text-sm leading-6 text-neutral-500">
          {catalogQuery.isError
            ? catalogQuery.error.message
            : 'A API nao retornou o catalogo esperado.'}
        </Text>
      </View>
    );
  }

  const catalog = catalogQuery.data;

  return (
    <View className="flex-1 bg-sand px-6 pt-16">
      <Text className="text-xs font-semibold uppercase tracking-[2px] text-ember">
        Cardapio
      </Text>
      <Text className="mt-3 text-3xl font-bold text-ink">
        {catalog.foodtruckName}
      </Text>
      <Text className="mt-3 text-base leading-6 text-neutral-600">
        Itens disponiveis para o pedido do cliente.
      </Text>

      <View className="mt-8 gap-4">
        {catalog.categories.map((category) => (
          <View
            className="rounded-[24px] border border-amber-950/10 bg-white px-5 py-5 shadow-sm"
            key={category.slug}
          >
            <Text className="text-xs font-semibold uppercase tracking-[2px] text-ember">
              {category.name}
            </Text>
            <View className="mt-4 gap-4">
              {category.items.map((item) => (
                <Link
                  asChild
                  href={`/(app)/trucks/${catalog.foodtruckSlug}/menu/${item.id}`}
                  key={item.id}
                >
                  <Text className="text-base font-medium text-ink">
                    {item.name}
                    {'\n'}
                    <Text className="text-sm font-normal text-neutral-500">
                      {item.description ?? 'Sem descricao'}
                      {' | '}
                      {formatPrice(item.price)}
                      {' | '}
                      {item.isAvailable ? 'Disponivel' : 'Pausado'}
                    </Text>
                  </Text>
                </Link>
              ))}
            </View>
          </View>
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
