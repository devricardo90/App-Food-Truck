import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function AccountScreen() {
  return (
    <View className="flex-1 bg-sand px-6 pt-16">
      <Text className="text-xs font-semibold uppercase tracking-[2px] text-ember">
        Conta
      </Text>
      <Text className="mt-3 text-3xl font-bold text-ink">
        Perfil do cliente
      </Text>
      <Text className="mt-3 text-base leading-6 text-neutral-600">
        Area reservada para dados basicos, preferencias e saida da sessao.
      </Text>

      <View className="mt-8 rounded-[28px] border border-amber-950/10 bg-white p-6 shadow-sm">
        <Text className="text-lg font-semibold text-ink">Ricardo Cliente</Text>
        <Text className="mt-2 text-sm text-neutral-500">
          cliente@foodtrucks.app
        </Text>

        <View className="mt-8 gap-3">
          <Link asChild href="/(auth)/sign-in">
            <Text className="rounded-full border border-neutral-300 px-4 py-4 text-center text-sm font-semibold text-neutral-700">
              Voltar para auth placeholder
            </Text>
          </Link>
        </View>
      </View>
    </View>
  );
}
