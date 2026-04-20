import { useQuery } from '@tanstack/react-query';
import { Link, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';

import { resolveDevFoodtruckImage } from '../../../../../src/lib/dev-foodtruck-media';
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

  useEffect(() => {
    console.log('Mobile catalog route:', {
      truckId: truckId ?? null,
    });
  }, [truckId]);

  useEffect(() => {
    if (catalogQuery.isPending) {
      console.log('Mobile catalog loading:', {
        truckId: truckId ?? null,
      });
      return;
    }

    if (catalogQuery.isError) {
      console.log('Mobile catalog error:', {
        truckId: truckId ?? null,
        message: catalogQuery.error.message,
      });
      return;
    }

    if (catalogQuery.data) {
      console.log('Mobile catalog success:', {
        truckId: truckId ?? null,
        foodtruckSlug: catalogQuery.data.foodtruckSlug,
        categories: catalogQuery.data.categories.length,
      });
    }
  }, [
    truckId,
    catalogQuery.data,
    catalogQuery.error,
    catalogQuery.isError,
    catalogQuery.isPending,
  ]);

  if (catalogQuery.isPending) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-50 px-6">
        <Text className="text-lg font-semibold text-ink">
          Carregando cardapio...
        </Text>
        <Text className="mt-3 text-center text-sm leading-6 text-neutral-500">
          Consultando itens disponiveis para pedido no evento ativo.
        </Text>
      </View>
    );
  }

  if (catalogQuery.isError || !catalogQuery.data) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-50 px-6">
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
    <ScrollView
      className="flex-1 bg-neutral-50"
      contentContainerClassName="px-6 pb-10 pt-16"
      showsVerticalScrollIndicator={false}
    >
      <Text className="text-xs font-semibold uppercase tracking-[2px] text-pine">
        Cardapio
      </Text>
      <Text className="mt-3 text-3xl font-bold text-ink">
        {catalog.foodtruckName}
      </Text>
      <Text className="mt-3 text-base leading-6 text-neutral-600">
        Itens disponiveis para montar o pedido. Cada item leva ao detalhe e ao
        carrinho do fluxo validado.
      </Text>

      <View className="mt-8 gap-4">
        {catalog.categories.map((category) => (
          <View
            className="border-t border-neutral-200 pt-5"
            key={category.slug}
          >
            <Text className="text-xs font-semibold uppercase tracking-[2px] text-pine">
              {category.name}
            </Text>
            <View className="mt-4 gap-4">
              {category.items.map((item) => {
                const itemImage = resolveDevFoodtruckImage(item.imageKey);

                return (
                  <Link
                    asChild
                    href={`/(app)/trucks/${catalog.foodtruckSlug}/menu/${item.id}`}
                    key={item.id}
                  >
                    <Pressable
                      className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm"
                      onPress={() => {
                        console.log('Mobile catalog item pressed:', {
                          truckSlug: catalog.foodtruckSlug,
                          itemId: item.id,
                          route: `/(app)/trucks/${catalog.foodtruckSlug}/menu/${item.id}`,
                        });
                      }}
                    >
                      <Text className="text-base font-semibold text-ink">
                        {item.name}
                      </Text>
                      <Text className="mt-2 text-sm leading-6 text-neutral-600">
                        {item.description ?? 'Sem descricao'}
                      </Text>
                      <Text className="mt-3 text-sm font-semibold text-neutral-800">
                        {formatPrice(item.price, item.currency)}
                        {' - '}
                        {item.isAvailable ? 'Disponivel' : 'Pausado'}
                      </Text>
                      {itemImage ? (
                        <Image
                          className="mt-4 h-40 w-full rounded-lg"
                          resizeMode="cover"
                          source={itemImage}
                        />
                      ) : null}
                    </Pressable>
                  </Link>
                );
              })}
            </View>
          </View>
        ))}
      </View>

      <View className="mt-8">
        <Link asChild href="/(app)/cart">
          <Pressable className="rounded-lg bg-pine px-4 py-4">
            <Text className="text-center text-sm font-semibold text-white">
              Ir para carrinho
            </Text>
          </Pressable>
        </Link>
      </View>
    </ScrollView>
  );
}
