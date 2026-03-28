import { useQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { Image, Text, View } from 'react-native';

import { resolveDevFoodtruckImage } from '../../../../src/lib/dev-foodtruck-media';
import { listFoodtrucks } from '../../../../src/lib/foodtrucks-api';

export default function TrucksHomeScreen() {
  const foodtrucksQuery = useQuery({
    queryKey: ['foodtrucks'],
    queryFn: listFoodtrucks,
  });

  return (
    <View className="flex-1 bg-sand px-6 pt-16">
      <Text className="text-xs font-semibold uppercase tracking-[2px] text-ember">
        Descoberta
      </Text>
      <Text className="mt-3 text-3xl font-bold text-ink">
        Barracas abertas no evento
      </Text>
      <Text className="mt-3 text-base leading-6 text-neutral-600">
        Entrada principal para descobrir barracas, acessar cardapio e iniciar o
        pedido.
      </Text>

      <View className="mt-8 gap-4">
        {foodtrucksQuery.isPending ? (
          <Text className="rounded-[24px] border border-amber-950/10 bg-white px-5 py-5 text-sm leading-6 text-neutral-500 shadow-sm">
            Carregando foodtrucks do evento ativo...
          </Text>
        ) : foodtrucksQuery.isError ? (
          <Text className="rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-5 text-sm leading-6 text-rose-900 shadow-sm">
            {foodtrucksQuery.error.message}
          </Text>
        ) : (
          foodtrucksQuery.data.map((truck) => (
            <Link asChild href={`/(app)/trucks/${truck.slug}`} key={truck.slug}>
              <View className="overflow-hidden rounded-[24px] border border-amber-950/10 bg-white shadow-sm">
                {resolveDevFoodtruckImage(truck.heroImageKey) ? (
                  <Image
                    source={resolveDevFoodtruckImage(truck.heroImageKey)}
                    className="h-40 w-full"
                    resizeMode="cover"
                  />
                ) : null}

                <View className="px-5 py-5">
                  <Text className="text-base font-medium text-ink">
                    {truck.displayName}
                  </Text>
                  {truck.primaryCategory ? (
                    <Text className="mt-1 text-xs font-semibold uppercase tracking-[1.5px] text-ember">
                      {truck.primaryCategory}
                    </Text>
                  ) : null}
                  {truck.description ? (
                    <Text className="mt-3 text-sm leading-6 text-neutral-600">
                      {truck.description}
                    </Text>
                  ) : null}
                  <Text className="mt-4 text-sm font-normal text-neutral-500">
                    {truck.acceptsOrders
                      ? 'Aceitando pedidos'
                      : 'Pedidos pausados'}
                    {' | '}
                    janela {truck.capacityWindowMinutes} min
                  </Text>
                </View>
              </View>
            </Link>
          ))
        )}
      </View>
    </View>
  );
}
