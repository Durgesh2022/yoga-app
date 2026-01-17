import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const SERVICES = [
  {
    id: 'aaramb',
    name: 'Aaramb',
    duration: '12 min',
    description: 'Free trial to see if we connect',
    price: 0,
    isFree: true,
  },
  {
    id: 'sutra',
    name: 'Sutra',
    duration: '20 min',
    description: 'Quick guidance for a specific question or concern',
    price: 599,
  },
  {
    id: 'yatra',
    name: 'Yatra',
    duration: '40 min',
    description: 'Deep dive into life patterns, birth chart reading',
    price: 999,
    isPopular: true,
  },
  {
    id: 'vishwas',
    name: 'Vishwas',
    duration: '60 min',
    description: 'Comprehensive consultation covering multiple life areas',
    price: 1499,
  },
  {
    id: 'anant',
    name: 'Anant',
    duration: '90 min',
    description: 'Extended session for complex life situations',
    price: 2199,
  },
];

const DATES = ['Today', 'Tomorrow', 'Day after'];
const TIME_SLOTS = [
  '9:00 AM', '10:00 AM', '11:00 AM',
  '2:00 PM', '3:00 PM', '4:00 PM',
  '6:00 PM', '7:00 PM', '8:00 PM',
];

export default function AstrologerDetailScreen() {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState<any>(null);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [userBalance] = useState(1250);

  const handleSelectService = (service: any) => {
    setSelectedService(service);
    setConfirmModalVisible(true);
  };

  const handleProceedToCheckout = () => {
    console.log('Proceeding to checkout');
    setConfirmModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Astrologer Details</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Astrologer Profile */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={40} color="#f6cf92" />
            </View>
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark" size={12} color="#FFFFFF" />
            </View>
          </View>

          <Text style={styles.astrologerName}>Astro Meera</Text>

          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Ionicons name="calendar-outline" size={16} color="#666" />
              <Text style={styles.infoText}>12 years experience</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="star-outline" size={16} color="#666" />
              <Text style={styles.infoText}>Vedic Astrology</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="hand-left-outline" size={16} color="#666" />
              <Text style={styles.infoText}>Tarot & Palmistry</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="people-outline" size={16} color="#666" />
              <Text style={styles.infoText}>5000+ consultations</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="language-outline" size={16} color="#666" />
              <Text style={styles.infoText}>Hindi, English</Text>
            </View>
          </View>
        </View>

        {/* Services Section */}
        <View style={styles.servicesSection}>
          <Text style={styles.sectionTitle}>Services Offered</Text>

          {SERVICES.map((service) => (
            <View key={service.id} style={styles.serviceCard}>
              {service.isFree && (
                <View style={styles.freeTrialBanner}>
                  <Text style={styles.freeTrialText}>FREE TRIAL</Text>
                </View>
              )}
              {service.isPopular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>POPULAR</Text>
                </View>
              )}

              <View style={styles.serviceHeader}>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Text style={styles.serviceDuration}>{service.duration}</Text>
                </View>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => handleSelectService(service)}
                >
                  <Ionicons name="add" size={20} color="#f6cf92" />
                </TouchableOpacity>
              </View>

              <Text style={styles.serviceDesc}>{service.description}</Text>

              <View style={styles.servicePriceRow}>
                <Text style={styles.servicePrice}>
                  {service.price === 0 ? 'Free' : `₹${service.price}`}
                </Text>
              </View>
            </View>
          ))}
        </View>
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
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Confirm Session</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setConfirmModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Session Summary */}
              {selectedService && (
                <View style={styles.sessionSummary}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Astrologer</Text>
                    <Text style={styles.summaryValue}>Astro Meera</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Service</Text>
                    <Text style={styles.summaryValue}>{selectedService.name}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Duration</Text>
                    <Text style={styles.summaryValue}>{selectedService.duration}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Price</Text>
                    <Text style={styles.summaryPrice}>
                      {selectedService.price === 0 ? 'Free' : `₹${selectedService.price}`}
                    </Text>
                  </View>
                </View>
              )}

              {/* Date Selection */}
              <View style={styles.selectionSection}>
                <Text style={styles.selectionTitle}>Select Date</Text>
                <View style={styles.dateOptions}>
                  {DATES.map((date) => (
                    <TouchableOpacity
                      key={date}
                      style={[styles.dateOption, selectedDate === date && styles.selectedOption]}
                      onPress={() => setSelectedDate(date)}
                    >
                      <Text
                        style={[
                          styles.dateOptionText,
                          selectedDate === date && styles.selectedOptionText,
                        ]}
                      >
                        {date}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Time Selection */}
              <View style={styles.selectionSection}>
                <Text style={styles.selectionTitle}>Select Time</Text>
                <View style={styles.timeGrid}>
                  {TIME_SLOTS.map((time) => (
                    <TouchableOpacity
                      key={time}
                      style={[styles.timeSlot, selectedTime === time && styles.selectedTimeSlot]}
                      onPress={() => setSelectedTime(time)}
                    >
                      <Text
                        style={[
                          styles.timeSlotText,
                          selectedTime === time && styles.selectedTimeSlotText,
                        ]}
                      >
                        {time}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Wallet Balance */}
              <View style={styles.walletSection}>
                <View style={styles.balanceRow}>
                  <Text style={styles.balanceLabel}>Balance</Text>
                  <Text style={styles.balanceValue}>₹{userBalance}</Text>
                </View>
                <TouchableOpacity>
                  <Text style={styles.addFundsText}>Add funds</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.proceedButton}
                onPress={handleProceedToCheckout}
                activeOpacity={0.8}
              >
                <Text style={styles.proceedButtonText}>Proceed to Checkout</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.backModalButton}
                onPress={() => setConfirmModalVisible(false)}
              >
                <Text style={styles.backModalButtonText}>Back</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  profileSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF9F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4ADE80',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  astrologerName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
  },
  infoGrid: {
    width: '100%',
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
  },
  servicesSection: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    position: 'relative',
  },
  freeTrialBanner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#4ADE80',
    paddingVertical: 6,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    alignItems: 'center',
  },
  freeTrialText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  popularBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#f6cf92',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  popularText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  serviceDuration: {
    fontSize: 13,
    color: '#999',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF9F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceDesc: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  servicePriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  servicePrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f6cf92',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 36,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionSummary: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  summaryPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f6cf92',
  },
  selectionSection: {
    marginBottom: 20,
  },
  selectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  dateOptions: {
    flexDirection: 'row',
    gap: 10,
  },
  dateOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#E8F4F8',
    borderColor: '#5DADE2',
  },
  dateOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  selectedOptionText: {
    color: '#5DADE2',
    fontWeight: '700',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeSlot: {
    width: '30%',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    alignItems: 'center',
  },
  selectedTimeSlot: {
    backgroundColor: '#E8F4F8',
    borderColor: '#5DADE2',
  },
  timeSlotText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
  },
  selectedTimeSlotText: {
    color: '#5DADE2',
    fontWeight: '700',
  },
  walletSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
  },
  balanceValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  addFundsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5DADE2',
  },
  actionButtons: {
    gap: 12,
  },
  proceedButton: {
    backgroundColor: '#f6cf92',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  proceedButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  backModalButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#f6cf92',
  },
  backModalButtonText: {
    color: '#f6cf92',
    fontSize: 16,
    fontWeight: '600',
  },
});
