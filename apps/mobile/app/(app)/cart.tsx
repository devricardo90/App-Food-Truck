import { Link } from 'expo-router';
import { Text, View } from 'react-native';

import { cartPreview } from '../../src/mocks/cart';

export default function CartScreen() {
  return (
    <View className="flex-1 bg-sand px-6 pt-16">
      <Text className="text-xs font-semibold uppercase tracking-[2px] text-ember">
        Carrinho
      </Text>
      <Text className="mt-3 text-3xl font-bold text-ink">
        Revisao antes do checkout
      </Text>

      <View className="mt-8 rounded-[28px] border border-amber-950/10 bg-white p-6 shadow-sm">
        <Text className="text-lg font-semibold text-ink">
          {cartPreview.truckName}
        </Text>
        <Text className="mt-2 text-sm text-neutral-500">
          Um carrinho por barraca durante o MVP.
        </Text>

        <View className="mt-6 gap-4">
          {cartPreview.items.map((item) => (
            <Text className="text-base text-neutral-700" key={item.id}>
              {item.quantity}x {item.name} • {item.priceLabel}
            </Text>
          ))}
        </View>

        <Text className="mt-8 text-xl font-bold text-ink">
          Total {cartPreview.totalLabel}
        </Text>
      </View>

      <View className="mt-8 gap-3">
        <Link asChild href="/(app)/checkout">
          <Text className="rounded-full bg-pine px-4 py-4 text-center text-sm font-semibold text-white">
            Seguir para checkout
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
