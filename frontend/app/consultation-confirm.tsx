import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ConsultationConfirmScreen() {
  const router = useRouter();

  const handleConfirmBooking = () => {
    // TODO: Implement booking confirmation logic
    console.log('Consultation confirmed');
    // Navigate back to yoga tab or show success message
    router.push('/(tabs)/yoga');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Yoga</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Free Badge */}
        <View style={styles.freeBadgeContainer}>
          <View style={styles.freeBadge}>
            <Ionicons name="gift" size={16} color="#4ADE80" />
            <Text style={styles.freeBadgeText}>Consultation is free</Text>
          </View>
        </View>

        {/* Main Title */}
        <Text style={styles.mainTitle}>Confirm your consultation</Text>
        <Text style={styles.subtitle}>
          Your first consultation is completely free.
        </Text>

        {/* Consultation Details Card */}
        <View style={styles.detailsCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Talk to a consultant</Text>
            <TouchableOpacity>
              <Text style={styles.editLink}>Edit details</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Format</Text>
            <Text style={styles.detailValue}>Voice call (15 mins)</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>When</Text>
            <Text style={styles.detailValue}>This evening (6:00 PM - 10:00 PM)</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Consultant</Text>
            <Text style={styles.detailValue}>Certified yoga guide</Text>
          </View>

          <Text style={styles.consultantDesc}>
            1:1 intro call to map your yoga journey.
          </Text>
        </View>

        {/* Pricing Card */}
        <View style={styles.pricingCard}>
          <Text style={styles.pricingTitle}>Total due now</Text>
          <Text style={styles.totalPrice}>₹0</Text>

          <View style={styles.divider} />

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Consultation fee</Text>
            <Text style={styles.priceValue}>₹0</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Taxes & charges</Text>
            <Text style={styles.priceValue}>₹0</Text>
          </View>

          <View style={styles.freeConsultBadge}>
            <Text style={styles.freeConsultText}>Free consultation</Text>
          </View>
        </View>

        {/* Contact Info Card */}
        <View style={styles.contactCard}>
          <Text style={styles.contactTitle}>How we'll reach you</Text>
          <Text style={styles.contactSubtitle}>From your profile</Text>

          <View style={styles.whatsappRow}>
            <Text style={styles.whatsappLabel}>
              We'll reach out on your saved WhatsApp number
            </Text>
          </View>

          <View style={styles.phoneRow}>
            <Text style={styles.phoneNumber}>+91 98XXXXXX10</Text>
            <TouchableOpacity style={styles.changeButton}>
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.additionalInfo}>
            We'll also use your saved name and email for reminders.
          </Text>

          <View style={styles.noPaymentBadge}>
            <Ionicons name="checkmark-circle" size={16} color="#4ADE80" />
            <Text style={styles.noPaymentText}>
              No payment needed now. You'll only confirm the free call timing.
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirmBooking}
          activeOpacity={0.8}
        >
          <Text style={styles.confirmButtonText}>Confirm & book call</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.whyFreeButton}>
          <Text style={styles.whyFreeText}>Why is this consultation free?</Text>
        </TouchableOpacity>
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
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  freeBadgeContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  freeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  freeBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4ADE80',
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  editLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5DADE2',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  consultantDesc: {
    fontSize: 13,
    color: '#999',
    marginTop: 8,
  },
  pricingCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  pricingTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  totalPrice: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  freeConsultBadge: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  freeConsultText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4ADE80',
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  contactSubtitle: {
    fontSize: 13,
    color: '#999',
    marginBottom: 16,
  },
  whatsappRow: {
    marginBottom: 12,
  },
  whatsappLabel: {
    fontSize: 14,
    color: '#666',
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F8F8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  phoneNumber: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  changeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  changeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5DADE2',
  },
  additionalInfo: {
    fontSize: 13,
    color: '#999',
    marginBottom: 16,
  },
  noPaymentBadge: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  noPaymentText: {
    flex: 1,
    fontSize: 13,
    color: '#4ADE80',
    lineHeight: 18,
  },
  confirmButton: {
    backgroundColor: '#f6cf92',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  whyFreeButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 24,
  },
  whyFreeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5DADE2',
  },
});