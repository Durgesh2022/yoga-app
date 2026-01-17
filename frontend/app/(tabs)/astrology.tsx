import React, { useState } from 'react';
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

const ASTROLOGERS = [
  { id: 1, name: 'Astro Meera', rating: 4.9, reviews: 1200, service: 'Tarot & Palmistry' },
  { id: 2, name: 'Pandit Arjun', rating: 4.8, reviews: 980, service: 'Tarot & Palmistry' },
  { id: 3, name: 'Astro Kavya', rating: 4.9, reviews: 750, service: 'Tarot & Palmistry' },
  { id: 4, name: 'Guru Dev', rating: 4.7, reviews: 1600, service: 'Tarot & Palmistry' },
];

export default function AstrologyScreen() {
  const [selectedTab, setSelectedTab] = useState('Pricing');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Hi, Ananya</Text>
          <View style={styles.balanceContainer}>
            <Ionicons name="wallet-outline" size={18} color="#5DADE2" />
            <Text style={styles.balanceText}>Balance: 15,450</Text>
          </View>
        </View>

        {/* Talk to Astrologer Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Talk to an Astrologer</Text>
          <Text style={styles.sectionSubtitle}>Certified experts, available 24/7</Text>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            {['Pricing', 'Language', 'Availability', 'Expertise'].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, selectedTab === tab && styles.activeTab]}
                onPress={() => setSelectedTab(tab)}
              >
                <Text style={[styles.tabText, selectedTab === tab && styles.activeTabText]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Free Kundli Card */}
          <View style={styles.kundliCard}>
            <View style={styles.kundliContent}>
              <View style={styles.kundliTextContainer}>
                <Text style={styles.kundliTitle}>Free Kundli Now</Text>
                <Text style={styles.kundliSubtitle}>
                  Get your personalised birth chart in a minute.
                </Text>
              </View>
              <Ionicons name="star" size={40} color="#5DADE2" />
            </View>
          </View>
        </View>

        {/* Astrologers Grid */}
        <View style={styles.astrologersGrid}>
          {ASTROLOGERS.map((astrologer) => (
            <View key={astrologer.id} style={styles.astrologerCard}>
              <View style={styles.astrologerAvatar}>
                <Ionicons name="person" size={32} color="#666" />
              </View>
              <Text style={styles.astrologerName}>{astrologer.name}</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={14} color="#5DADE2" />
                <Text style={styles.ratingText}>
                  {astrologer.rating} ({astrologer.reviews})
                </Text>
              </View>
              <Text style={styles.serviceText}>{astrologer.service}</Text>
            </View>
          ))}
        </View>
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
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  balanceText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5DADE2',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  activeTab: {
    backgroundColor: '#5DADE2',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  kundliCard: {
    backgroundColor: '#E8F4F8',
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
  },
  kundliContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kundliTextContainer: {
    flex: 1,
  },
  kundliTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  kundliSubtitle: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  astrologersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    paddingBottom: 24,
    gap: 12,
  },
  astrologerCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    alignItems: 'center',
  },
  astrologerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  astrologerName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 13,
    color: '#5DADE2',
    fontWeight: '500',
  },
  serviceText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});