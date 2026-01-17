import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PackageConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  packageData: {
    name: string;
    credits: number;
    validity: string;
  };
  paymentMethod: string;
  onPaymentMethodChange: (method: string) => void;
}

export default function PackageConfirmModal({
  visible,
  onClose,
  packageData,
  paymentMethod,
  onPaymentMethodChange,
}: PackageConfirmModalProps) {
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
                  <TouchableOpacity style={styles.closeIcon}>
                    <Ionicons name="close" size={16} color="#999" />
                  </TouchableOpacity>
                </View>
                <View style={styles.validityRow}>
                  <Ionicons name="time-outline" size={14} color="#666" />
                  <Text style={styles.validityText}>Validity: {packageData.validity}</Text>
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
              style={styles.confirmButton}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmButtonText}>Confirm & Pay</Text>
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
  closeIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  validityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  validityText: {
    fontSize: 13,
    color: '#666',
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
