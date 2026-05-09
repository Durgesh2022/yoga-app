import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useUser } from '../../context/UserContext';
import { fonts, typography } from '../../constants/theme';
import AnimatedPressable from '../../components/AnimatedPressable';
import PulsingDot from '../../components/PulsingDot';
import FloatingIcon from '../../components/FloatingIcon';
import StaggerItem from '../../components/StaggerItem';

// Use full URL for Expo Go compatibility
const API_URL = 'https://yoga-app-5kkj.vercel.app/api';

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
  Language: ['Hindi', 'English', 'Tamil', 'Punjabi'],
  Availability: ['Available Now', 'All'],
  Expertise: ['Vedic Astrology', 'Tarot & Palmistry', 'Numerology', 'Horoscope Reading'],
};

export default function AstrologyScreen() {
  const router = useRouter();
  const { user } = useUser();
  const [selectedFilter, setSelectedFilter] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({
    Pricing: '',
    Language: '',
    Availability: '',
    Expertise: '',
  });
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [astrologers, setAstrologers] = useState<Astrologer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fadeHeader = useRef(new Animated.Value(0)).current;
  const translateHeader = useRef(new Animated.Value(-8)).current;
  const fadeKundli = useRef(new Animated.Value(0)).current;
  const scaleKundli = useRef(new Animated.Value(0.96)).current;
  const fadeList = useRef(new Animated.Value(0)).current;
  const translateList = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    fetchAstrologers();
  }, []);

  useEffect(() => {
    const ease = Easing.bezier(0.16, 1, 0.3, 1);
    Animated.stagger(120, [
      Animated.parallel([
        Animated.timing(fadeHeader, { toValue: 1, duration: 480, easing: ease, useNativeDriver: true }),
        Animated.timing(translateHeader, { toValue: 0, duration: 480, easing: ease, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(fadeKundli, { toValue: 1, duration: 520, easing: ease, useNativeDriver: true }),
        Animated.timing(scaleKundli, { toValue: 1, duration: 520, easing: ease, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(fadeList, { toValue: 1, duration: 520, easing: ease, useNativeDriver: true }),
        Animated.timing(translateList, { toValue: 0, duration: 520, easing: ease, useNativeDriver: true }),
      ]),
    ]).start();
  }, [fadeHeader, translateHeader, fadeKundli, scaleKundli, fadeList, translateList]);

  const fetchAstrologersOnce = async (timeoutMs: number) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(`${API_URL}/astrologers`, { signal: controller.signal });
      const result = await response.json();
      return result;
    } finally {
      clearTimeout(timer);
    }
  };

  const fetchAstrologers = async () => {
    setLoading(true);
    setError(null);

    let lastErr: any = null;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const result = await fetchAstrologersOnce(attempt === 1 ? 8000 : 25000);
        if (result.success) {
          setAstrologers(result.data);
          setLoading(false);
          return;
        }
        lastErr = new Error(result.error || 'Server returned no data');
      } catch (err: any) {
        lastErr = err;
        console.warn(`[Astrologers] attempt ${attempt} failed:`, err?.message);
      }
      if (attempt < 3) {
        await new Promise((r) => setTimeout(r, 1500));
      }
    }

    console.error('Error fetching astrologers:', lastErr);
    setError('Failed to connect to the server');
    Alert.alert(
      'Connection issue',
      'Could not reach astrologer server. The server may be waking up — please tap retry in a few seconds.'
    );
    setLoading(false);
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
        <Animated.View
          style={[
            styles.header,
            { opacity: fadeHeader, transform: [{ translateY: translateHeader }] },
          ]}
        >
          <View>
            <Text style={styles.eyebrow}>Namaste</Text>
            <Text style={styles.greeting}>{user?.full_name?.split(' ')[0] || 'Guest'}</Text>
            <Text style={styles.subGreeting}>Welcome In, Let's decide together</Text>
          </View>
          <AnimatedPressable
            style={styles.balanceContainer}
            onPress={() => router.push('/wallet')}
          >
            <Ionicons name="wallet-outline" size={20} color="#FFFFFF" />
            <Text style={styles.balanceText}>₹{user?.wallet_balance || 0}</Text>
          </AnimatedPressable>
        </Animated.View>

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
          <Animated.View style={{ opacity: fadeKundli, transform: [{ scale: scaleKundli }] }}>
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
                <FloatingIcon amplitude={5} duration={2200} rotate>
                  <View style={styles.kundliIcon}>
                    <Ionicons name="sparkles" size={40} color="#f6cf92" />
                  </View>
                </FloatingIcon>
              </View>
              <AnimatedPressable style={styles.kundliButton}>
                <Text style={styles.kundliButtonText}>Generate Now</Text>
                <Ionicons name="arrow-forward" size={16} color="#f6cf92" />
              </AnimatedPressable>
            </LinearGradient>
          </Animated.View>
        </View>

        {/* Astrologers Grid */}
        <Animated.View
          style={[
            styles.astrologersSection,
            { opacity: fadeList, transform: [{ translateY: translateList }] },
          ]}
        >
          <View style={styles.astrologersTitleRow}>
            <Text style={styles.astrologersTitle}>Top Astrologers</Text>
            <View style={styles.astrologersRightRow}>
              {!loading && (
                <Text style={styles.astrologersCount}>{filteredAstrologers.length} found</Text>
              )}
              <TouchableOpacity
                style={styles.refreshButton}
                onPress={fetchAstrologers}
                disabled={loading}
                activeOpacity={0.7}
                accessibilityLabel="Refresh astrologers"
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#C9956C" />
                ) : (
                  <Ionicons name="refresh" size={18} color="#C9956C" />
                )}
              </TouchableOpacity>
            </View>
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
              {filteredAstrologers.map((astrologer, idx) => (
                <StaggerItem
                  key={astrologer._id}
                  index={idx}
                  step={70}
                  translateY={18}
                  style={styles.astrologerCardWrap}
                >
                  <AnimatedPressable
                    style={styles.astrologerCard}
                    onPress={() => handleAstrologerPress(astrologer)}
                  >
                    <View style={styles.astrologerHeader}>
                      <View style={styles.astrologerAvatar}>
                        <Ionicons name="person" size={32} color="#f6cf92" />
                      </View>
                      {astrologer.available && (
                        <View style={styles.onlineBadge}>
                          <PulsingDot color="#4ADE80" size={10} />
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
                    <View style={styles.chatButton}>
                      <Ionicons name="chatbubble" size={14} color="#FFFFFF" />
                      <Text style={styles.chatButtonText}>Chat Now</Text>
                    </View>
                  </AnimatedPressable>
                </StaggerItem>
              ))}
            </View>
          )}
        </Animated.View>
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
  eyebrow: {
    ...typography.overline,
    color: '#C9956C',
    marginBottom: 4,
  },
  greeting: {
    fontFamily: fonts.display,
    fontSize: 28,
    lineHeight: 34,
    color: '#1F1B16',
    letterSpacing: -0.4,
  },
  subGreeting: {
    ...typography.body,
    color: '#9A8F84',
    marginTop: 4,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C9956C',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 8,
    shadowColor: '#C9956C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  balanceText: {
    fontFamily: fonts.sansBold,
    fontSize: 15,
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    paddingBottom: 24,
  },
  sectionTitle: {
    fontFamily: fonts.display,
    fontSize: 24,
    lineHeight: 30,
    color: '#1F1B16',
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  sectionSubtitle: {
    ...typography.body,
    color: '#7A7065',
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
    ...typography.button,
    fontSize: 13,
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
    ...typography.h3,
    color: '#1F1B16',
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
    ...typography.captionMedium,
    fontSize: 13,
    color: '#666',
  },
  filterOptionTextActive: {
    fontFamily: fonts.sansSemiBold,
    color: '#FFF',
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
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 28,
    color: '#1F1B16',
    letterSpacing: -0.2,
    marginBottom: 6,
  },
  kundliSubtitle: {
    ...typography.body,
    fontSize: 13,
    color: '#7A7065',
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
    ...typography.button,
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
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 28,
    color: '#1F1B16',
    letterSpacing: -0.2,
  },
  astrologersCount: {
    ...typography.captionMedium,
    fontSize: 12,
    color: '#9A8F84',
  },
  astrologersRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  refreshButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFF5EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    ...typography.body,
    marginTop: 12,
    color: '#7A7065',
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  errorText: {
    ...typography.body,
    marginTop: 12,
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
    ...typography.button,
    fontSize: 14,
    color: '#FFF',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    ...typography.h3,
    marginTop: 12,
    color: '#666',
  },
  emptySubText: {
    ...typography.body,
    marginTop: 4,
    color: '#9A8F84',
  },
  astrologersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  astrologerCardWrap: {
    width: '48%',
  },
  astrologerCard: {
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
    right: '28%',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  astrologerName: {
    fontFamily: fonts.serif,
    fontSize: 17,
    lineHeight: 22,
    color: '#1F1B16',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: -0.1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginBottom: 4,
  },
  ratingText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 13,
    color: '#333',
  },
  reviewsText: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: '#9A8F84',
  },
  serviceText: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: '#7A7065',
    textAlign: 'center',
    marginBottom: 2,
  },
  languageText: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: '#9A8F84',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  priceText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 12,
    color: '#C9956C',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.2,
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
    ...typography.button,
    fontSize: 13,
    color: '#FFFFFF',
  },
});
