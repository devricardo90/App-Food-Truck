import { useQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { useEffect } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';

import { resolveDevFoodtruckImage } from '../../../../src/lib/dev-foodtruck-media';
import { listFoodtrucks } from '../../../../src/lib/foodtrucks-api';

export default function TrucksHomeScreen() {
  const foodtrucksQuery = useQuery({
    queryKey: ['foodtrucks'],
    queryFn: listFoodtrucks,
  });

  useEffect(() => {
    console.log('Mobile trucks list state:', {
      isPending: foodtrucksQuery.isPending,
      isError: foodtrucksQuery.isError,
      count: foodtrucksQuery.data?.length ?? 0,
    });
  }, [
    foodtrucksQuery.data?.length,
    foodtrucksQuery.isError,
    foodtrucksQuery.isPending,
  ]);

  return (
    <ScrollView
      className="flex-1 bg-neutral-50"
      contentContainerClassName="px-6 pb-10 pt-16"
      showsVerticalScrollIndicator={false}
    >
      <Text className="text-xs font-semibold uppercase tracking-[2px] text-pine">
        Evento ativo
      </Text>
      <Text className="mt-3 text-3xl font-bold text-ink">
        Barracas abertas no evento
      </Text>
      <Text className="mt-3 text-base leading-6 text-neutral-600">
        Escolha uma barraca, veja o cardapio real e avance para o pedido sem
        sair do fluxo validado em staging.
      </Text>

      <View className="mt-6 flex-row gap-3">
        <View className="flex-1 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
          <Text className="text-xs font-semibold uppercase tracking-[1.5px] text-emerald-800">
            Staging
          </Text>
          <Text className="mt-1 text-sm text-emerald-900">
            API remota validada
          </Text>
        </View>
        <View className="flex-1 rounded-lg border border-neutral-200 bg-white px-4 py-3">
          <Text className="text-xs font-semibold uppercase tracking-[1.5px] text-neutral-500">
            Fluxo
          </Text>
          <Text className="mt-1 text-sm text-neutral-800">Pedido completo</Text>
        </View>
      </View>

      <View className="mt-8 gap-4">
        {foodtrucksQuery.isPending ? (
          <View className="rounded-lg border border-neutral-200 bg-white px-5 py-5 shadow-sm">
            <Text className="text-sm font-semibold text-ink">
              Carregando barracas
            </Text>
            <Text className="mt-2 text-sm leading-6 text-neutral-500">
              Buscando a lista publica do evento ativo em staging.
            </Text>
          </View>
        ) : foodtrucksQuery.isError ? (
          <View className="rounded-lg border border-rose-200 bg-rose-50 px-5 py-5 shadow-sm">
            <Text className="text-sm font-semibold text-rose-950">
              Nao foi possivel carregar o evento
            </Text>
            <Text className="mt-2 text-sm leading-6 text-rose-900">
              {foodtrucksQuery.error.message}
            </Text>
          </View>
        ) : (
          foodtrucksQuery.data.map((truck) => (
            <Link asChild href={`/(app)/trucks/${truck.slug}`} key={truck.slug}>
              <Pressable
                className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm"
                onPress={() => {
                  console.log('Mobile truck card pressed:', {
                    truckSlug: truck.slug,
                    route: `/(app)/trucks/${truck.slug}`,
                  });
                }}
              >
                {resolveDevFoodtruckImage(truck.heroImageKey) ? (
                  <Image
                    source={resolveDevFoodtruckImage(truck.heroImageKey)}
                    className="h-40 w-full"
                    resizeMode="cover"
                  />
                ) : null}

                <View className="px-5 py-5">
                  <Text className="text-lg font-semibold text-ink">
                    {truck.displayName}
                  </Text>
                  {truck.primaryCategory ? (
                    <Text className="mt-1 text-xs font-semibold uppercase tracking-[1.5px] text-pine">
                      {truck.primaryCategory}
                    </Text>
                  ) : null}
                  {truck.description ? (
                    <Text className="mt-3 text-sm leading-6 text-neutral-600">
                      {truck.description}
                    </Text>
                  ) : null}
                  <Text className="mt-4 rounded-lg bg-neutral-100 px-3 py-2 text-sm font-medium text-neutral-700">
                    {truck.acceptsOrders
                      ? 'Aceitando pedidos'
                      : 'Pedidos pausados'}
                    {' - '}janela {truck.capacityWindowMinutes} min
                  </Text>
                </View>
              </Pressable>
            </Link>
          ))
        )}
      </View>
    </ScrollView>
  );
}
