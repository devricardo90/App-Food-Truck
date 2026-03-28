import { useQuery } from '@tanstack/react-query';
import { Link, useLocalSearchParams } from 'expo-router';
import { Image, Text, View } from 'react-native';

import { resolveDevFoodtruckImage } from '../../../../src/lib/dev-foodtruck-media';
import { getFoodtruckDetail } from '../../../../src/lib/foodtrucks-api';

export default function TruckDetailScreen() {
  const { truckId } = useLocalSearchParams<{ truckId: string }>();
  const truckQuery = useQuery({
    queryKey: ['foodtruck-detail', truckId],
    queryFn: async () => getFoodtruckDetail(truckId),
    enabled: Boolean(truckId),
  });

  if (truckQuery.isPending) {
    return (
      <View className="flex-1 items-center justify-center bg-sand px-6">
        <Text className="text-lg font-semibold text-ink">
          Carregando barraca...
        </Text>
      </View>
    );
  }

  if (truckQuery.isError || !truckQuery.data) {
    return (
      <View className="flex-1 items-center justify-center bg-sand px-6">
        <Text className="text-lg font-semibold text-ink">
          Barraca nao encontrada
        </Text>
        <Text className="mt-3 text-center text-sm leading-6 text-neutral-500">
          {truckQuery.isError
            ? truckQuery.error.message
            : 'A API nao retornou dados para esta barraca.'}
        </Text>
      </View>
    );
  }

  const truck = truckQuery.data;
  const heroImage = resolveDevFoodtruckImage(truck.heroImageKey);
  const logoImage = resolveDevFoodtruckImage(truck.logoImageKey);

  return (
    <View className="flex-1 bg-sand px-6 pt-16">
      <Text className="text-xs font-semibold uppercase tracking-[2px] text-ember">
        Barraca
      </Text>

      {heroImage ? (
        <Image
          className="mt-6 h-52 w-full rounded-[28px]"
          resizeMode="cover"
          source={heroImage}
        />
      ) : null}

      <View className="mt-6 flex-row items-center gap-4">
        {logoImage ? (
          <Image
            className="h-16 w-16 rounded-[20px] bg-white"
            resizeMode="contain"
            source={logoImage}
          />
        ) : null}
        <View className="flex-1">
          <Text className="text-3xl font-bold text-ink">
            {truck.displayName}
          </Text>
          <Text className="mt-2 text-sm text-neutral-500">
            {truck.primaryCategory ?? 'street food'}
          </Text>
        </View>
      </View>

      <Text className="mt-4 text-base leading-6 text-neutral-600">
        {truck.description ?? 'Sem descricao cadastrada para esta barraca.'}
      </Text>

      <View className="mt-8 rounded-[28px] border border-amber-950/10 bg-white p-6 shadow-sm">
        <Text className="text-sm uppercase tracking-[1.5px] text-neutral-500">
          Status
        </Text>
        <Text className="mt-2 text-xl font-semibold text-ink">
          {truck.acceptsOrders ? 'Aceitando pedidos' : 'Pedidos pausados'}
        </Text>
        <Text className="mt-4 text-sm text-neutral-500">
          Evento ativo: {truck.eventName}
        </Text>
        <Text className="mt-2 text-sm text-neutral-500">
          Horario: {truck.openingTime ?? '--:--'} -{' '}
          {truck.closingTime ?? '--:--'}
        </Text>
        <Text className="mt-2 text-sm text-neutral-500">
          {truck.operatingDays ?? 'Dias de operacao nao informados.'}
        </Text>
        {truck.instagram ? (
          <Text className="mt-2 text-sm text-neutral-500">
            Instagram: {truck.instagram}
          </Text>
        ) : null}
        {truck.whatsapp ? (
          <Text className="mt-2 text-sm text-neutral-500">
            WhatsApp: {truck.whatsapp}
          </Text>
        ) : null}
      </View>

      <View className="mt-8 gap-3">
        <Link asChild href={`/(app)/trucks/${truck.slug}/menu`}>
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
