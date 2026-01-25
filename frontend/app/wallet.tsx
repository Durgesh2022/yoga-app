import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  ActivityIndicator,
  Platform,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useUser } from '../context/UserContext';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL ? `${process.env.EXPO_PUBLIC_BACKEND_URL}/api` : 'https://cosmic-healing-1.preview.emergentagent.com/api';
const RAZORPAY_KEY_ID = process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_RN3ZMbtDzMZOLC';

const AMOUNT_OPTIONS = [
  { value: 500, label: '₹500' },
  { value: 1000, label: '₹1,000' },
  { value: 2000, label: '₹2,000' },
  { value: 5000, label: '₹5,000' },
];

export default function WalletScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user, updateUser } = useUser();
  
  // Check if coming from a booking
  const bookingAmount = params.amount ? Number(params.amount) : null;
  const bookingId = params.bookingId as string;
  const serviceName = params.serviceName as string;
  const astrologerName = params.astrologerName as string;
  const bookingType = params.bookingType as string;
  const isFreeConsultation = params.isFreeConsultation === 'true';
  
  const [selectedAmount, setSelectedAmount] = useState(bookingAmount || 500);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [balance, setBalance] = useState(user?.wallet_balance || 0);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showInsufficientModal, setShowInsufficientModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [shortfall, setShortfall] = useState(0);

  // Fetch latest wallet balance
  const fetchWalletBalance = useCallback(async () => {
    if (!user?.id) return;
    try {
      const response = await fetch(`${API_URL}/wallet/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setBalance(data.balance);
        // Update user context with new balance
        if (updateUser) {
          updateUser({ ...user, wallet_balance: data.balance });
        }
      }
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchWalletBalance();
  }, [fetchWalletBalance]);

  // Get appropriate title and description based on booking type
  const getBookingTitle = () => {
    if (isFreeConsultation) return 'Consultation Booked!';
    if (bookingType === 'yoga_class') return 'Class Booking';
    if (bookingType === 'yoga_package') return 'Package Purchase';
    if (bookingType === 'yoga_consultation') return 'Consultation Booked';
    return 'Payment Required';
  };

  const getBookingDescription = () => {
    if (isFreeConsultation) {
      return `Your free yoga consultation has been scheduled. A certified yoga therapist will contact you soon.`;
    }
    if (bookingType === 'yoga_class') {
      return `${serviceName} with ${astrologerName}`;
    }
    if (bookingType === 'yoga_package') {
      return `${serviceName} - ${astrologerName}`;
    }
    return `${serviceName} with ${astrologerName}`;
  };

  // Handle Razorpay Payment
  const handleAddBalance = async () => {
    if (!user?.id) {
      Alert.alert('Error', 'Please login to add balance');
      return;
    }

    const amount = customAmount ? Number(customAmount) : selectedAmount;
    if (amount < 1) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setIsLoading(true);
    try {
      // Create Razorpay order
      const orderResponse = await fetch(`${API_URL}/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          amount: amount,
          currency: 'INR',
          purpose: 'wallet_recharge',
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderData.detail || 'Failed to create order');
      }

      // Open Razorpay checkout
      if (Platform.OS === 'web') {
        // For web, use Razorpay checkout.js
        openRazorpayWeb(orderData, amount);
      } else {
        // For mobile, use react-native-razorpay
        openRazorpayMobile(orderData, amount);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to initiate payment');
    } finally {
      setIsLoading(false);
    }
  };

  // Razorpay Web Checkout
  const openRazorpayWeb = (orderData: any, amount: number) => {
    const options = {
      key: RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'Celestials Healing',
      description: 'Wallet Recharge',
      order_id: orderData.order_id,
      handler: async (response: any) => {
        await verifyPayment(response, amount);
      },
      prefill: {
        name: user?.full_name || '',
        email: user?.email || '',
        contact: user?.phone || '',
      },
      theme: {
        color: '#f6cf92',
      },
    };

    // @ts-ignore - Razorpay is loaded via script
    if (typeof window !== 'undefined' && window.Razorpay) {
      // @ts-ignore
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      Alert.alert('Error', 'Payment gateway not available. Please try again.');
    }
  };

  // Razorpay Mobile Checkout
  const openRazorpayMobile = async (orderData: any, amount: number) => {
    try {
      const RazorpayCheckout = require('react-native-razorpay').default;
      
      const options = {
        description: 'Wallet Recharge',
        image: 'https://your-logo-url.com/logo.png',
        currency: orderData.currency,
        key: RAZORPAY_KEY_ID,
        amount: orderData.amount,
        name: 'Celestials Healing',
        order_id: orderData.order_id,
        prefill: {
          email: user?.email || '',
          contact: user?.phone || '',
          name: user?.full_name || '',
        },
        theme: { color: '#f6cf92' },
      };

      const response = await RazorpayCheckout.open(options);
      await verifyPayment(response, amount);
    } catch (error: any) {
      if (error.code !== 'PAYMENT_CANCELLED') {
        Alert.alert('Payment Failed', error.description || 'Payment was not completed');
      }
    }
  };

  // Verify Payment with Backend
  const verifyPayment = async (response: any, amount: number) => {
    setIsLoading(true);
    try {
      const verifyResponse = await fetch(`${API_URL}/payment/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user?.id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          amount: amount,
        }),
      });

      const verifyData = await verifyResponse.json();

      if (verifyData.success) {
        setBalance(verifyData.new_balance);
        if (updateUser && user) {
          updateUser({ ...user, wallet_balance: verifyData.new_balance });
        }
        setSuccessMessage(`₹${amount} added to your wallet successfully!`);
        setShowSuccessModal(true);
      } else {
        throw new Error(verifyData.message || 'Payment verification failed');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Payment verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Pay for Booking
  const handlePayForBooking = async () => {
    if (!user?.id || !bookingId || !bookingAmount) {
      Alert.alert('Error', 'Invalid booking details');
      return;
    }

    // Check if sufficient balance
    if (balance < bookingAmount) {
      setShortfall(bookingAmount - balance);
      setShowInsufficientModal(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/wallet/deduct`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          amount: bookingAmount,
          booking_id: bookingId,
          booking_type: bookingType || 'astrology',
          description: `Payment for ${serviceName} with ${astrologerName}`,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setBalance(data.new_balance);
        if (updateUser && user) {
          updateUser({ ...user, wallet_balance: data.new_balance });
        }
        setSuccessMessage(`Payment of ₹${bookingAmount} successful!\n\nYour session with ${astrologerName} for ${serviceName} has been confirmed.`);
        setShowSuccessModal(true);
      } else {
        if (data.message === 'Insufficient balance') {
          setShortfall(data.shortfall);
          setShowInsufficientModal(true);
        } else {
          throw new Error(data.message || 'Payment failed');
        }
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Payment failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Success Modal
  const SuccessModal = () => (
    <Modal visible={showSuccessModal} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={60} color="#4ADE80" />
          </View>
          <Text style={styles.modalTitle}>Payment Complete!</Text>
          <Text style={styles.modalMessage}>{successMessage}</Text>
          <Text style={styles.newBalanceText}>New Balance: ₹{balance.toLocaleString()}</Text>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => {
              setShowSuccessModal(false);
              if (bookingId) {
                // Navigate based on booking type
                if (bookingType?.includes('yoga')) {
                  router.push('/(tabs)/yoga');
                } else {
                  router.push('/(tabs)/astrology');
                }
              }
            }}
          >
            <Text style={styles.modalButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // Insufficient Balance Modal
  const InsufficientBalanceModal = () => (
    <Modal visible={showInsufficientModal} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.warningIcon}>
            <Ionicons name="wallet-outline" size={60} color="#EF4444" />
          </View>
          <Text style={styles.modalTitle}>Insufficient Balance</Text>
          <Text style={styles.modalMessage}>
            You need ₹{shortfall.toLocaleString()} more to complete this payment.
          </Text>
          <View style={styles.balanceInfo}>
            <View style={styles.balanceRow}>
              <Text style={styles.balanceLabel}>Current Balance:</Text>
              <Text style={styles.balanceValue}>₹{balance.toLocaleString()}</Text>
            </View>
            <View style={styles.balanceRow}>
              <Text style={styles.balanceLabel}>Required Amount:</Text>
              <Text style={styles.balanceValue}>₹{bookingAmount?.toLocaleString()}</Text>
            </View>
            <View style={[styles.balanceRow, styles.shortfallRow]}>
              <Text style={styles.shortfallLabel}>Shortfall:</Text>
              <Text style={styles.shortfallValue}>₹{shortfall.toLocaleString()}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.addBalanceModalButton}
            onPress={() => {
              setShowInsufficientModal(false);
              setSelectedAmount(Math.ceil(shortfall / 100) * 100); // Round up to nearest 100
            }}
          >
            <Ionicons name="add-circle-outline" size={20} color="#FFF" />
            <Text style={styles.addBalanceModalText}>Add ₹{Math.ceil(shortfall / 100) * 100} to Wallet</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelModalButton}
            onPress={() => setShowInsufficientModal(false)}
          >
            <Text style={styles.cancelModalText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Wallet</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Balance Card */}
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <Text style={styles.balanceAmount}>₹{balance.toLocaleString()}</Text>
            <View style={styles.balanceActions}>
              <TouchableOpacity 
                style={styles.historyButton}
                onPress={() => router.push('/transactions')}
              >
                <Ionicons name="time-outline" size={18} color="#f6cf92" />
                <Text style={styles.historyText}>History</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Booking Payment Card (if coming from booking) */}
          {(bookingAmount !== null || isFreeConsultation) && (
            <View style={[styles.bookingCard, isFreeConsultation && styles.freeConsultationCard]}>
              <View style={styles.bookingHeader}>
                <Ionicons 
                  name={isFreeConsultation ? "checkmark-circle" : "calendar"} 
                  size={24} 
                  color={isFreeConsultation ? "#4ADE80" : "#f6cf92"} 
                />
                <Text style={styles.bookingTitle}>{getBookingTitle()}</Text>
              </View>
              <View style={styles.bookingDetails}>
                <Text style={styles.bookingService}>{getBookingDescription()}</Text>
                {!isFreeConsultation && (
                  <Text style={styles.bookingAmount}>₹{bookingAmount}</Text>
                )}
              </View>
              {isFreeConsultation ? (
                <TouchableOpacity 
                  style={styles.viewYogaButton}
                  onPress={() => router.push('/(tabs)/yoga')}
                >
                  <Text style={styles.viewYogaText}>View Yoga Classes</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                  style={[styles.payNowButton, isLoading && styles.buttonDisabled]}
                  onPress={handlePayForBooking}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.payNowText}>Pay Now - ₹{bookingAmount}</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Add Balance Section */}
          <View style={styles.addBalanceSection}>
            <Text style={styles.sectionTitle}>Add Balance</Text>
            
            {/* Quick Amount Options */}
            <View style={styles.amountGrid}>
              {AMOUNT_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.amountOption,
                    selectedAmount === option.value && !customAmount && styles.amountOptionSelected,
                  ]}
                  onPress={() => {
                    setSelectedAmount(option.value);
                    setCustomAmount('');
                  }}
                >
                  <Text
                    style={[
                      styles.amountOptionText,
                      selectedAmount === option.value && !customAmount && styles.amountOptionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Custom Amount Input */}
            <View style={styles.customAmountContainer}>
              <Text style={styles.customLabel}>Or enter custom amount</Text>
              <View style={styles.customInputWrapper}>
                <Text style={styles.currencyPrefix}>₹</Text>
                <TextInput
                  style={styles.customInput}
                  placeholder="Enter amount"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  value={customAmount}
                  onChangeText={(text) => {
                    setCustomAmount(text);
                    if (text) setSelectedAmount(0);
                  }}
                />
              </View>
            </View>

            {/* Payment Method */}
            <View style={styles.paymentMethodSection}>
              <Text style={styles.paymentMethodTitle}>Payment Method</Text>
              <View style={styles.paymentMethods}>
                {['UPI', 'Card', 'Net Banking'].map((method) => (
                  <TouchableOpacity
                    key={method}
                    style={[
                      styles.paymentMethodOption,
                      paymentMethod === method && styles.paymentMethodSelected,
                    ]}
                    onPress={() => setPaymentMethod(method)}
                  >
                    <View style={styles.radioOuter}>
                      {paymentMethod === method && <View style={styles.radioInner} />}
                    </View>
                    <Text style={styles.paymentMethodText}>{method}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Add Balance Button */}
            <TouchableOpacity 
              style={[styles.addBalanceButton, isLoading && styles.buttonDisabled]}
              onPress={handleAddBalance}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Ionicons name="add-circle-outline" size={20} color="#FFF" />
                  <Text style={styles.addBalanceText}>
                    Add ₹{customAmount || selectedAmount} to Wallet
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {/* Security Note */}
            <View style={styles.securityNote}>
              <Ionicons name="shield-checkmark" size={16} color="#4ADE80" />
              <Text style={styles.securityText}>
                Payments are secured by Razorpay. 100% safe & secure.
              </Text>
            </View>
          </View>

          <View style={styles.bottomSpace} />
        </ScrollView>
      </View>

      {/* Modals */}
      <SuccessModal />
      <InsufficientBalanceModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
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
    fontWeight: '700',
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  balanceCard: {
    margin: 16,
    padding: 24,
    backgroundColor: '#1A1A2E',
    borderRadius: 20,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: '#f6cf92',
    marginBottom: 16,
  },
  balanceActions: {
    flexDirection: 'row',
    gap: 16,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(246,207,146,0.15)',
    borderRadius: 20,
  },
  historyText: {
    fontSize: 14,
    color: '#f6cf92',
    fontWeight: '500',
  },
  bookingCard: {
    backgroundColor: '#FFF9F0',
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f6cf92',
  },
  freeConsultationCard: {
    backgroundColor: '#E8F5E8',
    borderColor: '#4ADE80',
  },
  bookingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  bookingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  bookingDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  bookingService: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  bookingAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f6cf92',
  },
  payNowButton: {
    backgroundColor: '#f6cf92',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  payNowText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  viewYogaButton: {
    backgroundColor: '#4ADE80',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  viewYogaText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  addBalanceSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  amountGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  amountOption: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  amountOptionSelected: {
    backgroundColor: '#FFF9F0',
    borderColor: '#f6cf92',
  },
  amountOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  amountOptionTextSelected: {
    color: '#f6cf92',
  },
  customAmountContainer: {
    marginBottom: 24,
  },
  customLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  customInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  currencyPrefix: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  customInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 18,
    color: '#333',
  },
  paymentMethodSection: {
    marginBottom: 24,
  },
  paymentMethodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  paymentMethods: {
    gap: 12,
  },
  paymentMethodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  paymentMethodSelected: {},
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#f6cf92',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#f6cf92',
  },
  paymentMethodText: {
    fontSize: 15,
    color: '#333',
  },
  addBalanceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#f6cf92',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  addBalanceText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  securityText: {
    fontSize: 12,
    color: '#666',
  },
  bottomSpace: {
    height: 40,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  successIcon: {
    marginBottom: 16,
  },
  warningIcon: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  newBalanceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4ADE80',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#f6cf92',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  balanceInfo: {
    width: '100%',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  balanceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  shortfallRow: {
    borderTopWidth: 1,
    borderTopColor: '#DDD',
    paddingTop: 8,
    marginTop: 4,
    marginBottom: 0,
  },
  shortfallLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
  },
  shortfallValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#EF4444',
  },
  addBalanceModalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#f6cf92',
    paddingVertical: 14,
    borderRadius: 12,
    width: '100%',
    marginBottom: 12,
  },
  addBalanceModalText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  cancelModalButton: {
    paddingVertical: 12,
  },
  cancelModalText: {
    fontSize: 14,
    color: '#666',
  },
});
