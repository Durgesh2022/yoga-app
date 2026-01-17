import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#f6cf92',
        tabBarInactiveTintColor: '#999',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E8E8E8',
          paddingBottom: 12,
          paddingTop: 12,
          height: 72,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="astrology"
        options={{
          title: 'Astrology',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'star' : 'star-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="yoga"
        options={{
          title: 'Yoga',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'body' : 'body-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reiki"
        options={{
          title: 'Reiki',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'hand-left' : 'hand-left-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="pujas"
        options={{
          title: 'Pujas',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'flame' : 'flame-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}