import { useAuth, useUser } from '@clerk/clerk-expo';
import { Pressable, Text, View } from 'react-native';

import { useAuthBootstrap } from '../../../src/providers/auth-bootstrap-provider';

export default function AccountScreen() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const { authMe, errorMessage, isBootstrapping } = useAuthBootstrap();

  return (
    <View className="flex-1 bg-sand px-6 pt-16">
      <Text className="text-xs font-semibold uppercase tracking-[2px] text-ember">
        Conta
      </Text>
      <Text className="mt-3 text-3xl font-bold text-ink">
        Perfil autenticado do cliente
      </Text>
      <Text className="mt-3 text-base leading-6 text-neutral-600">
        O app restaura a sessao com Secure Store e consulta o contexto oficial
        do backend em `/auth/me`.
      </Text>

      <View className="mt-8 rounded-[28px] border border-amber-950/10 bg-white p-6 shadow-sm">
        <Text className="text-lg font-semibold text-ink">
          {user?.fullName ?? 'Cliente autenticado'}
        </Text>
        <Text className="mt-2 text-sm text-neutral-500">
          {user?.primaryEmailAddress?.emailAddress ?? 'Email nao disponivel'}
        </Text>

        <View className="mt-8 rounded-[20px] bg-stone-950 px-4 py-4">
          <Text className="text-xs font-semibold uppercase tracking-[2px] text-amber-300">
            Backend auth context
          </Text>
          <Text className="mt-3 text-sm leading-6 text-stone-200">
            {isBootstrapping
              ? 'Consultando /auth/me com token do Clerk...'
              : errorMessage
                ? errorMessage
                : authMe
                  ? `role=${authMe.role} | memberships=${authMe.memberships.length}`
                  : 'Contexto autenticado indisponivel.'}
          </Text>
          {authMe?.activeFoodtruck ? (
            <Text className="mt-2 text-sm leading-6 text-stone-300">
              foodtruck ativo: {authMe.activeFoodtruck.foodtruckName}
            </Text>
          ) : null}
          {authMe?.requiresFoodtruckSelection ? (
            <Text className="mt-2 text-sm leading-6 text-stone-300">
              O backend exige selecao de foodtruck para concluir o bootstrap.
            </Text>
          ) : null}
        </View>

        <View className="mt-8 gap-3">
          <Pressable
            className="rounded-full border border-neutral-300 px-4 py-4"
            onPress={() => {
              void signOut();
            }}
          >
            <Text className="text-center text-sm font-semibold text-neutral-700">
              Encerrar sessao
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
