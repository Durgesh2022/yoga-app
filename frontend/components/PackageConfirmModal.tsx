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

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL ? `${process.env.EXPO_PUBLIC_BACKEND_URL}/api` : 'https://cosmic-healing-1.preview.emergentagent.com/api';

interface PackageConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  packageData: {
    name: string;
    price: number;
    credits: number;
    validity: string;
    mode?: string;
  };
  paymentMethod: string;
  onPaymentMethodChange: (method: string) => void;
  sessionType?: string;
}

export default function PackageConfirmModal({
  visible,
  onClose,
  packageData,
  paymentMethod,
  onPaymentMethodChange,
  sessionType = 'Group class',
}: PackageConfirmModalProps) {
  const router = useRouter();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirmPurchase = async () => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to purchase a package', [
        { text: 'OK', onPress: () => {
          onClose();
          router.push('/');
        }}
      ]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/yoga/package-purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          package_name: packageData.name,
          price: packageData.price,
          credits: packageData.credits,
          validity: packageData.validity,
          mode: packageData.mode || 'Online',
          session_type: sessionType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Purchase failed');
      }

      onClose();
      
      // Navigate to wallet with package info
      router.push({
        pathname: '/wallet',
        params: {
          bookingId: data.id,
          amount: packageData.price,
          serviceName: packageData.name,
          astrologerName: `${packageData.credits} credits`,
          bookingType: 'yoga_package',
        }
      });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to process purchase');
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
            <Text style={styles.modalTitle}>Confirm Pack</Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Pack Details */}
            <View style={styles.packSection}>
              <Text style={styles.packName}>{packageData.name}</Text>
              <View style={styles.packDetails}>
                <View style={styles.creditsRow}>
                  <Ionicons name="star" size={16} color="#f6cf92" />
                  <Text style={styles.packText}>Credits: {packageData.credits}</Text>
                </View>
                <View style={styles.validityRow}>
                  <Ionicons name="time-outline" size={14} color="#666" />
                  <Text style={styles.validityText}>Validity: {packageData.validity}</Text>
                </View>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Price:</Text>
                  <Text style={styles.priceValue}>₹{packageData.price.toLocaleString()}</Text>
                </View>
              </View>
            </View>

            {/* Payment Method */}
            <View style={styles.paymentSection}>
              <Text style={styles.sectionTitle}>Payment method</Text>
              
              <TouchableOpacity
                style={[styles.paymentOption, paymentMethod === 'UPI' && styles.selectedPayment]}
                onPress={() => onPaymentMethodChange('UPI')}
              >
                <View style={styles.radioOuter}>
                  {paymentMethod === 'UPI' && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.paymentText}>UPI</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.paymentOption]}
                onPress={() => onPaymentMethodChange('Card')}
              >
                <View style={styles.radioOuter}>
                  {paymentMethod === 'Card' && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.paymentText}>Debit / Credit Card</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.paymentOption]}
                onPress={() => onPaymentMethodChange('Wallet')}
              >
                <View style={styles.radioOuter}>
                  {paymentMethod === 'Wallet' && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.paymentText}>Wallet</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.confirmButton, isLoading && styles.confirmButtonDisabled]}
              activeOpacity={0.8}
              onPress={handleConfirmPurchase}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.confirmButtonText}>Confirm & Pay - ₹{packageData.price.toLocaleString()}</Text>
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
    maxHeight: '70%',
  },
  modalHeader: {
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  packSection: {
    marginBottom: 24,
  },
  packName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  packDetails: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
  },
  creditsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  packText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  validityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  validityText: {
    fontSize: 13,
    color: '#666',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f6cf92',
  },
  paymentSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  selectedPayment: {
    // Selected state handled by radio button
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#f6cf92',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#f6cf92',
  },
  paymentText: {
    fontSize: 15,
    color: '#333',
  },
  actionButtons: {
    gap: 12,
  },
  confirmButton: {
    backgroundColor: '#f6cf92',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    opacity: 0.7,
  },
  confirmButtonText: {
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
