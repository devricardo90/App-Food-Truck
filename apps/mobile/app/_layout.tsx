import '../global.css';

import { ClerkLoaded, ClerkLoading } from '@clerk/clerk-expo';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';

import { AppProviders } from '../src/providers/app-providers';

export default function RootLayout() {
  return (
    <AppProviders>
      <StatusBar style="dark" />
      <ClerkLoading>
        <View className="flex-1 items-center justify-center bg-sand">
          <ActivityIndicator color="#14532d" size="large" />
        </View>
      </ClerkLoading>
      <ClerkLoaded>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: '#f7f1e8',
            },
          }}
        />
      </ClerkLoaded>
    </AppProviders>
  );
}
