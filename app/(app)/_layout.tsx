import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

const TabBarIcon = (name: any, focused: boolean) => (
  <FontAwesome
    name={name}
    size={24}
    color={focused ? '#111' : '#888'}
    solid={focused}
    style={{ marginBottom: 2 }}
  />
);

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: useClientOnlyValue(false, false),
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#111',
        tabBarInactiveTintColor: '#888',
        tabBarLabelStyle: {
          fontWeight: 'bold',
          fontSize: 12,
          marginTop: 2,
        },
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          height: 80,
          marginHorizontal: 8,
          marginBottom: 16,
          borderRadius: 24,
          paddingHorizontal: 12,
          paddingBottom: 10,
          paddingTop: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 8,
          position: 'absolute',
        },
      })}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => TabBarIcon('home', focused),
        }}
      />
      <Tabs.Screen
        name="search-ticker"
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({ focused }) => TabBarIcon('search', focused),
        }}
      />
      <Tabs.Screen
        name="watchlist"
        options={{
          tabBarLabel: 'Watchlist',
          href: null,
          tabBarIcon: ({ focused }) => TabBarIcon('star', focused),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ focused }) => TabBarIcon('cog', focused),
        }}
      />
    </Tabs>
  );
}
