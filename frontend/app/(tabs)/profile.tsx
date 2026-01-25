import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUser } from '../../context/UserContext';

const MENU_SECTIONS = [
  {
    title: 'Account',
    items: [
      { id: 1, label: 'Personal info', icon: 'person-outline', color: '#f6cf92', route: '/personal-info' },
      { id: 2, label: 'Payment methods & wallet', icon: 'wallet-outline', color: '#4ADE80', route: '/wallet' },
    ],
  },
  {
    title: 'Spiritual profile',
    items: [
      { id: 3, label: 'Spiritual preferences', icon: 'heart-outline', color: '#F472B6', route: '/spiritual-preferences' },
      { id: 4, label: 'My sessions', icon: 'calendar-outline', color: '#60A5FA', route: null },
    ],
  },
  {
    title: 'App settings',
    items: [
      { id: 5, label: 'Notifications', icon: 'notifications-outline', color: '#A78BFA', route: '/notifications' },
      { id: 6, label: 'Transaction history', icon: 'receipt-outline', color: '#34D399', route: '/transactions' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { id: 7, label: 'Language', icon: 'language-outline', color: '#FBBF24', route: null },
      { id: 8, label: 'Appearance', icon: 'color-palette-outline', color: '#FB923C', route: null },
    ],
  },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useUser();

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  const handleMenuItemPress = (route: string | null) => {
    if (route) {
      router.push(route as any);
    }
  };

  // Get user initials for avatar
  const getInitials = () => {
    if (!user?.full_name) return 'U';
    const names = user.full_name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitials()}</Text>
            </View>
            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="camera" size={14} color="#FFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.full_name || 'Guest User'}</Text>
            <Text style={styles.profileEmail}>{user?.email || 'No email'}</Text>
            {user?.phone && (
              <Text style={styles.profilePhone}>{user.phone}</Text>
            )}
          </View>
          {user?.is_verified && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#4ADE80" />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          )}
        </View>

        {/* User Details Card */}
        {user && (
          <View style={styles.detailsCard}>
            <Text style={styles.detailsTitle}>Your Details</Text>
            
            {user.gender && (
              <View style={styles.detailRow}>
                <Ionicons name="person-outline" size={18} color="#8B8680" />
                <Text style={styles.detailLabel}>Gender</Text>
                <Text style={styles.detailValue}>{user.gender}</Text>
              </View>
            )}
            
            {user.date_of_birth && (
              <View style={styles.detailRow}>
                <Ionicons name="calendar-outline" size={18} color="#8B8680" />
                <Text style={styles.detailLabel}>Date of Birth</Text>
                <Text style={styles.detailValue}>{user.date_of_birth}</Text>
              </View>
            )}
            
            {user.time_of_birth && (
              <View style={styles.detailRow}>
                <Ionicons name="time-outline" size={18} color="#8B8680" />
                <Text style={styles.detailLabel}>Time of Birth</Text>
                <Text style={styles.detailValue}>{user.time_of_birth}</Text>
              </View>
            )}
            
            {user.location && (
              <View style={styles.detailRow}>
                <Ionicons name="location-outline" size={18} color="#8B8680" />
                <Text style={styles.detailLabel}>Location</Text>
                <Text style={styles.detailValue}>{user.location}</Text>
              </View>
            )}

            <View style={styles.detailRow}>
              <Ionicons name="wallet-outline" size={18} color="#8B8680" />
              <Text style={styles.detailLabel}>Wallet Balance</Text>
              <Text style={[styles.detailValue, styles.walletBalance]}>₹{user.wallet_balance || 0}</Text>
            </View>
          </View>
        )}

        {/* Menu Sections */}
        {MENU_SECTIONS.map((section, index) => (
          <View key={index} style={styles.menuSection}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.items.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.menuItem} 
                activeOpacity={0.7}
                onPress={() => handleMenuItemPress(item.route)}
              >
                <View style={styles.menuItemLeft}>
                  <View style={[styles.iconContainer, { backgroundColor: `${item.color}15` }]}>
                    <Ionicons name={item.icon as any} size={20} color={item.color} />
                  </View>
                  <Text style={styles.menuItemText}>{item.label}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#CCC" />
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={styles.versionText}>Celestials Healing v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#333',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    borderRadius: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#D4A574',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  profilePhone: {
    fontSize: 13,
    color: '#999',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4ADE80',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 20,
    borderRadius: 16,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  detailLabel: {
    flex: 1,
    fontSize: 14,
    color: '#8B8680',
    marginLeft: 12,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  walletBalance: {
    color: '#4ADE80',
    fontWeight: '700',
  },
  menuSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#999',
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 4,
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 24,
    padding: 16,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#CCC',
    marginTop: 20,
    marginBottom: 30,
  },
});
