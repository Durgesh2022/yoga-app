import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL 
  ? `${process.env.EXPO_PUBLIC_BACKEND_URL}` 
  : 'https://yoga-app-self.vercel.app';

interface Transaction {
  id: string;
  type: string;
  description: string;
  date: string;
  amount: number;
  isCredit: boolean;
  status: string;
}

interface BackendTransaction {
  id?: string;
  _id?: string;
  user_id: string;
  type: 'credit' | 'debit';
  amount: number;
  balance_after: number;
  description: string;
  payment_id?: string | null;
  order_id?: string | null;
  booking_id?: string | null;
  status: string;
  created_at: string;
}

interface UserData {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  wallet_balance: number;
}

export default function TransactionsScreen() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentBalance, setCurrentBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // Try multiple possible storage keys
      let userDataString = await AsyncStorage.getItem('userData');
      
      // If not found, try alternative keys
      if (!userDataString) {
        userDataString = await AsyncStorage.getItem('user');
      }
      
      if (!userDataString) {
        userDataString = await AsyncStorage.getItem('@user');
      }

      // Debug: Log all AsyncStorage keys
      const allKeys = await AsyncStorage.getAllKeys();
      console.log('Available AsyncStorage keys:', allKeys);
      
      if (userDataString) {
        console.log('User data found:', userDataString);
        const userData: UserData = JSON.parse(userDataString);
        
        if (userData && userData.id) {
          console.log('User ID:', userData.id);
          setUserId(userData.id);
          setCurrentBalance(userData.wallet_balance || 0);
          fetchTransactions(userData.id);
          fetchWalletBalance(userData.id);
        } else {
          console.error('Invalid user data structure:', userData);
          setLoading(false);
          Alert.alert('Error', 'User session invalid. Please login again.', [
            { text: 'OK', onPress: () => router.push('/') }
          ]);
        }
      } else {
        console.error('No user data found in AsyncStorage');
        setLoading(false);
        Alert.alert('Login Required', 'Please login to view transactions.', [
          { text: 'OK', onPress: () => router.push('/') }
        ]);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setLoading(false);
      Alert.alert('Error', 'Failed to load user data. Please try again.');
    }
  };

  const fetchTransactions = async (uid: string) => {
    try {
      setLoading(true);
      const apiUrl = `${API_BASE_URL}/api/wallet/${uid}/transactions?limit=50`;
      console.log('Fetching transactions from:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      console.log('Response headers:', response.headers);
      
      // Get response text first to see what's actually returned
      const responseText = await response.text();
      console.log('Response text:', responseText.substring(0, 200)); // First 200 chars
      
      if (!response.ok) {
        console.error('API Error - Status:', response.status);
        console.error('API Error - Response:', responseText);
        throw new Error(`API returned ${response.status}: ${responseText.substring(0, 100)}`);
      }
      
      // Parse the response
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('Successfully parsed response data');
      } catch (parseError) {
        console.error('Failed to parse JSON:', parseError);
        throw new Error('Invalid JSON response from server');
      }
      
      if (data.transactions && Array.isArray(data.transactions)) {
        console.log('Number of transactions:', data.transactions.length);
        
        if (data.transactions.length === 0) {
          console.log('No transactions found for user');
          setTransactions([]);
        } else {
          // Transform backend transactions to frontend format
          const formattedTransactions: Transaction[] = data.transactions.map((txn: BackendTransaction) => ({
            id: txn.id || txn._id || '',
            type: getTransactionType(txn),
            description: getTransactionDescription(txn),
            date: formatDate(txn.created_at),
            amount: txn.amount,
            isCredit: txn.type === 'credit',
            status: txn.status,
          }));
          
          console.log('Successfully formatted', formattedTransactions.length, 'transactions');
          setTransactions(formattedTransactions);
        }
      } else {
        console.warn('Response does not contain transactions array:', data);
        setTransactions([]);
      }
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      
      // More user-friendly error messages
      let errorMessage = 'Failed to load transactions.';
      if (error.message.includes('Network request failed')) {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Request timeout. Please try again.';
      } else if (error.message.includes('500')) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchWalletBalance = async (uid: string) => {
    try {
      const apiUrl = `${API_BASE_URL}/api/wallet/${uid}`;
      console.log('Fetching wallet balance from:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Wallet balance response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Wallet balance API error:', errorText);
        return; // Don't throw, just return
      }
      
      const data = await response.json();
      console.log('Wallet balance data:', data);
      
      if (data.balance !== undefined) {
        console.log('Setting balance to:', data.balance);
        setCurrentBalance(data.balance);
      }
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      // Don't show alert for balance fetch errors, just log them
    }
  };

  const getTransactionType = (txn: BackendTransaction): string => {
    if (txn.type === 'credit') {
      if (txn.description.includes('Razorpay') || txn.description.includes('recharge')) {
        return 'Wallet Recharge';
      } else if (txn.description.includes('manual') || txn.description.includes('Manual')) {
        return 'Balance Added';
      } else if (txn.description.includes('Admin') || txn.description.includes('admin')) {
        return 'Admin Credit';
      } else {
        return 'Credit';
      }
    } else {
      // Debit transactions
      if (txn.description.includes('Astrology') || txn.description.includes('astrology')) {
        return 'Astrology Session';
      } else if (txn.description.includes('Yoga class') || txn.description.includes('yoga class')) {
        return 'Yoga Class Booking';
      } else if (txn.description.includes('Package') || txn.description.includes('package')) {
        return 'Package Purchase';
      } else if (txn.description.includes('Consultation') || txn.description.includes('consultation')) {
        return 'Consultation';
      } else {
        return 'Payment';
      }
    }
  };

  const getTransactionDescription = (txn: BackendTransaction): string => {
    const desc = txn.description || '';
    
    if (txn.type === 'credit') {
      if (desc.includes('Razorpay')) {
        // Check if there's a payment_id to show
        if (txn.payment_id) {
          return `Payment ID: ${txn.payment_id.slice(-8)}`;
        }
        return 'UPI / Card Payment';
      } else if (desc.includes('manual') || desc.includes('Manual')) {
        return 'Manual credit';
      } else if (desc.includes('Admin') || desc.includes('admin')) {
        return 'Admin adjustment';
      }
      return 'Payment received';
    } else {
      // For debit, extract the meaningful part
      if (txn.booking_id) {
        return `Booking ID: ${txn.booking_id.slice(0, 8)}`;
      }
      // Try to extract service name from description
      const parts = desc.split(' - ');
      if (parts.length > 1) {
        return parts[1].substring(0, 30);
      }
      return desc.replace('Wallet deduction for ', '').substring(0, 30);
    }
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const day = date.getDate();
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    if (userId) {
      fetchTransactions(userId);
      fetchWalletBalance(userId);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#f6cf92" />
          <Text style={styles.loadingText}>Loading transactions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Transaction history</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#f6cf92"
              colors={["#f6cf92"]}
            />
          }
        >
          {/* Balance Summary Section - Moved to top */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Current balance</Text>
            <View style={styles.balanceCard}>
              <View>
                <Text style={styles.balanceLabel}>Available balance</Text>
                <Text style={styles.balanceSubtext}>After all transactions</Text>
              </View>
              <Text style={styles.balanceAmount}>₹{currentBalance.toLocaleString()}</Text>
            </View>
          </View>

          {/* Recent Activity Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent activity</Text>

            {transactions.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="receipt-outline" size={48} color="#CCC" />
                <Text style={styles.emptyStateText}>No transactions yet</Text>
                <Text style={styles.emptyStateSubtext}>
                  Your transaction history will appear here
                </Text>
              </View>
            ) : (
              transactions.map((transaction) => (
                <View key={transaction.id} style={styles.transactionCard}>
                  <View style={styles.transactionLeft}>
                    <View
                      style={[
                        styles.iconContainer,
                        transaction.isCredit ? styles.creditIcon : styles.debitIcon,
                      ]}
                    >
                      <Ionicons
                        name={transaction.isCredit ? 'add' : 'remove'}
                        size={20}
                        color={transaction.isCredit ? '#4ADE80' : '#EF4444'}
                      />
                    </View>
                    <View style={styles.transactionInfo}>
                      <Text style={styles.transactionType}>{transaction.type}</Text>
                      <Text style={styles.transactionDesc}>
                        {transaction.description} · {transaction.date}
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={[
                      styles.transactionAmount,
                      transaction.isCredit ? styles.creditAmount : styles.debitAmount,
                    ]}
                  >
                    {transaction.amount === 0
                      ? '₹0'
                      : transaction.isCredit
                      ? `+₹${transaction.amount.toLocaleString()}`
                      : `-₹${transaction.amount.toLocaleString()}`}
                  </Text>
                </View>
              ))
            )}
          </View>

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
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
  section: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 16,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  creditIcon: {
    backgroundColor: '#DCFCE7',
  },
  debitIcon: {
    backgroundColor: '#FEE2E2',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionType: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  transactionDesc: {
    fontSize: 13,
    color: '#999',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  creditAmount: {
    color: '#4ADE80',
  },
  debitAmount: {
    color: '#EF4444',
  },
  balanceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  balanceSubtext: {
    fontSize: 12,
    color: '#999',
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: '#f6cf92',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  bottomSpace: {
    height: 40,
  },
});
