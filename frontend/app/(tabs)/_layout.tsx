import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#C9956C',
        tabBarInactiveTintColor: '#A9A5A0',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          paddingBottom: Platform.OS === 'ios' ? 34 : 20,
          paddingTop: 14,
          paddingHorizontal: 16,
          height: Platform.OS === 'ios' ? 100 : 85,
          marginHorizontal: 0,
          elevation: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 6,
          letterSpacing: 0.2,
          marginBottom: Platform.OS === 'ios' ? 0 : 4,
        },
        tabBarIconStyle: {
          marginTop: 6,
        },
        tabBarItemStyle: {
          paddingVertical: 6,
          marginHorizontal: 4,
        },
      }}
    >
      <Tabs.Screen
        name="astrology"
        options={{
          title: 'Astrology',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <Ionicons name={focused ? 'sparkles' : 'sparkles-outline'} size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="yoga"
        options={{
          title: 'Yoga',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <Ionicons name={focused ? 'leaf' : 'leaf-outline'} size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="reiki"
        options={{
          title: 'Reiki',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <Ionicons name={focused ? 'hand-left' : 'hand-left-outline'} size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="pujas"
        options={{
          title: 'Pujas',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <Ionicons name={focused ? 'flame' : 'flame-outline'} size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <Ionicons name={focused ? 'person' : 'person-outline'} size={22} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    width: 44,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapperActive: {
    backgroundColor: '#FFF5EB',
  },
});
