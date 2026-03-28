import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#14532d',
        tabBarInactiveTintColor: '#737373',
        tabBarStyle: {
          backgroundColor: '#fffaf3',
          borderTopColor: '#eadfce',
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          textTransform: 'uppercase',
        },
      }}
    >
      <Tabs.Screen
        name="trucks"
        options={{
          title: 'Barracas',
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Pedidos',
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Conta',
        }}
      />
    </Tabs>
  );
}
