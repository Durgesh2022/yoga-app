import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useUser } from '../../context/UserContext';

const ASTROLOGERS = [
  { 
    id: 1, 
    name: 'Astro Meera', 
    rating: 4.9, 
    reviews: 1200, 
    expertise: 'Tarot & Palmistry', 
    available: true,
    price: 400,
    languages: ['Hindi', 'English'],
    experience: '10+ years'
  },
  { 
    id: 2, 
    name: 'Pandit Arjun', 
    rating: 4.8, 
    reviews: 980, 
    expertise: 'Vedic Astrology', 
    available: true,
    price: 600,
    languages: ['Hindi', 'Sanskrit'],
    experience: '15+ years'
  },
  { 
    id: 3, 
    name: 'Astro Kavya', 
    rating: 4.9, 
    reviews: 750, 
    expertise: 'Numerology', 
    available: false,
    price: 300,
    languages: ['English', 'Tamil'],
    experience: '8+ years'
  },
  { 
    id: 4, 
    name: 'Guru Dev', 
    rating: 4.7, 
    reviews: 1600, 
    expertise: 'Horoscope Reading', 
    available: true,
    price: 500,
    languages: ['Hindi', 'English', 'Punjabi'],
    experience: '20+ years'
  },
  { 
    id: 5, 
    name: 'Jyotishi Priya', 
    rating: 4.6, 
    reviews: 450, 
    expertise: 'Tarot & Palmistry', 
    available: true,
    price: 350,
    languages: ['English'],
    experience: '5+ years'
  },
  { 
    id: 6, 
    name: 'Acharya Raman', 
    rating: 4.9, 
    reviews: 2100, 
    expertise: 'Vedic Astrology', 
    available: true,
    price: 800,
    languages: ['Hindi', 'English', 'Sanskrit'],
    experience: '25+ years'
  },
];

const FILTER_OPTIONS = {
  Pricing: ['Low to High', 'High to Low'],
  Language: ['Hindi', 'English', 'Sanskrit', 'Tamil', 'Punjabi'],
  Availability: ['Available Now', 'All'],
  Expertise: ['Vedic Astrology', 'Tarot & Palmistry', 'Numerology', 'Horoscope Reading'],
};

