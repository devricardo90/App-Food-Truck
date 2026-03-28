import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function SignInScreen() {
  return (
    <View className="flex-1 bg-sand px-6 pt-20">
      <View className="rounded-[28px] border border-amber-950/10 bg-white p-6 shadow-sm">
        <Text className="text-xs font-semibold uppercase tracking-[2px] text-ember">
          Auth placeholder
        </Text>
        <Text className="mt-3 text-3xl font-bold text-ink">
          Login e cadastro do cliente
        </Text>
        <Text className="mt-3 text-base leading-6 text-neutral-600">
          Esta rota prepara o terreno para a integracao oficial de autenticacao
          no app mobile.
        </Text>

        <View className="mt-8 gap-3">
          <Link asChild href="/(app)/(tabs)/trucks">
            <Text className="rounded-full bg-pine px-4 py-4 text-center text-sm font-semibold text-white">
              Entrar no fluxo do cliente
            </Text>
          </Link>
          <Text className="text-sm text-neutral-500">
            Clerk mobile segue bloqueado ate definicao compativel com Expo SDK
            52.
          </Text>
        </View>
      </View>
    </View>
  );
}
