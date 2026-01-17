import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function PujasScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Pujas</Text>
          <Text style={styles.subtitle}>Sacred rituals for you</Text>
        </View>

        {/* Coming Soon Content */}
        <View style={styles.content}>
          <LinearGradient
            colors={['#FFF9F0', '#FFE8CC']}
            style={styles.imageContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="flame" size={80} color="#f6cf92" />
          </LinearGradient>

          <View style={styles.badge}>
            <Ionicons name="time-outline" size={16} color="#f6cf92" />
            <Text style={styles.badgeText}>Coming Soon</Text>
          </View>

          <Text style={styles.comingSoonTitle}>Sacred Pujas Coming Soon</Text>
          <Text style={styles.description}>
            Discover personalized sacred rituals and pujas curated for your spiritual intentions. Connect with ancient traditions and find divine blessings.
          </Text>

          <View style={styles.featuresContainer}>
            <View style={styles.feature}>
              <View style={styles.featureIcon}>
                <Ionicons name="checkmark-circle" size={20} color="#4ADE80" />
              </View>
              <Text style={styles.featureText}>Traditional Rituals</Text>
            </View>
            <View style={styles.feature}>
              <View style={styles.featureIcon}>
                <Ionicons name="checkmark-circle" size={20} color="#4ADE80" />
              </View>
              <Text style={styles.featureText}>Expert Pandits</Text>
            </View>
            <View style={styles.feature}>
              <View style={styles.featureIcon}>
                <Ionicons name="checkmark-circle" size={20} color="#4ADE80" />
              </View>
              <Text style={styles.featureText}>Custom Ceremonies</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.notifyButton}>
            <Ionicons name="notifications" size={18} color="#FFFFFF" />
            <Text style={styles.notifyButtonText}>Notify me when available</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.learnMoreButton}>
            <Text style={styles.learnMoreText}>Learn more about Pujas</Text>
            <Ionicons name="arrow-forward" size={16} color="#f6cf92" />
          </TouchableOpacity>
        </View>
      </View>
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
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  imageContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9F0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    marginBottom: 20,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#f6cf92',
  },
  comingSoonTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 32,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 10,
    gap: 12,
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  notifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f6cf92',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    width: '100%',
    gap: 8,
    marginBottom: 12,
  },
  notifyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  learnMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  learnMoreText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#f6cf92',
  },
});