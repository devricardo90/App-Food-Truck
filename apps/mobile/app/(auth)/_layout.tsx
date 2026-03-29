import { useAuth } from '@clerk/clerk-expo';
import { useEffect } from 'react';
import { Redirect, Stack } from 'expo-router';

export default function AuthLayout() {
  const { isSignedIn } = useAuth();

  useEffect(() => {
    console.log('Mobile AuthLayout state:', {
      isSignedIn,
    });
  }, [isSignedIn]);

  if (isSignedIn) {
    console.log('Mobile AuthLayout redirect -> /(app)/(tabs)/trucks');
    return <Redirect href="/(app)/(tabs)/trucks" />;
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
