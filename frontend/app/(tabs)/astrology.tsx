import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useUser } from '../../context/UserContext';

// API Configuration - Update this with your actual backend URL
const API_URL = 'http://192.168.1.2:3000/api';

interface Service {
  name: string;
  duration: string;
  price: number;
  description: string;
  tag: 'intro' | 'popular' | '';
}

interface Astrologer {
  _id: string;
  name: string;
  expertise: string;
  experience: string;
  languages: string[];
  price: number;
  rating: number;
  reviews: number;
  available: boolean;
  services: Service[];
}

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
  const [astrologers, setAstrologers] = useState<Astrologer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch astrologers from MongoDB
  useEffect(() => {
    fetchAstrologers();
  }, []);

  const fetchAstrologers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_URL}/astrologers`);
      const result = await response.json();

      if (result.success) {
        setAstrologers(result.data);
      } else {
        setError(result.error || 'Failed to fetch astrologers');
        Alert.alert('Error', result.error || 'Failed to fetch astrologers');
      }
    } catch (err: any) {
      console.error('Error fetching astrologers:', err);
      setError('Failed to connect to the server');
      Alert.alert('Error', 'Failed to connect to the server. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

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
    let result = [...astrologers];

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
  }, [astrologers, activeFilters]);

  const handleAstrologerPress = (astrologer: Astrologer) => {
    router.push({
      pathname: '/astrologer-detail',
      params: {
        id: astrologer._id,
        name: astrologer.name,
        expertise: astrologer.expertise,
        experience: astrologer.experience,
        languages: astrologer.languages.join(', '),
        price: astrologer.price,
        rating: astrologer.rating,
        reviews: astrologer.reviews,
        services: JSON.stringify(astrologer.services),
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
            {!loading && (
              <Text style={styles.astrologersCount}>{filteredAstrologers.length} found</Text>
            )}
          </View>

          {/* Loading State */}
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#f6cf92" />
              <Text style={styles.loadingText}>Loading astrologers...</Text>
            </View>
          )}

          {/* Error State */}
          {error && !loading && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={fetchAstrologers}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Empty State */}
          {!loading && !error && filteredAstrologers.length === 0 && (
            <View style={styles.emptyContainer}>
              <Ionicons name="person-outline" size={48} color="#999" />
              <Text style={styles.emptyText}>No astrologers found</Text>
              <Text style={styles.emptySubText}>Try adjusting your filters</Text>
            </View>
          )}

          {/* Astrologers Grid */}
          {!loading && !error && filteredAstrologers.length > 0 && (
            <View style={styles.astrologersGrid}>
              {filteredAstrologers.map((astrologer) => (
                <TouchableOpacity 
                  key={astrologer._id} 
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
                  <Text style={styles.languageText}>{astrologer.languages.join(', ')}</Text>
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
          )}
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
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  errorText: {
    marginTop: 12,
    fontSize: 14,
    color: '#EF4444',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: '#f6cf92',
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  emptySubText: {
    marginTop: 4,
    fontSize: 14,
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
    marginBottom: 2,
  },
  languageText: {
    fontSize: 11,
    color: '#999',
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