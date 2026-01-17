import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function AstrologerDetailScreen() {
  const router = useRouter();
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState('Yatra');
  const [selectedServicePrice, setSelectedServicePrice] = useState(800);
  const [selectedServiceDuration, setSelectedServiceDuration] = useState('40 min');
  const [selectedDate, setSelectedDate] = useState('Mon, 2 Dec');
  const [selectedTime, setSelectedTime] = useState('7:00 PM');

  const handleAddService = (service: string, price: number, duration: string) => {
    setSelectedService(service);
    setSelectedServicePrice(price);
    setSelectedServiceDuration(duration);
    setConfirmModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Astrologer Details</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Astrologer Profile */}
        <View style={styles.profileSection}>
          <View style={styles.profileLeft}>
            <View style={styles.profileImage}>
              <Ionicons name="person" size={40} color="#999" />
            </View>
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark" size={14} color="#FFF" />
            </View>
          </View>
          
          <View style={styles.profileRight}>
            <Text style={styles.astrologerName}>Astro Meera</Text>
            
            <View style={styles.infoRow}>
              <Ionicons name="briefcase-outline" size={16} color="#666" />
              <Text style={styles.infoText}>10+ years in Vedic Astrology</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Ionicons name="moon-outline" size={16} color="#666" />
              <Text style={styles.infoText}>Expert in Tarot & Palmistry</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Ionicons name="people-outline" size={16} color="#666" />
              <Text style={styles.infoText}>5000+ consultations</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Ionicons name="chatbubble-outline" size={16} color="#666" />
              <Text style={styles.infoText}>Available in Hindi, English</Text>
            </View>
          </View>
        </View>

        {/* Aaramb - Free Trial */}
        <View style={styles.serviceItem}>
          <View style={styles.serviceLeft}>
            <View style={styles.serviceTitleRow}>
              <Text style={styles.serviceName}>Aaramb</Text>
              <View style={styles.freeTag}>
                <Text style={styles.freeTagText}>FREE</Text>
              </View>
            </View>
            <Text style={styles.serviceDuration}>Free 12-min Trial</Text>
            <Text style={styles.serviceDescription}>Quick introduction call</Text>
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => handleAddService('Aaramb', 0, '12 min')}
          >
            <Ionicons name="add" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Sutra */}
        <View style={styles.serviceItem}>
          <View style={styles.serviceLeft}>
            <Text style={styles.serviceName}>Sutra</Text>
            <Text style={styles.serviceDuration}>20 min</Text>
            <Text style={styles.serviceDescription}>Get to know yourself.</Text>
          </View>
          <View style={styles.serviceRight}>
            <Text style={styles.servicePrice}>₹400</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => handleAddService('Sutra', 400, '20 min')}
            >
              <Ionicons name="add" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Yatra - Popular */}
        <View style={styles.serviceItem}>
          <View style={styles.serviceLeft}>
            <View style={styles.serviceTitleRow}>
              <Text style={styles.serviceName}>Yatra</Text>
              <View style={styles.popularTag}>
                <Text style={styles.popularTagText}>POPULAR</Text>
              </View>
            </View>
            <Text style={styles.serviceDuration}>40 min</Text>
            <Text style={styles.serviceDescription}>Detailed life analysis</Text>
          </View>
          <View style={styles.serviceRight}>
            <Text style={styles.servicePrice}>₹800</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => handleAddService('Yatra', 800, '40 min')}
            >
              <Ionicons name="add" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Vishwas */}
        <View style={styles.serviceItem}>
          <View style={styles.serviceLeft}>
            <Text style={styles.serviceName}>Vishwas</Text>
            <Text style={styles.serviceDuration}>60 min</Text>
            <Text style={styles.serviceDescription}>Complete horoscope reading</Text>
          </View>
          <View style={styles.serviceRight}>
            <Text style={styles.servicePrice}>₹1,200</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => handleAddService('Vishwas', 1200, '60 min')}
            >
              <Ionicons name="add" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Anant */}
        <View style={styles.serviceItem}>
          <View style={styles.serviceLeft}>
            <Text style={styles.serviceName}>Anant</Text>
            <Text style={styles.serviceDuration}>90 min</Text>
            <Text style={styles.serviceDescription}>In-depth life path & future guidance</Text>
          </View>
          <View style={styles.serviceRight}>
            <Text style={styles.servicePrice}>₹1,500</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => handleAddService('Anant', 1500, '90 min')}
            >
              <Ionicons name="add" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Confirm Session Modal */}
      <Modal
        visible={confirmModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Confirm Session</Text>
              <TouchableOpacity onPress={() => setConfirmModalVisible(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Summary */}
              <Text style={styles.sectionLabel}>Summary</Text>
              <View style={styles.summaryBox}>
                <View style={styles.summaryProfile}>
                  <Ionicons name="person-circle" size={40} color="#999" />
                </View>
                <View style={styles.summaryDetails}>
                  <Text style={styles.summaryName}>Astro Meera</Text>
                  <Text style={styles.summaryService}>{selectedService} - {selectedServiceDuration}</Text>
                  <Text style={styles.summaryPrice}>₹{selectedServicePrice}</Text>
                </View>
              </View>

              {/* Choose date */}
              <Text style={styles.sectionLabel}>Choose date</Text>
              <View style={styles.tabsRow}>
                {['Mon, 2 Dec', 'Tue, 3 Dec', 'Wed, 4 D'].map((date) => (
                  <TouchableOpacity
                    key={date}
                    style={[styles.tab, selectedDate === date && styles.tabSelected]}
                    onPress={() => setSelectedDate(date)}
                  >
                    <Text style={[styles.tabText, selectedDate === date && styles.tabTextSelected]}>
                      {date}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Choose time */}
              <Text style={styles.sectionLabel}>Choose time</Text>
              <View style={styles.tabsRow}>
                {['7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM'].map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={[styles.tab, selectedTime === time && styles.tabSelected]}
                    onPress={() => setSelectedTime(time)}
                  >
                    <Text style={[styles.tabText, selectedTime === time && styles.tabTextSelected]}>
                      {time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Balance */}
              <View style={styles.balanceRow}>
                <View style={styles.balanceLeft}>
                  <Ionicons name="wallet-outline" size={20} color="#666" />
                  <Text style={styles.balanceText}>Balance: ₹2,450</Text>
                </View>
                <TouchableOpacity>
                  <Text style={styles.addFundsText}>Add funds</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            {/* Action Buttons */}
            <TouchableOpacity style={styles.proceedButton}>
              <Text style={styles.proceedButtonText}>Proceed to Checkout</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => setConfirmModalVisible(false)}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  profileSection: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  profileLeft: {
    position: 'relative',
    marginRight: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f6cf92',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  profileRight: {
    flex: 1,
    justifyContent: 'center',
  },
  astrologerName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  serviceLeft: {
    flex: 1,
  },
  serviceTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginRight: 8,
  },
  freeTag: {
    backgroundColor: '#4ADE80',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  freeTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFF',
  },
  popularTag: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  popularTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#000',
  },
  serviceDuration: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 13,
    color: '#999',
  },
  serviceRight: {
    alignItems: 'flex-end',
  },
  servicePrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f6cf92',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 12,
  },
  summaryBox: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
  },
  summaryProfile: {
    marginRight: 12,
  },
  summaryDetails: {
    flex: 1,
  },
  summaryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  summaryService: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  summaryPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  tabsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
  },
  tabSelected: {
    backgroundColor: '#f6cf92',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  tabTextSelected: {
    color: '#FFF',
    fontWeight: '600',
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 20,
  },
  balanceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  addFundsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f6cf92',
  },
  proceedButton: {
    backgroundColor: '#f6cf92',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  proceedButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  backButton: {
    backgroundColor: '#FFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#f6cf92',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f6cf92',
  },
});
