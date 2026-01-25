import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useUser } from '../context/UserContext';

const AMOUNT_OPTIONS = [
  { value: 500, label: '₹500' },
  { value: 1000, label: '₹1,000' },
  { value: 2000, label: '₹2,000' },
  { value: 5000, label: '₹5,000' },
];

export default function WalletScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useUser();
  
  // Check if coming from a booking
  const bookingAmount = params.amount ? Number(params.amount) : null;
  const bookingId = params.bookingId as string;
  const serviceName = params.serviceName as string;
  const astrologerName = params.astrologerName as string;
  
  const [selectedAmount, setSelectedAmount] = useState(bookingAmount || 500);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const balance = user?.wallet_balance || 0;

  const handleAddBalance = () => {
    const amount = customAmount ? Number(customAmount) : selectedAmount;
    Alert.alert(
      'Add Balance',
      `Add ₹${amount} to your wallet?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          onPress: () => {
            Alert.alert('Success', `₹${amount} added to your wallet!`);
          }
        }
      ]
    );
  };

  const handlePayForBooking = () => {
    if (balance >= (bookingAmount || 0)) {
      Alert.alert(
        'Payment Successful',
        `Your session with ${astrologerName} for ${serviceName} has been booked!`,
        [
          { text: 'OK', onPress: () => router.push('/(tabs)/astrology') }
        ]
      );
    } else {
      Alert.alert(
        'Insufficient Balance',
        `You need ₹${(bookingAmount || 0) - balance} more. Please add funds to continue.`
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Wallet & payments</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Booking Payment Card (if coming from booking) */}
          {bookingAmount && (
            <View style={styles.bookingCard}>
              <View style={styles.bookingHeader}>
                <Ionicons name="calendar" size={24} color="#f6cf92" />
                <Text style={styles.bookingTitle}>Payment Required</Text>
              </View>
              <View style={styles.bookingDetails}>
                <Text style={styles.bookingService}>{serviceName} with {astrologerName}</Text>
                <Text style={styles.bookingAmount}>₹{bookingAmount}</Text>
              </View>
              <TouchableOpacity 
                style={styles.payNowButton}
                onPress={handlePayForBooking}
              >
                <Text style={styles.payNowText}>Pay Now</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Balance Card */}
          <View style={styles.balanceCard}>
            <View style={styles.balanceRow}>
              <View>
                <Text style={styles.balanceLabel}>Celestial's balance</Text>
                <Text style={styles.balanceAmount}>₹{balance.toLocaleString()}</Text>
                <Text style={styles.balanceSubtext}>Available for astrology, yoga & reiki</Text>
              </View>
              <View style={styles.moonIcon}>
                <Ionicons name="moon" size={32} color="#f6cf92" />
              </View>
            </View>
            <TouchableOpacity style={styles.addBalanceButton}>
              <Text style={styles.addBalanceText}>Add balance</Text>
            </TouchableOpacity>
          </View>

          {/* Choose Amount Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Choose amount</Text>
            <View style={styles.amountOptions}>
              {AMOUNT_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.amountButton,
                    selectedAmount === option.value && styles.amountButtonActive,
                  ]}
                  onPress={() => {
                    setSelectedAmount(option.value);
                    setCustomAmount('');
                  }}
                >
                  <Text
                    style={[
                      styles.amountText,
                      selectedAmount === option.value && styles.amountTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.customLabel}>Custom amount</Text>
            <View style={styles.customInputContainer}>
              <TextInput
                style={styles.customInput}
                placeholder="Enter any amount"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={customAmount}
                onChangeText={(text) => {
                  setCustomAmount(text);
                  setSelectedAmount(0);
                }}
              />
              <Text style={styles.currencySymbol}>₹</Text>
            </View>
            <Text style={styles.inputHint}>Multiples of 100 only</Text>
          </View>

          {/* Payment Method Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment method</Text>

            <TouchableOpacity
              style={styles.paymentOption}
              onPress={() => setPaymentMethod('UPI')}
            >
              <View style={styles.radioOuter}>
                {paymentMethod === 'UPI' && <View style={styles.radioInner} />}
              </View>
              <View style={styles.paymentContent}>
                <Text style={styles.paymentTitle}>UPI</Text>
                <Text style={styles.paymentSubtext}>Fast & secure · Recommended</Text>
              </View>
              <Ionicons name="phone-portrait-outline" size={24} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.paymentOption}
              onPress={() => setPaymentMethod('Debit')}
            >
              <View style={styles.radioOuter}>
                {paymentMethod === 'Debit' && <View style={styles.radioInner} />}
              </View>
              <View style={styles.paymentContent}>
                <Text style={styles.paymentTitle}>Debit card</Text>
                <Text style={styles.paymentSubtext}>Save card for future sessions</Text>
              </View>
              <Ionicons name="card-outline" size={24} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.paymentOption}
              onPress={() => setPaymentMethod('Credit')}
            >
              <View style={styles.radioOuter}>
                {paymentMethod === 'Credit' && <View style={styles.radioInner} />}
              </View>
              <View style={styles.paymentContent}>
                <Text style={styles.paymentTitle}>Credit card</Text>
                <Text style={styles.paymentSubtext}>Earn rewards while you top up</Text>
              </View>
              <Ionicons name="card-outline" size={24} color="#999" />
            </TouchableOpacity>
          </View>

          {/* Confirm Button */}
          <TouchableOpacity style={styles.confirmButton} onPress={handleAddBalance}>
            <Text style={styles.confirmButtonText}>Confirm & add balance</Text>
          </TouchableOpacity>

          {/* Transaction History Link */}
          <TouchableOpacity
            style={styles.historyLink}
            onPress={() => router.push('/transactions')}
          >
            <Text style={styles.historyLinkText}>View transaction history</Text>
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
    backgroundColor: '#F8F8F8',
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
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  balanceCard: {
    backgroundColor: '#FFF',
    margin: 16,
    padding: 20,
    borderRadius: 16,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  balanceSubtext: {
    fontSize: 12,
    color: '#999',
  },
  moonIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF9F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBalanceButton: {
    backgroundColor: '#f6cf92',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  addBalanceText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFF',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  amountOptions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  amountButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#FFF',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  amountButtonActive: {
    backgroundColor: '#f6cf92',
    borderColor: '#f6cf92',
  },
  amountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  amountTextActive: {
    color: '#FFF',
  },
  customLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginBottom: 8,
  },
  customInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    paddingHorizontal: 16,
  },
  customInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: '#000',
  },
  currencySymbol: {
    fontSize: 16,
    color: '#999',
  },
  inputHint: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#f6cf92',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#f6cf92',
  },
  paymentContent: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  paymentSubtext: {
    fontSize: 12,
    color: '#999',
  },
  confirmButton: {
    marginHorizontal: 16,
    backgroundColor: '#f6cf92',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  historyLink: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  historyLinkText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f6cf92',
  },
  bottomSpace: {
    height: 20,
  },
});
