import { useAuth, useUser } from '@clerk/clerk-expo';
import { useEffect } from 'react';
import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, Text, View } from 'react-native';

import { useAuthBootstrap } from '../../src/providers/auth-bootstrap-provider';

export default function AppLayout() {
  const { isLoaded: isAuthLoaded, isSignedIn } = useAuth();
  const { isLoaded: isUserLoaded } = useUser();
  const { authMe, errorMessage, isBootstrapping } = useAuthBootstrap();

  useEffect(() => {
    console.log('Mobile AppLayout state:', {
      isAuthLoaded,
      isSignedIn,
      isUserLoaded,
      isBootstrapping,
      hasAuthMe: Boolean(authMe),
      errorMessage,
    });
  }, [
    authMe,
    errorMessage,
    isAuthLoaded,
    isBootstrapping,
    isSignedIn,
    isUserLoaded,
  ]);

  if (!isAuthLoaded || (isSignedIn && !isUserLoaded)) {
    return (
      <View className="flex-1 items-center justify-center bg-sand px-6">
        <ActivityIndicator color="#14532d" size="large" />
        <Text className="mt-4 text-sm font-semibold uppercase tracking-[2px] text-ember">
          Clerk session sync
        </Text>
        <Text className="mt-2 max-w-sm text-center text-sm leading-6 text-neutral-600">
          Waiting for the Clerk session and user resources to finish loading.
        </Text>
      </View>
    );
  }

  if (!isSignedIn) {
    console.log('Mobile AppLayout redirect -> /(auth)/sign-in');
    return <Redirect href="/(auth)/sign-in" />;
  }

  if (isBootstrapping) {
    return (
      <View className="flex-1 items-center justify-center bg-sand px-6">
        <ActivityIndicator color="#14532d" size="large" />
        <Text className="mt-4 text-sm font-semibold uppercase tracking-[2px] text-ember">
          Bootstrap autenticado
        </Text>
        <Text className="mt-2 max-w-sm text-center text-sm leading-6 text-neutral-600">
          Validando a sessao atual com o contrato oficial `/auth/me`.
        </Text>
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View className="flex-1 items-center justify-center bg-sand px-6">
        <ActivityIndicator color="#14532d" size="large" />
        <Text className="mt-4 text-sm font-semibold uppercase tracking-[2px] text-ember">
          Encerrando sessao
        </Text>
        <Text className="mt-2 max-w-sm text-center text-sm leading-6 text-neutral-600">
          {errorMessage}
        </Text>
      </View>
    );
  }

  if (!authMe) {
    return (
      <View className="flex-1 items-center justify-center bg-sand px-6">
        <ActivityIndicator color="#14532d" size="large" />
        <Text className="mt-4 text-sm font-semibold uppercase tracking-[2px] text-ember">
          Contexto autenticado
        </Text>
        <Text className="mt-2 max-w-sm text-center text-sm leading-6 text-neutral-600">
          Aguardando o contexto autenticado estabilizar antes de liberar a
          navegacao.
        </Text>
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: '#f7f1e8',
        },
      }}
    />
  );
}
