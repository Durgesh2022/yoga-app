import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useUser } from '../context/UserContext';

// API Configuration - Update this with your actual backend URL
const API_URL = 'http://192.168.1.2:3000/api';
const BOOKING_API_URL = process.env.EXPO_PUBLIC_BACKEND_URL ? `${process.env.EXPO_PUBLIC_BACKEND_URL}/api` : 'https://yoga-app-self.vercel.app/api';

interface Service {
  name: string;
  duration: string;
  price: number;
  description: string;
  tag: 'intro' | 'popular' | '';
}

// Helper function to get next 4 days including today
const getNext4Days = () => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dates = [];
  
  for (let i = 0; i < 4; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const dayName = days[date.getDay()];
    const dayNum = date.getDate();
    const monthName = months[date.getMonth()];
    dates.push(`${dayName}, ${dayNum} ${monthName}`);
  }
  
  return dates;
};

export default function AstrologerDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useUser();
  
  // Generate dynamic dates
  const AVAILABLE_DATES = useMemo(() => getNext4Days(), []);
  
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState('Yatra');
  const [selectedServicePrice, setSelectedServicePrice] = useState(800);
  const [selectedServiceDuration, setSelectedServiceDuration] = useState('40 min');
  const [selectedDate, setSelectedDate] = useState(AVAILABLE_DATES[0]);
  const [selectedTime, setSelectedTime] = useState('7:00 PM');
  const [isLoading, setIsLoading] = useState(false);
  const [astrologerData, setAstrologerData] = useState<any>(null);
  const [loadingAstrologer, setLoadingAstrologer] = useState(false);

  // Parse services from params or use empty array
  const servicesFromParams = useMemo(() => {
    try {
      return params.services ? JSON.parse(params.services as string) : [];
    } catch {
      return [];
    }
  }, [params.services]);

  // Get astrologer details from params or MongoDB
  const astrologer = {
    id: params.id as string || '1',
    name: params.name as string || 'Astro Meera',
    expertise: params.expertise as string || 'Tarot & Palmistry',
    experience: params.experience as string || '10+ years',
    languages: params.languages as string || 'Hindi, English',
    price: Number(params.price) || 400,
    rating: Number(params.rating) || 4.9,
    reviews: Number(params.reviews) || 1200,
    services: servicesFromParams.length > 0 ? servicesFromParams : [
      { name: 'Aaramb', duration: '12 min', price: 99, description: 'Quick introduction call', tag: 'intro' },
      { name: 'Sutra', duration: '20 min', price: Number(params.price) || 400, description: 'Get to know yourself', tag: '' },
      { name: 'Yatra', duration: '40 min', price: (Number(params.price) || 400) * 2, description: 'Detailed life analysis', tag: 'popular' },
      { name: 'Vishwas', duration: '60 min', price: (Number(params.price) || 400) * 3, description: 'Complete horoscope reading', tag: '' },
      { name: 'Anant', duration: '90 min', price: Math.round((Number(params.price) || 400) * 3.75), description: 'In-depth life path & future guidance', tag: '' },
    ],
  };

  // Fetch full astrologer details from MongoDB if we have an ID
  useEffect(() => {
    if (params.id && !servicesFromParams.length) {
      fetchAstrologerDetails(params.id as string);
    }
  }, [params.id]);

  const fetchAstrologerDetails = async (id: string) => {
    try {
      setLoadingAstrologer(true);
      const response = await fetch(`${API_URL}/astrologers/${id}`);
      const result = await response.json();

      if (result.success) {
        setAstrologerData(result.data);
      }
    } catch (err) {
      console.error('Error fetching astrologer details:', err);
    } finally {
      setLoadingAstrologer(false);
    }
  };

  // Use MongoDB data if available, otherwise use params
  const displayAstrologer = astrologerData || astrologer;
  const displayServices = astrologerData?.services || astrologer.services;

  const handleAddService = (service: Service) => {
    setSelectedService(service.name);
    setSelectedServicePrice(service.price);
    setSelectedServiceDuration(service.duration);
    setConfirmModalVisible(true);
  };

  const handleProceedToCheckout = async () => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to book a session', [
        { text: 'OK', onPress: () => router.push('/') }
      ]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${BOOKING_API_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          astrologer_id: displayAstrologer.id || displayAstrologer._id,
          astrologer_name: displayAstrologer.name,
          astrologer_expertise: displayAstrologer.expertise,
          astrologer_experience: displayAstrologer.experience,
          astrologer_languages: displayAstrologer.languages,
          service_name: selectedService,
          service_duration: selectedServiceDuration,
          service_price: selectedServicePrice,
          booking_date: selectedDate,
          booking_time: selectedTime,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Booking failed');
      }

      setConfirmModalVisible(false);
      
      // Navigate to wallet with booking amount
      router.push({
        pathname: '/wallet',
        params: {
          bookingId: data.id,
          amount: selectedServicePrice,
          serviceName: selectedService,
          astrologerName: displayAstrologer.name,
        }
      });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create booking');
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingAstrologer) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#f6cf92" />
          <Text style={styles.loadingText}>Loading astrologer details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Astrologer Details</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Astrologer Profile */}
        <View style={styles.profileSection}>
          <View style={styles.profileLeft}>
            <View style={styles.profileImage}>
              <Ionicons name="person" size={40} color="#f6cf92" />
            </View>
          </View>
          
          <View style={styles.profileRight}>
            <Text style={styles.astrologerName}>{displayAstrologer.name}</Text>
            
            <View style={styles.infoRow}>
              <Ionicons name="briefcase-outline" size={16} color="#666" />
              <Text style={styles.infoText}>
                {displayAstrologer.experience} in {displayAstrologer.expertise}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Ionicons name="moon-outline" size={16} color="#666" />
              <Text style={styles.infoText}>Expert in {displayAstrologer.expertise}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Ionicons name="people-outline" size={16} color="#666" />
              <Text style={styles.infoText}>{displayAstrologer.reviews}+ consultations</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Ionicons name="chatbubble-outline" size={16} color="#666" />
              <Text style={styles.infoText}>
                Available in {Array.isArray(displayAstrologer.languages) 
                  ? displayAstrologer.languages.join(', ') 
                  : displayAstrologer.languages}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="star" size={16} color="#f6cf92" />
              <Text style={styles.infoText}>
                {displayAstrologer.rating}/5.0 rating
              </Text>
            </View>
          </View>
        </View>

        {/* Money Back Guarantee Banner */}
        <View style={styles.guaranteeBanner}>
          <Ionicons name="shield-checkmark" size={24} color="#4ADE80" />
          <View style={styles.guaranteeTextContainer}>
            <Text style={styles.guaranteeTitle}>100% Money Back Guarantee</Text>
            <Text style={styles.guaranteeSubtitle}>Not satisfied? Get full refund within 24 hours</Text>
          </View>
        </View>

        {/* Service Packages */}
        <Text style={styles.servicesSectionTitle}>Service Packages</Text>
        {displayServices.map((service: Service, index: number) => (
          <View key={index} style={styles.serviceItem}>
            <View style={styles.serviceLeft}>
              <View style={styles.serviceTitleRow}>
                <Text style={styles.serviceName}>{service.name}</Text>
                {service.tag === 'intro' && (
                  <View style={styles.introTag}>
                    <Text style={styles.introTagText}>INTRO</Text>
                  </View>
                )}
                {service.tag === 'popular' && (
                  <View style={styles.popularTag}>
                    <Text style={styles.popularTagText}>POPULAR</Text>
                  </View>
                )}
              </View>
              <Text style={styles.serviceDuration}>{service.duration}</Text>
              <Text style={styles.serviceDescription}>{service.description}</Text>
            </View>
            <View style={styles.serviceRight}>
              <Text style={styles.servicePrice}>₹{service.price}</Text>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => handleAddService(service)}
              >
                <Ionicons name="add" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Confirm Session Modal */}
      <Modal
        visible={confirmModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Confirm Session</Text>
              <TouchableOpacity onPress={() => setConfirmModalVisible(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Summary */}
              <Text style={styles.sectionLabel}>Summary</Text>
              <View style={styles.summaryBox}>
                <View style={styles.summaryProfile}>
                  <View style={styles.summaryAvatar}>
                    <Ionicons name="person" size={24} color="#f6cf92" />
                  </View>
                </View>
                <View style={styles.summaryDetails}>
                  <Text style={styles.summaryName}>{displayAstrologer.name}</Text>
                  <Text style={styles.summaryService}>{selectedService} - {selectedServiceDuration}</Text>
                  <Text style={styles.summaryPrice}>₹{selectedServicePrice}</Text>
                </View>
              </View>

              {/* Money Back Guarantee */}
              <View style={styles.modalGuarantee}>
                <Ionicons name="shield-checkmark" size={18} color="#4ADE80" />
                <Text style={styles.modalGuaranteeText}>100% Money Back Guarantee</Text>
              </View>

              {/* Choose date */}
              <Text style={styles.sectionLabel}>Choose date</Text>
              <View style={styles.tabsRow}>
                {AVAILABLE_DATES.map((date) => (
                  <TouchableOpacity
                    key={date}
                    style={[styles.tab, selectedDate === date && styles.tabSelected]}
                    onPress={() => setSelectedDate(date)}
                  >
                    <Text style={[styles.tabText, selectedDate === date && styles.tabTextSelected]}>
                      {date}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Choose time */}
              <Text style={styles.sectionLabel}>Choose time</Text>
              <View style={styles.tabsRow}>
                {['7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM'].map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={[styles.tab, selectedTime === time && styles.tabSelected]}
                    onPress={() => setSelectedTime(time)}
                  >
                    <Text style={[styles.tabText, selectedTime === time && styles.tabTextSelected]}>
                      {time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Balance */}
              <View style={styles.balanceRow}>
                <View style={styles.balanceLeft}>
                  <Ionicons name="wallet-outline" size={20} color="#666" />
                  <Text style={styles.balanceText}>Balance: ₹{user?.wallet_balance || 0}</Text>
                </View>
                <TouchableOpacity onPress={() => {
                  setConfirmModalVisible(false);
                  router.push('/wallet');
                }}>
                  <Text style={styles.addFundsText}>Add funds</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            {/* Action Buttons */}
            <TouchableOpacity 
              style={[styles.proceedButton, isLoading && styles.proceedButtonDisabled]}
              onPress={handleProceedToCheckout}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.proceedButtonText}>Proceed to Checkout - ₹{selectedServicePrice}</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => setConfirmModalVisible(false)}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  profileSection: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  profileLeft: {
    position: 'relative',
    marginRight: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF9F0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#f6cf92',
  },
  profileRight: {
    flex: 1,
    justifyContent: 'center',
  },
  astrologerName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  guaranteeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  guaranteeTextContainer: {
    flex: 1,
  },
  guaranteeTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2D7A2D',
    marginBottom: 2,
  },
  guaranteeSubtitle: {
    fontSize: 12,
    color: '#4ADE80',
  },
  servicesSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  serviceLeft: {
    flex: 1,
  },
  serviceTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginRight: 8,
  },
  introTag: {
    backgroundColor: '#60A5FA',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  introTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFF',
  },
  popularTag: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  popularTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#000',
  },
  serviceDuration: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 13,
    color: '#999',
  },
  serviceRight: {
    alignItems: 'flex-end',
  },
  servicePrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f6cf92',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 12,
  },
  summaryBox: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
  },
  summaryProfile: {
    marginRight: 12,
  },
  summaryAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF9F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryDetails: {
    flex: 1,
  },
  summaryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  summaryService: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  summaryPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  modalGuarantee: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingVertical: 8,
  },
  modalGuaranteeText: {
    fontSize: 13,
    color: '#4ADE80',
    fontWeight: '600',
  },
  tabsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
  },
  tabSelected: {
    backgroundColor: '#f6cf92',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  tabTextSelected: {
    color: '#FFF',
    fontWeight: '600',
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 20,
  },
  balanceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  addFundsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f6cf92',
  },
  proceedButton: {
    backgroundColor: '#f6cf92',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  proceedButtonDisabled: {
    opacity: 0.7,
  },
  proceedButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  backButton: {
    backgroundColor: '#FFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#f6cf92',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f6cf92',
  },
});