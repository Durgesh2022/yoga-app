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

const TRANSACTIONS = [
  {
    id: 1,
    type: 'Added balance',
    description: 'UPI',
    date: '24 Nov 2025',
    amount: 1000,
    isCredit: true,
  },
  {
    id: 2,
    type: 'Astrology session - Yatra',
    description: 'Astro Meera',
    date: '22 Nov 2025',
    amount: 800,
    isCredit: false,
  },
  {
    id: 3,
    type: 'Yoga class booking',
    description: 'Vinyasa Basic',
    date: '20 Nov 2025',
    amount: 599,
    isCredit: false,
  },
  {
    id: 4,
    type: 'Introductory Class credit',
    description: 'Yoga credit applied',
    date: '18 Nov 2025',
    amount: 0,
    isCredit: true,
  },
];

export default function TransactionsScreen() {
  const router = useRouter();
  const currentBalance = 2450;

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

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Recent Activity Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent activity</Text>

            {TRANSACTIONS.map((transaction) => (
              <View key={transaction.id} style={styles.transactionCard}>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionType}>{transaction.type}</Text>
                  <Text style={styles.transactionDesc}>
                    {transaction.description} · {transaction.date}
                  </Text>
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
            ))}
          </View>

          {/* Balance Summary Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Balance summary</Text>

            <View style={styles.balanceCard}>
              <View>
                <Text style={styles.balanceLabel}>Current balance</Text>
                <Text style={styles.balanceSubtext}>After all transactions</Text>
              </View>
              <Text style={styles.balanceAmount}>₹{currentBalance.toLocaleString()}</Text>
            </View>
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
    padding: 16,
    borderRadius: 12,
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
    fontSize: 24,
    fontWeight: '700',
    color: '#f6cf92',
  },
  bottomSpace: {
    height: 40,
  },
});
