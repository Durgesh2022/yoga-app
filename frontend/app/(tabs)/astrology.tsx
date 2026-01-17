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
import { LinearGradient } from 'expo-linear-gradient';

const ASTROLOGERS = [
  { id: 1, name: 'Astro Meera', rating: 4.9, reviews: 1200, service: 'Tarot & Palmistry', available: true },
  { id: 2, name: 'Pandit Arjun', rating: 4.8, reviews: 980, service: 'Tarot & Palmistry', available: true },
  { id: 3, name: 'Astro Kavya', rating: 4.9, reviews: 750, service: 'Tarot & Palmistry', available: false },
  { id: 4, name: 'Guru Dev', rating: 4.7, reviews: 1600, service: 'Tarot & Palmistry', available: true },
];

export default function AstrologyScreen() {
  const [selectedTab, setSelectedTab] = useState('Pricing');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hi, Ananya</Text>
            <Text style={styles.subGreeting}>Find your cosmic guidance</Text>
          </View>
          <View style={styles.balanceContainer}>
            <Ionicons name="wallet" size={18} color="#f6cf92" />
            <Text style={styles.balanceText}>₹15,450</Text>
          </View>
        </View>

        {/* Talk to Astrologer Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Talk to an Astrologer</Text>
          <Text style={styles.sectionSubtitle}>Certified experts, available 24/7</Text>

          {/* Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tabsScroll}
            contentContainerStyle={styles.tabsContainer}
          >
            {['Pricing', 'Language', 'Availability', 'Expertise'].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, selectedTab === tab && styles.activeTab]}
                onPress={() => setSelectedTab(tab)}
                activeOpacity={0.7}
              >
                <Text style={[styles.tabText, selectedTab === tab && styles.activeTabText]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Free Kundli Card */}
          <LinearGradient
            colors={['#FFF9F0', '#FFE8CC']}
            style={styles.kundliCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.kundliContent}>
              <View style={styles.kundliTextContainer}>
                <Text style={styles.kundliTitle}>Free Kundli Now</Text>
                <Text style={styles.kundliSubtitle}>
                  Get your personalised birth chart in a minute.
                </Text>
              </View>
              <View style={styles.kundliIcon}>
                <Ionicons name="sparkles" size={40} color="#f6cf92" />
              </View>
            </View>
            <TouchableOpacity style={styles.kundliButton}>
              <Text style={styles.kundliButtonText}>Generate Now</Text>
              <Ionicons name="arrow-forward" size={16} color="#f6cf92" />
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Astrologers Grid */}
        <View style={styles.astrologersSection}>
          <Text style={styles.astrologersTitle}>Top Astrologers</Text>
          <View style={styles.astrologersGrid}>
            {ASTROLOGERS.map((astrologer) => (
              <TouchableOpacity key={astrologer.id} style={styles.astrologerCard} activeOpacity={0.8}>
                <View style={styles.astrologerHeader}>
                  <View style={styles.astrologerAvatar}>
                    <Ionicons name="person" size={32} color="#f6cf92" />
                  </View>
                  {astrologer.available && (
                    <View style={styles.onlineBadge}>
                      <View style={styles.onlineDot} />
                    </View>
                  )}
                </View>
                <Text style={styles.astrologerName}>{astrologer.name}</Text>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={14} color="#f6cf92" />
                  <Text style={styles.ratingText}>
                    {astrologer.rating}
                  </Text>
                  <Text style={styles.reviewsText}>({astrologer.reviews})</Text>
                </View>
                <Text style={styles.serviceText}>{astrologer.service}</Text>
                <TouchableOpacity style={styles.chatButton}>
                  <Ionicons name="chatbubble" size={14} color="#FFFFFF" />
                  <Text style={styles.chatButtonText}>Chat Now</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  greeting: {
    fontSize: 26,
    fontWeight: '700',
    color: '#333',
  },
  subGreeting: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9F0',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 8,
  },
  balanceText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#f6cf92',
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  tabsScroll: {
    marginBottom: 20,
  },
  tabsContainer: {
    gap: 10,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
  },
  activeTab: {
    backgroundColor: '#f6cf92',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  kundliCard: {
    borderRadius: 20,
    padding: 20,
  },
  kundliContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  kundliTextContainer: {
    flex: 1,
  },
  kundliTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
  },
  kundliSubtitle: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  kundliIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kundliButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  kundliButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#f6cf92',
  },
  astrologersSection: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  astrologersTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  astrologersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  astrologerCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  astrologerHeader: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 12,
  },
  astrologerAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFF9F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineBadge: {
    position: 'absolute',
    top: 0,
    right: '30%',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4ADE80',
  },
  astrologerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '600',
  },
  reviewsText: {
    fontSize: 12,
    color: '#999',
  },
  serviceText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f6cf92',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  chatButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});