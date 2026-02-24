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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useUser } from '../context/UserContext';

// Only import WebView on native platforms
let WebView: any = null;
if (Platform.OS !== 'web') {
  try {
    WebView = require('react-native-webview').WebView;
  } catch (e) {
    console.log('WebView not available');
  }
}

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL
  ? `${process.env.EXPO_PUBLIC_BACKEND_URL}/api`
  : 'https://yoga-app-self.vercel.app/api';

const RAZORPAY_KEY_ID =
  process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_RN3ZMbtDzMZOLC';

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

  // Native-only state (commented out for web, but kept for native)
  const [showPaymentWebView, setShowPaymentWebView] = useState(false);
  const [paymentHtml, setPaymentHtml] = useState('');
  // End native-only state

  const [pendingAmount, setPendingAmount] = useState(0);
  const [pendingOrderId, setPendingOrderId] = useState('');
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

  // ─── NATIVE ONLY: Generate Razorpay HTML for WebView ───────────────────────
  /*
   * This function is used only on native (iOS/Android) via react-native-webview.
   * On web, we use initiateWebPayment() instead (see below).
   */
  const generateRazorpayHtml = (orderData: any, amount: number) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
        </head>
        <body>
          <div id="status" style="font-family:sans-serif;padding:20px;text-align:center;">
            <p>Opening payment gateway...</p>
          </div>
          <script>
            var options = {
              key: '${RAZORPAY_KEY_ID}',
              amount: ${amount * 100},
              currency: 'INR',
              name: 'Yoga App',
              description: 'Wallet Recharge',
              order_id: '${orderData.order_id}',
              prefill: {
                name: '${user?.name || ''}',
                email: '${user?.email || ''}',
                contact: '${user?.phone || ''}'
              },
              theme: { color: '#f6cf92' },
              handler: function(response) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'success',
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature
                }));
              },
              modal: {
                ondismiss: function() {
                  window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'dismissed' }));
                }
              }
            };
            var rzp = new Razorpay(options);
            rzp.on('payment.failed', function(response) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'failed',
                error: response.error.description
              }));
            });
            rzp.open();
          </script>
        </body>
      </html>
    `;
  };
  // ─── END NATIVE ONLY ────────────────────────────────────────────────────────

  // ─── WEB ONLY: Initiate payment via browser redirect ───────────────────────
  /*
   * On web platform, we cannot use react-native-webview.
   * Instead, we open the Razorpay checkout page in a new tab / redirect,
   * then poll the backend for payment status after the user returns.
   */
  const initiateWebPayment = async (orderData: any, amount: number) => {
    return new Promise<void>((resolve, reject) => {
      // Dynamically load the Razorpay checkout script
      const existingScript = document.getElementById('razorpay-script');
      const loadAndOpen = () => {
        const options = {
          key: RAZORPAY_KEY_ID,
          amount: amount * 100,
          currency: 'INR',
          name: 'Yoga App',
          description: 'Wallet Recharge',
          order_id: orderData.order_id,
          prefill: {
            name: user?.name || '',
            email: user?.email || '',
            contact: user?.phone || '',
          },
          theme: { color: '#f6cf92' },
          handler: async function (response: any) {
            // Payment success on web — verify on backend
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
                resolve();
              } else {
                alert(verifyData.message || 'Payment verification failed');
                reject(new Error(verifyData.message));
              }
            } catch (err) {
              alert('Payment verification failed. Please contact support.');
              reject(err);
            } finally {
              setIsLoading(false);
            }
          },
          modal: {
            ondismiss: function () {
              setIsLoading(false);
              resolve(); // user cancelled — not an error
            },
          },
        };

        // @ts-ignore — Razorpay is loaded via script tag
        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (response: any) {
          setIsLoading(false);
          alert('Payment failed: ' + response.error.description);
          reject(new Error(response.error.description));
        });
        rzp.open();
      };

      if (existingScript) {
        loadAndOpen();
      } else {
        const script = document.createElement('script');
        script.id = 'razorpay-script';
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = loadAndOpen;
        script.onerror = () => {
          setIsLoading(false);
          alert('Failed to load payment gateway. Please try again.');
          reject(new Error('Script load failed'));
        };
        document.body.appendChild(script);
      }
    });
  };
  // ─── END WEB ONLY ──────────────────────────────────────────────────────────

  // Handle Add Balance — branches by platform
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

      if (Platform.OS === 'web') {
        // ── Web: use inline Razorpay JS SDK ──
        await initiateWebPayment(orderData, amount);
      } else {
        // ── Native: use react-native-webview ──
        const html = generateRazorpayHtml(orderData, amount);
        setPaymentHtml(html);
        setPendingAmount(amount);
        setPendingOrderId(orderData.order_id);
        setShowPaymentWebView(true);
        setIsLoading(false);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to initiate payment');
      setIsLoading(false);
    }
  };

  // ─── NATIVE ONLY: Handle WebView messages ──────────────────────────────────
  /*
   * Only called from the native WebView modal. Not used on web.
   */
  const handleWebViewMessage = async (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log('Payment WebView response:', data);

      if (data.type === 'success') {
        setShowPaymentWebView(false);
        setIsLoading(true);

        const verifyResponse = await fetch(`${API_URL}/payment/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: user?.id,
            razorpay_order_id: data.razorpay_order_id,
            razorpay_payment_id: data.razorpay_payment_id,
            razorpay_signature: data.razorpay_signature,
            amount: pendingAmount,
          }),
        });
        const verifyData = await verifyResponse.json();

        if (verifyData.success) {
          setBalance(verifyData.new_balance);
          if (updateUser && user) {
            updateUser({ ...user, wallet_balance: verifyData.new_balance });
          }
          setSuccessMessage(`₹${pendingAmount} added to your wallet successfully!`);
          setShowSuccessModal(true);
        } else {
          Alert.alert('Error', verifyData.message || 'Payment verification failed');
        }
        setIsLoading(false);
      } else if (data.type === 'dismissed') {
        setShowPaymentWebView(false);
      } else if (data.type === 'failed') {
        setShowPaymentWebView(false);
        Alert.alert('Payment Failed', data.error || 'Payment was not completed');
      }
    } catch (error) {
      console.error('WebView message error:', error);
      setShowPaymentWebView(false);
    }
  };
  // ─── END NATIVE ONLY ────────────────────────────────────────────────────────

  // Handle Pay for Booking
  const handlePayForBooking = async () => {
    if (!user?.id || !bookingId || !bookingAmount) {
      Alert.alert('Error', 'Invalid booking details');
      return;
    }

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
        setSuccessMessage(
          `Payment of ₹${bookingAmount} successful!\n\nYour session with ${astrologerName} for ${serviceName} has been confirmed.`
        );
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

  // ─── NATIVE ONLY: Payment WebView Modal ────────────────────────────────────
  /*
   * Rendered only on iOS/Android. On web, showPaymentWebView is never set true.
   */
  const PaymentWebViewModal = () => {
    if (Platform.OS === 'web' || !WebView) return null;
    return (
      <Modal
        visible={showPaymentWebView}
        animationType="slide"
        onRequestClose={() => setShowPaymentWebView(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
          <View style={styles.webViewHeader}>
            <TouchableOpacity onPress={() => setShowPaymentWebView(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.webViewTitle}>Complete Payment</Text>
            <View style={{ width: 24 }} />
          </View>
          <WebView
            source={{ html: paymentHtml }}
            onMessage={handleWebViewMessage}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={styles.webViewLoading}>
                <ActivityIndicator size="large" color="#f6cf92" />
                <Text style={{ marginTop: 12, color: '#666' }}>
                  Loading payment gateway...
                </Text>
              </View>
            )}
          />
        </SafeAreaView>
      </Modal>
    );
  };
  // ─── END NATIVE ONLY ────────────────────────────────────────────────────────

  // Success Modal
  const SuccessModal = () => (
    <Modal visible={showSuccessModal} animationType="fade" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={64} color="#4ADE80" />
          </View>
          <Text style={styles.modalTitle}>Payment Complete!</Text>
          <Text style={styles.modalMessage}>{successMessage}</Text>
          <Text style={styles.newBalanceText}>
            New Balance: ₹{balance.toLocaleString()}
          </Text>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => {
              setShowSuccessModal(false);
              if (bookingId) {
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
    <Modal visible={showInsufficientModal} animationType="fade" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.warningIcon}>
            <Ionicons name="warning" size={64} color="#EF4444" />
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
              <Text style={styles.balanceValue}>
                ₹{bookingAmount?.toLocaleString()}
              </Text>
            </View>
            <View style={[styles.balanceRow, styles.shortfallRow]}>
              <Text style={styles.shortfallLabel}>Shortfall:</Text>
              <Text style={styles.shortfallValue}>
                ₹{shortfall.toLocaleString()}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.addBalanceModalButton}
            onPress={() => {
              setShowInsufficientModal(false);
              setSelectedAmount(Math.ceil(shortfall / 100) * 100);
            }}
          >
            <Ionicons name="add-circle-outline" size={20} color="#FFF" />
            <Text style={styles.addBalanceModalText}>
              Add ₹{Math.ceil(shortfall / 100) * 100} to Wallet
            </Text>
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
            <Ionicons name="arrow-back" size={20} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Wallet</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Balance Card */}
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabelText}>Available Balance</Text>
            <Text style={styles.balanceAmount}>₹{balance.toLocaleString()}</Text>
            <View style={styles.balanceActions}>
              <TouchableOpacity
                style={styles.historyButton}
                onPress={() => router.push('/transactions')}
              >
                <Ionicons name="time-outline" size={16} color="#f6cf92" />
                <Text style={styles.historyText}>History</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Booking Payment Card */}
          {(bookingAmount !== null || isFreeConsultation) && (
            <View
              style={[styles.bookingCard, isFreeConsultation && styles.freeConsultationCard]}
            >
              <View style={styles.bookingHeader}>
                <Ionicons
                  name={isFreeConsultation ? 'checkmark-circle' : 'calendar'}
                  size={24}
                  color={isFreeConsultation ? '#4ADE80' : '#f6cf92'}
                />
                <Text style={styles.bookingTitle}>{getBookingTitle()}</Text>
              </View>
              <View style={styles.bookingDetails}>
                <Text style={styles.bookingService}>{getBookingDescription()}</Text>
                {!isFreeConsultation && (
                  <Text style={styles.bookingAmountText}>₹{bookingAmount}</Text>
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
                    selectedAmount === option.value &&
                      !customAmount &&
                      styles.amountOptionSelected,
                  ]}
                  onPress={() => {
                    setSelectedAmount(option.value);
                    setCustomAmount('');
                  }}
                >
                  <Text
                    style={[
                      styles.amountOptionText,
                      selectedAmount === option.value &&
                        !customAmount &&
                        styles.amountOptionTextSelected,
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
                    style={styles.paymentMethodOption}
                    onPress={() => setPaymentMethod(method)}
                  >
                    <View style={styles.radioOuter}>
                      {paymentMethod === method && (
                        <View style={styles.radioInner} />
                      )}
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
              <Ionicons name="shield-checkmark-outline" size={14} color="#666" />
              <Text style={styles.securityText}>
                Payments are secured by Razorpay. 100% safe &amp; secure.
              </Text>
            </View>
          </View>

          <View style={styles.bottomSpace} />
        </ScrollView>

        {/* Modals */}
        {/* Native WebView modal — rendered only on iOS/Android */}
        <PaymentWebViewModal />

        <SuccessModal />
        <InsufficientBalanceModal />
      </View>
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
  balanceLabelText: {
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
  bookingAmountText: {
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
  // WebView Styles (native only)
  webViewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  webViewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  webViewLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
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
  balanceLabel: {
    fontSize: 14,
    color: '#666',
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