import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUser } from '../context/UserContext';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'https://cosmic-healing-1.preview.emergentagent.com/api';

interface BookingModalProps {
  visible: boolean;
  onClose: () => void;
  classData: {
    name: string;
    time: string;
    date: string;
    guru: string;
    price: number;
    credits: number;
    level?: string;
  };
  userCredits: number;
}

export default function BookingModal({
  visible,
  onClose,
  classData,
  userCredits,
}: BookingModalProps) {
  const router = useRouter();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const handleProceed = async () => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to book a class', [
        { text: 'OK', onPress: () => {
          onClose();
          router.push('/');
        }}
      ]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/yoga/class-booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          class_name: classData.name,
          class_time: classData.time,
          class_date: classData.date,
          guru_name: classData.guru,
          price: classData.price,
          credits: classData.credits,
          level: classData.level || 'Beginner',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Booking failed');
      }

      onClose();
      
      // Navigate to wallet with booking info
      router.push({
        pathname: '/wallet',
        params: {
          bookingId: data.id,
          amount: classData.price,
          serviceName: classData.name,
          astrologerName: classData.guru,
          bookingType: 'yoga_class',
        }
      });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create booking');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Confirm Class Booking</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Summary Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{classData.name}</Text>
                <Text style={styles.summaryValue}>₹{classData.price}</Text>
              </View>
              <Text style={styles.summaryDetail}>
                {classData.date} | {classData.time} | {classData.guru}
              </Text>
              <View style={styles.creditBadge}>
                <Text style={styles.creditText}>{classData.credits} Yoga Credit</Text>
              </View>
            </View>

            {/* Payment Summary */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Payment summary</Text>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Class price</Text>
                <Text style={styles.paymentValue}>₹{classData.price}</Text>
              </View>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Credits used</Text>
                <Text style={styles.paymentValue}>{classData.credits}</Text>
              </View>
              <View style={styles.divider} />
            </View>

            {/* Credits Display */}
            <View style={styles.creditsContainer}>
              <View style={styles.creditsLeft}>
                <Ionicons name="star" size={16} color="#f6cf92" />
                <Text style={styles.creditsText}>Credits: {userCredits}</Text>
              </View>
              <TouchableOpacity onPress={() => {
                onClose();
                router.push('/wallet');
              }}>
                <Text style={styles.addCreditsText}>Add credits</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.proceedButton, isLoading && styles.proceedButtonDisabled]}
              onPress={handleProceed}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.proceedButtonText}>Proceed to Checkout - ₹{classData.price}</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.backButton} onPress={onClose}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  closeButton: {
    padding: 4,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  summaryDetail: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
  },
  creditBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0F8FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  creditText: {
    fontSize: 12,
    color: '#f6cf92',
    fontWeight: '500',
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  paymentLabel: {
    fontSize: 14,
    color: '#666',
  },
  paymentValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginTop: 8,
  },
  creditsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  creditsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  creditsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  addCreditsText: {
    fontSize: 14,
    color: '#f6cf92',
    fontWeight: '500',
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
  backButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#f6cf92',
  },
  backButtonText: {
    color: '#f6cf92',
    fontSize: 16,
    fontWeight: '600',
  },
});