export default function AstrologyScreen() {
  const router = useRouter();
  const { user } = useUser();
  const [selectedFilter, setSelectedFilter] = useState('Pricing');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({
    Pricing: 'Low to High',
    Language: '',
    Availability: 'All',
    Expertise: '',
  });
  const [showFilterOptions, setShowFilterOptions] = useState(false);

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter);
    setShowFilterOptions(true);
  };

  const handleFilterOptionSelect = (option: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [selectedFilter]: prev[selectedFilter] === option ? '' : option,
    }));
    setShowFilterOptions(false);
  };

  const filteredAstrologers = useMemo(() => {
    let result = [...ASTROLOGERS];

    // Filter by availability
    if (activeFilters.Availability === 'Available Now') {
      result = result.filter(a => a.available);
    }

    // Filter by language
    if (activeFilters.Language) {
      result = result.filter(a => a.languages.includes(activeFilters.Language));
    }

    // Filter by expertise
    if (activeFilters.Expertise) {
      result = result.filter(a => a.expertise === activeFilters.Expertise);
    }

    // Sort by pricing
    if (activeFilters.Pricing === 'Low to High') {
      result.sort((a, b) => a.price - b.price);
    } else if (activeFilters.Pricing === 'High to Low') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [activeFilters]);

  const handleAstrologerPress = (astrologer: typeof ASTROLOGERS[0]) => {
    router.push({
      pathname: '/astrologer-detail',
      params: {
        id: astrologer.id,
        name: astrologer.name,
        expertise: astrologer.expertise,
        experience: astrologer.experience,
        languages: astrologer.languages.join(', '),
        price: astrologer.price,
        rating: astrologer.rating,
        reviews: astrologer.reviews,
      }
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hi, {user?.full_name?.split(' ')[0] || 'Guest'}</Text>
            <Text style={styles.subGreeting}>Find your cosmic guidance</Text>
          </View>
          <TouchableOpacity 
            style={styles.balanceContainer}
            onPress={() => router.push('/wallet')}
          >
            <Ionicons name="wallet" size={18} color="#f6cf92" />
            <Text style={styles.balanceText}>₹{user?.wallet_balance || 0}</Text>
          </TouchableOpacity>
        </View>

        {/* Talk to Astrologer Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Talk to an Astrologer</Text>
          <Text style={styles.sectionSubtitle}>Certified experts, available 24/7</Text>

          {/* Filter Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tabsScroll}
            contentContainerStyle={styles.tabsContainer}
          >
            {Object.keys(FILTER_OPTIONS).map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.tab, 
                  selectedFilter === filter && styles.activeTab,
                  activeFilters[filter] && activeFilters[filter] !== 'All' && styles.filterAppliedTab
                ]}
                onPress={() => handleFilterSelect(filter)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.tabText, 
                  selectedFilter === filter && styles.activeTabText,
                  activeFilters[filter] && activeFilters[filter] !== 'All' && styles.filterAppliedTabText
                ]}>
                  {filter}
                </Text>
                {activeFilters[filter] && activeFilters[filter] !== 'All' && (
                  <View style={styles.filterDot} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Filter Options Dropdown */}
          {showFilterOptions && (
            <View style={styles.filterOptionsContainer}>
              <View style={styles.filterOptionsHeader}>
                <Text style={styles.filterOptionsTitle}>{selectedFilter}</Text>
                <TouchableOpacity onPress={() => setShowFilterOptions(false)}>
                  <Ionicons name="close" size={20} color="#666" />
                </TouchableOpacity>
              </View>
              <View style={styles.filterOptions}>
                {FILTER_OPTIONS[selectedFilter as keyof typeof FILTER_OPTIONS].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.filterOption,
                      activeFilters[selectedFilter] === option && styles.filterOptionActive
                    ]}
                    onPress={() => handleFilterOptionSelect(option)}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      activeFilters[selectedFilter] === option && styles.filterOptionTextActive
                    ]}>
                      {option}
                    </Text>
                    {activeFilters[selectedFilter] === option && (
                      <Ionicons name="checkmark" size={18} color="#FFF" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

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
          <View style={styles.astrologersTitleRow}>
            <Text style={styles.astrologersTitle}>Top Astrologers</Text>
            <Text style={styles.astrologersCount}>{filteredAstrologers.length} found</Text>
          </View>
          <View style={styles.astrologersGrid}>
            {filteredAstrologers.map((astrologer) => (
              <TouchableOpacity 
                key={astrologer.id} 
                style={styles.astrologerCard} 
                activeOpacity={0.8}
                onPress={() => handleAstrologerPress(astrologer)}
              >
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
                  <Text style={styles.ratingText}>{astrologer.rating}</Text>
                  <Text style={styles.reviewsText}>({astrologer.reviews})</Text>
                </View>
                <Text style={styles.serviceText}>{astrologer.expertise}</Text>
                <Text style={styles.priceText}>From ₹{astrologer.price}/session</Text>
                <TouchableOpacity 
                  style={styles.chatButton}
                  onPress={() => handleAstrologerPress(astrologer)}
                >
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
    marginBottom: 16,
  },
  tabsContainer: {
    gap: 10,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    gap: 4,
  },
  activeTab: {
    backgroundColor: '#f6cf92',
  },
  filterAppliedTab: {
    backgroundColor: '#FFF9F0',
    borderWidth: 1,
    borderColor: '#f6cf92',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  filterAppliedTabText: {
    color: '#f6cf92',
  },
  filterDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#f6cf92',
  },
  filterOptionsContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  filterOptionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  filterOptionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    gap: 6,
  },
  filterOptionActive: {
    backgroundColor: '#f6cf92',
  },
  filterOptionText: {
    fontSize: 13,
    color: '#666',
  },
  filterOptionTextActive: {
    color: '#FFF',
    fontWeight: '600',
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
  astrologersTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  astrologersTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  astrologersCount: {
    fontSize: 13,
    color: '#999',
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
    marginBottom: 4,
  },
  priceText: {
    fontSize: 12,
    color: '#f6cf92',
    textAlign: 'center',
    fontWeight: '600',
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
