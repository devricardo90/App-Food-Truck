import { Link } from 'expo-router';
import { Text, View } from 'react-native';

import { trucks } from '../../../../src/mocks/trucks';

export default function TrucksHomeScreen() {
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
        {trucks.map((truck) => (
          <Link asChild href={`/(app)/trucks/${truck.id}`} key={truck.id}>
            <Text className="rounded-[24px] border border-amber-950/10 bg-white px-5 py-5 text-base font-medium text-ink shadow-sm">
              {truck.name}
              {'\n'}
              <Text className="text-sm font-normal text-neutral-500">
                {truck.category} • {truck.status}
              </Text>
            </Text>
          </Link>
        ))}
      </View>
    </View>
  );
}
