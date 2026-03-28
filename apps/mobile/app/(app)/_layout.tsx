import { useAuth } from '@clerk/clerk-expo';
import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, Text, View } from 'react-native';

import { useAuthBootstrap } from '../../src/providers/auth-bootstrap-provider';

export default function AppLayout() {
  const { isSignedIn } = useAuth();
  const { authMe, errorMessage, isBootstrapping } = useAuthBootstrap();

  if (!isSignedIn) {
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
    return <Redirect href="/(auth)/sign-in" />;
  }

  if (!authMe) {
    return <Redirect href="/(auth)/sign-in" />;
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
