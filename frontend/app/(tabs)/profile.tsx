import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const MENU_SECTIONS = [
  {
    title: 'Account',
    items: [
      { id: 1, label: 'Personal info', icon: 'person-outline' },
      { id: 2, label: 'Payment methods & wallet', icon: 'wallet-outline' },
    ],
  },
  {
    title: 'Spiritual profile',
    items: [{ id: 3, label: 'Spiritual preferences', icon: 'heart-outline' }],
  },
  {
    title: 'App settings',
    items: [
      { id: 4, label: 'Notifications', icon: 'notifications-outline' },
      { id: 5, label: 'Transaction history', icon: 'receipt-outline' },
    ],
  },
  {
    title: 'Settings',
    items: [
      { id: 6, label: 'Language', icon: 'language-outline' },
      { id: 7, label: 'Appearance', icon: 'color-palette-outline' },
    ],
  },
];

export default function ProfileScreen() {
  const router = useRouter();

  const handleLogout = () => {
    // Navigate back to login
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <View style={styles.walletContainer}>
            <Ionicons name="wallet-outline" size={16} color="#5DADE2" />
            <Text style={styles.walletText}>₹2,450</Text>
          </View>
        </View>

        {/* User Info */}
        <View style={styles.userInfoContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={48} color="#666" />
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>Ananya Sharma</Text>
            <Text style={styles.userTagline}>Aligning your stars, breath and energy</Text>
          </View>
        </View>

        {/* Menu Sections */}
        {MENU_SECTIONS.map((section, index) => (
          <View key={index} style={styles.menuSection}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.items.map((item) => (
              <TouchableOpacity key={item.id} style={styles.menuItem}>
                <View style={styles.menuItemLeft}>
                  <Ionicons name={item.icon as any} size={20} color="#666" />
                  <Text style={styles.menuItemText}>{item.label}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Log out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  walletContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  walletText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5DADE2',
  },
  userInfoContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  userTagline: {
    fontSize: 13,
    color: '#999',
    lineHeight: 18,
  },
  menuSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  logoutButton: {
    marginHorizontal: 20,
    marginBottom: 32,
    backgroundColor: '#FFE5E5',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FF4444',
    fontSize: 16,
    fontWeight: '600',
  },
});