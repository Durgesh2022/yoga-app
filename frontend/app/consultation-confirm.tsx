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
    console.log('Consultation confirmed');
    router.push('/(tabs)/yoga');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Yoga</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Free Badge */}
          <View style={styles.topBadgeContainer}>
            <View style={styles.freeBadge}>
              <Ionicons name="gift" size={16} color="#4ADE80" />
              <Text style={styles.freeBadgeText}>Consultation is free</Text>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.mainTitle}>Confirm your consultation</Text>
          <Text style={styles.subtitle}>
            Your first consultation is completely free.
          </Text>

          {/* Consultation Details */}
          <View style={styles.card}>
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

            <Text style={styles.subNote}>
              1:1 intro call to map your yoga journey.
            </Text>
          </View>

          {/* Pricing */}
          <View style={styles.card}>
            <Text style={styles.pricingLabel}>Total due now</Text>
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

            <View style={styles.freeTag}>
              <Text style={styles.freeTagText}>Free consultation</Text>
            </View>
          </View>

          {/* Contact Info */}
          <View style={styles.card}>
            <Text style={styles.contactTitle}>How we'll reach you</Text>
            <Text style={styles.contactSubtitle}>From your profile</Text>

            <Text style={styles.whatsappText}>
              We'll reach out on your saved WhatsApp number
            </Text>

            <View style={styles.phoneRow}>
              <Text style={styles.phoneNumber}>+91 98XXXXXX10</Text>
              <TouchableOpacity style={styles.changeButton}>
                <Text style={styles.changeText}>Change</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.additionalInfo}>
              We'll also use your saved name and email for reminders.
            </Text>

            <View style={styles.infoBox}>
              <Ionicons name="checkmark-circle" size={16} color="#4ADE80" />
              <Text style={styles.infoText}>
                No payment needed now. You'll only confirm the free call timing.
              </Text>
            </View>
          </View>

          {/* Buttons */}
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmBooking}>
            <Text style={styles.confirmButtonText}>Confirm & book call</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.whyFreeButton}>
            <Text style={styles.whyFreeText}>Why is this consultation free?</Text>
          </TouchableOpacity>

          <View style={styles.bottomSpace} />
        </ScrollView>
      </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  placeholder: {
    width: 24,
  },
  scrollView: {
    flex: 1,
  },
  topBadgeContainer: {
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
    color: '#000',
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
  card: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
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
    color: '#000',
  },
  editLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f6cf92',
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
    color: '#000',
    flex: 1,
    textAlign: 'right',
  },
  subNote: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
  },
  pricingLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  totalPrice: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
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
    color: '#000',
  },
  freeTag: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  freeTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4ADE80',
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  contactSubtitle: {
    fontSize: 13,
    color: '#999',
    marginBottom: 16,
  },
  whatsappText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
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
    color: '#000',
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
    color: '#f6cf92',
  },
  additionalInfo: {
    fontSize: 13,
    color: '#999',
    marginBottom: 16,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#4ADE80',
    lineHeight: 18,
  },
  confirmButton: {
    marginHorizontal: 16,
    backgroundColor: '#f6cf92',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  whyFreeButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 16,
  },
  whyFreeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f6cf92',
  },
  bottomSpace: {
    height: 20,
  },
});