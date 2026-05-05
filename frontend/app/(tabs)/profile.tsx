import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUser } from '../../context/UserContext';
import { fonts, typography } from '../../constants/theme';
import AnimatedPressable from '../../components/AnimatedPressable';
import StaggerItem from '../../components/StaggerItem';

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

  const fadeProfile = useRef(new Animated.Value(0)).current;
  const translateProfile = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    const ease = Easing.bezier(0.16, 1, 0.3, 1);
    Animated.parallel([
      Animated.timing(fadeProfile, { toValue: 1, duration: 480, easing: ease, useNativeDriver: true }),
      Animated.timing(translateProfile, { toValue: 0, duration: 480, easing: ease, useNativeDriver: true }),
    ]).start();
  }, [fadeProfile, translateProfile]);

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
        <Animated.View
          style={[
            styles.profileCard,
            { opacity: fadeProfile, transform: [{ translateY: translateProfile }] },
          ]}
        >
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
        </Animated.View>

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
          <StaggerItem key={index} index={index} step={90} delay={120} translateY={14}>
            <View style={styles.menuSection}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {section.items.map((item) => (
                <AnimatedPressable
                  key={item.id}
                  style={styles.menuItem}
                  scaleTo={0.98}
                  onPress={() => handleMenuItemPress(item.route)}
                >
                  <View style={styles.menuItemLeft}>
                    <View style={[styles.iconContainer, { backgroundColor: `${item.color}15` }]}>
                      <Ionicons name={item.icon as any} size={20} color={item.color} />
                    </View>
                    <Text style={styles.menuItemText}>{item.label}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#CCC" />
                </AnimatedPressable>
              ))}
            </View>
          </StaggerItem>
        ))}

        <Text style={styles.taglineText}>Rooted in vedic India, crafted with ❤️</Text>

        {/* Logout Button */}
        <AnimatedPressable style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </AnimatedPressable>

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
    fontFamily: fonts.display,
    fontSize: 30,
    lineHeight: 36,
    color: '#1F1B16',
    letterSpacing: -0.4,
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
    fontFamily: fonts.display,
    fontSize: 28,
    color: '#FFFFFF',
    letterSpacing: 0.5,
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
    fontFamily: fonts.serif,
    fontSize: 19,
    lineHeight: 24,
    color: '#1F1B16',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  profileEmail: {
    ...typography.body,
    color: '#7A7065',
    marginBottom: 2,
  },
  profilePhone: {
    ...typography.body,
    fontSize: 13,
    color: '#9A8F84',
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
    fontFamily: fonts.sansSemiBold,
    fontSize: 12,
    color: '#4ADE80',
    letterSpacing: 0.2,
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 20,
    borderRadius: 16,
  },
  detailsTitle: {
    fontFamily: fonts.serif,
    fontSize: 17,
    lineHeight: 22,
    color: '#1F1B16',
    marginBottom: 16,
    letterSpacing: -0.1,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  detailLabel: {
    ...typography.body,
    flex: 1,
    color: '#8B8680',
    marginLeft: 12,
  },
  detailValue: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: '#333',
  },
  walletBalance: {
    fontFamily: fonts.sansBold,
    color: '#4ADE80',
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
    ...typography.overline,
    color: '#9A8F84',
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 4,
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
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: '#333',
    letterSpacing: 0.1,
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
    ...typography.buttonLg,
    color: '#EF4444',
  },
  taglineText: {
    fontFamily: fonts.displayItalic,
    textAlign: 'center',
    fontSize: 13,
    color: '#9E9E9E',
    marginTop: 20,
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  versionText: {
    fontFamily: fonts.sans,
    textAlign: 'center',
    fontSize: 12,
    color: '#CCC',
    marginTop: 20,
    marginBottom: 30,
    letterSpacing: 0.4,
  },
});
