import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useUser } from '../context/UserContext';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'https://cosmic-healing-1.preview.emergentagent.com/api';

// Helper function to get connection method label
const getConnectionMethodLabel = (id: string) => {
  const methods: { [key: string]: string } = {
    'text': 'Text + voice notes',
    'voice': 'Voice call (15 mins)',
    'video': 'Video call (20 mins)',
  };
  return methods[id] || 'Voice call (15 mins)';
};

// Helper function to get schedule timing label
const getScheduleTimingLabel = (id: string) => {
  const timings: { [key: string]: string } = {
    'now': 'Within 30 mins',
    'evening': 'This evening (6–10 PM)',
    'tomorrow': 'Tomorrow morning',
    'custom': 'Custom time',
  };
  return timings[id] || 'This evening (6–10 PM)';
};

export default function ConsultationConfirmScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  
  // Get consultation data from params
  const yogaGoal = params.yogaGoal as string || '';
  const intensityPreference = params.intensityPreference as string || 'Balanced';
  const connectionMethod = params.connectionMethod as string || 'voice';
  const scheduleTiming = params.scheduleTiming as string || 'evening';
  const contextNotes = params.contextNotes as string || '';

  const handleConfirmBooking = async () => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to book a consultation', [
        { text: 'OK', onPress: () => router.push('/') }
      ]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/yoga/consultation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          yoga_goal: yogaGoal,
          intensity_preference: intensityPreference,
          connection_method: connectionMethod,
          schedule_timing: scheduleTiming,
          context_notes: contextNotes,
          whatsapp_number: user.phone || '',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Booking failed');
      }

      // Navigate to wallet with consultation info (free consultation)
      router.push({
        pathname: '/wallet',
        params: {
          bookingId: data.id,
          amount: 0,
          serviceName: 'Yoga Consultation',
          astrologerName: 'Certified yoga therapist',
          bookingType: 'yoga_consultation',
          isFreeConsultation: 'true',
        }
      });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to book consultation');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Yoga</Text>
            <Text style={styles.headerSubtitle}>Confirm your consultation</Text>
          </View>
          <View style={styles.freeBadge}>
            <Ionicons name="star" size={14} color="#D4A574" />
            <Text style={styles.freeBadgeText}>Free</Text>
          </View>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Consultation Details Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Talk to a consultant</Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.editLink}>Edit details</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Format</Text>
              <Text style={styles.detailValue}>{getConnectionMethodLabel(connectionMethod)}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>When</Text>
              <Text style={styles.detailValue}>{getScheduleTimingLabel(scheduleTiming)}</Text>
            </View>
            
            {yogaGoal ? (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Your goal</Text>
                <Text style={styles.detailValue}>{yogaGoal}</Text>
              </View>
            ) : null}
            
            {intensityPreference ? (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Intensity</Text>
                <Text style={styles.detailValue}>{intensityPreference}</Text>
              </View>
            ) : null}

            <View style={styles.consultantRow}>
              <View style={styles.consultantAvatar}>
                <Ionicons name="person" size={20} color="#D4A574" />
              </View>
              <View style={styles.consultantInfo}>
                <Text style={styles.consultantTitle}>Certified yoga guide</Text>
                <Text style={styles.consultantDesc}>1:1 intro call to map your yoga journey</Text>
              </View>
            </View>
          </View>

          {/* Pricing Card */}
          <View style={styles.card}>
            <View style={styles.pricingHeader}>
              <Text style={styles.pricingLabel}>Total due now:</Text>
              <View style={styles.priceRow}>
                <Text style={styles.totalPrice}>₹0</Text>
                <View style={styles.freeTag}>
                  <Text style={styles.freeTagText}>Free consultation</Text>
                </View>
              </View>
            </View>

            <Text style={styles.freeNote}>Your first consultation is completely free.</Text>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Consultation fee</Text>
              <Text style={styles.detailValue}>₹0</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Taxes & charges</Text>
              <Text style={styles.detailValue}>₹0</Text>
            </View>
          </View>

          {/* Contact Info Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>How we'll reach you</Text>
              <Text style={styles.fromProfile}>From your profile</Text>
            </View>

            <Text style={styles.contactDesc}>
              We'll reach out on your saved WhatsApp number below. You can change it for this consultation if needed.
            </Text>

            <View style={styles.phoneRow}>
              <View>
                <Text style={styles.phoneLabel}>WhatsApp number</Text>
                <Text style={styles.phoneNumber}>{user?.phone || '+91 98XXXXXX10'}</Text>
              </View>
              <TouchableOpacity style={styles.changeButton}>
                <Text style={styles.changeText}>Change</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.additionalInfo}>
              We'll also use your saved name and email for reminders.
            </Text>

            <View style={styles.infoBox}>
              <View style={styles.greenDot} />
              <Text style={styles.infoText}>
                No payment needed now. You'll only confirm the free call timing.
              </Text>
            </View>
          </View>

          {/* Confirm Button */}
          <TouchableOpacity 
            style={[styles.confirmButton, isLoading && styles.confirmButtonDisabled]} 
            onPress={handleConfirmBooking}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.confirmButtonText}>Confirm & book call</Text>
            )}
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
    backgroundColor: '#FAF8F5',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0EBE3',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAF8F5',
    borderRadius: 20,
  },
  headerCenter: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D2A26',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#8B8680',
    marginTop: 2,
  },
  freeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9F0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0EBE3',
    gap: 4,
  },
  freeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D4A574',
  },
  scrollView: {
    flex: 1,
  },
  card: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#F0EBE3',
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
    color: '#2D2A26',
  },
  editLink: {
    fontSize: 14,
    fontWeight: '500',
    color: '#D4A574',
  },
  fromProfile: {
    fontSize: 12,
    color: '#A9A5A0',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  detailLabel: {
    fontSize: 14,
    color: '#8B8680',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2D2A26',
  },
  consultantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  consultantAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF9F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#F0EBE3',
  },
  consultantInfo: {
    flex: 1,
  },
  consultantTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D2A26',
    marginBottom: 2,
  },
  consultantDesc: {
    fontSize: 13,
    color: '#8B8680',
  },
  pricingHeader: {
    marginBottom: 8,
  },
  pricingLabel: {
    fontSize: 14,
    color: '#8B8680',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  totalPrice: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2D2A26',
  },
  freeTag: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  freeTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4CAF50',
  },
  freeNote: {
    fontSize: 13,
    color: '#8B8680',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0EBE3',
    marginBottom: 16,
  },
  contactDesc: {
    fontSize: 14,
    color: '#6B6560',
    lineHeight: 21,
    marginBottom: 16,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAF8F5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  phoneLabel: {
    fontSize: 13,
    color: '#8B8680',
    marginBottom: 4,
  },
  phoneNumber: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D2A26',
  },
  changeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F0EBE3',
  },
  changeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B6560',
  },
  additionalInfo: {
    fontSize: 13,
    color: '#8B8680',
    marginBottom: 16,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginTop: 5,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#4CAF50',
    lineHeight: 20,
  },
  confirmButton: {
    marginHorizontal: 16,
    marginTop: 24,
    backgroundColor: '#D4A574',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  whyFreeButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  whyFreeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#D4A574',
  },
  bottomSpace: {
    height: 30,
  },
});
