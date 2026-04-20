import { useQuery } from '@tanstack/react-query';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { Image, Pressable, Text, View } from 'react-native';

import { resolveDevFoodtruckImage } from '../../../../../src/lib/dev-foodtruck-media';
import {
  formatPrice,
  getFoodtruckCatalog,
} from '../../../../../src/lib/foodtrucks-api';
import { useCart } from '../../../../../src/providers/cart-provider';

export default function MenuItemDetailScreen() {
  const router = useRouter();
  const { truckId, itemId } = useLocalSearchParams<{
    truckId: string;
    itemId: string;
  }>();
  const { addItem, cart } = useCart();
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
      <View className="flex-1 items-center justify-center bg-neutral-50 px-6">
        <Text className="text-lg font-semibold text-ink">
          Carregando item...
        </Text>
      </View>
    );
  }

  if (catalogQuery.isError || !catalogQuery.data || !item) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-50 px-6">
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
  const itemImage = resolveDevFoodtruckImage(item.imageKey);
  const willReplaceCart =
    Boolean(cart.foodtruckSlug) && cart.foodtruckSlug !== catalog.foodtruckSlug;

  return (
    <View className="flex-1 bg-neutral-50 px-6 pt-16">
      <Text className="text-xs font-semibold uppercase tracking-[2px] text-pine">
        Item
      </Text>
      <Text className="mt-3 text-3xl font-bold text-ink">{item.name}</Text>
      <Text className="mt-3 text-base leading-6 text-neutral-600">
        {item.description ?? 'Sem descricao cadastrada para este item.'}
      </Text>

      {itemImage ? (
        <Image
          className="mt-6 h-56 w-full rounded-lg"
          resizeMode="cover"
          source={itemImage}
        />
      ) : null}

      <View className="mt-8 rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
        <Text className="text-sm uppercase tracking-[1.5px] text-neutral-500">
          Preco
        </Text>
        <Text className="mt-2 text-xl font-semibold text-ink">
          {formatPrice(item.price, item.currency)}
        </Text>
        <Text className="mt-4 text-sm text-neutral-500">
          Barraca ativa: {catalog.foodtruckName}
        </Text>
      </View>

      <View className="mt-8 gap-3">
        <Pressable
          className="rounded-lg bg-pine px-4 py-4"
          onPress={() => {
            console.log('Mobile cart add item:', {
              foodtruckSlug: catalog.foodtruckSlug,
              itemId: item.id,
              willReplaceCart,
            });
            addItem({
              foodtruckSlug: catalog.foodtruckSlug,
              foodtruckName: catalog.foodtruckName,
              id: item.id,
              name: item.name,
              price: item.price,
              currency: item.currency,
            });
            router.push('/(app)/cart');
          }}
        >
          <Text className="text-center text-sm font-semibold text-white">
            {willReplaceCart
              ? 'Trocar carrinho e adicionar'
              : 'Adicionar ao carrinho'}
          </Text>
        </Pressable>
        {willReplaceCart ? (
          <Text className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
            O MVP aceita um carrinho por barraca. Adicionar este item substitui
            os itens atuais.
          </Text>
        ) : null}
        <Link asChild href={`/(app)/trucks/${catalog.foodtruckSlug}/menu`}>
          <Text className="rounded-lg border border-neutral-300 px-4 py-4 text-center text-sm font-semibold text-neutral-700">
            Voltar ao cardapio
          </Text>
        </Link>
      </View>
    </View>
  );
}
