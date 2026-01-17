import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import BookingModal from '@/components/BookingModal';

const YOGA_CLASSES = [
  {
    id: 1,
    time: '7:00 AM - 8:00 AM',
    name: 'Vinyasa Basic',
    guru: 'Assigned Guru',
    credits: 1,
    price: 599,
    date: 'Mon, 2 Dec',
  },
  {
    id: 2,
    time: '6:00 PM - 7:00 PM',
    name: 'Hatha Classic',
    guru: 'Guru Mira',
    credits: 1,
    price: 699,
    date: 'Mon, 2 Dec',
  },
];

const DATES = ['Mon, 2 Dec', 'Tue, 3 Dec', 'Wed, 4 Dec'];

export default function YogaScreen() {
  const [selectedTab, setSelectedTab] = useState('Classes');
  const [selectedDate, setSelectedDate] = useState('Mon, 2 Dec');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedClass, setSelectedClass] = useState(YOGA_CLASSES[0]);
  const [userCredits] = useState(6);

  const handleBookClass = (yogaClass: typeof YOGA_CLASSES[0]) => {
    setSelectedClass(yogaClass);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Yoga</Text>
          <View style={styles.creditsContainer}>
            <Ionicons name="star" size={16} color="#5DADE2" />
            <Text style={styles.creditsText}>Credits: {userCredits}</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {['Classes', 'Pricing', 'Consultation'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, selectedTab === tab && styles.activeTab]}
              onPress={() => setSelectedTab(tab)}
            >
              <Text style={[styles.tabText, selectedTab === tab && styles.activeTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Filters */}
        <View style={styles.filtersContainer}>
          <View style={styles.filterRow}>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterText}>Guru</Text>
              <Ionicons name="chevron-down" size={16} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterText}>Classes</Text>
              <Ionicons name="chevron-down" size={16} color="#666" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity>
            <Text style={styles.clearFilters}>Clear filters</Text>
          </TouchableOpacity>
        </View>

        {/* Date Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.dateScroll}
          contentContainerStyle={styles.dateScrollContent}
        >
          {DATES.map((date) => (
            <TouchableOpacity
              key={date}
              style={[styles.dateButton, selectedDate === date && styles.activeDateButton]}
              onPress={() => setSelectedDate(date)}
            >
              <Text
                style={[styles.dateText, selectedDate === date && styles.activeDateText]}
              >
                {date}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Classes List */}
        <ScrollView style={styles.classesScroll} showsVerticalScrollIndicator={false}>
          {YOGA_CLASSES.map((yogaClass) => (
            <View key={yogaClass.id} style={styles.classCard}>
              <View style={styles.classIcon}>
                <Ionicons name="body" size={24} color="#666" />
              </View>
              <View style={styles.classInfo}>
                <Text style={styles.classTime}>{yogaClass.time}</Text>
                <Text style={styles.className}>{yogaClass.name}</Text>
                <Text style={styles.classGuru}>{yogaClass.guru}</Text>
                <Text style={styles.classCredits}>{yogaClass.credits} credit</Text>
              </View>
              <TouchableOpacity
                style={styles.bookButton}
                onPress={() => handleBookClass(yogaClass)}
              >
                <Text style={styles.bookButtonText}>Book now</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Booking Modal */}
      <BookingModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        classData={selectedClass}
        userCredits={userCredits}
      />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  creditsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  creditsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5DADE2',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 16,
  },
  tab: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  activeTab: {
    backgroundColor: '#5DADE2',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  clearFilters: {
    fontSize: 13,
    color: '#5DADE2',
    fontWeight: '500',
  },
  dateScroll: {
    maxHeight: 50,
    marginBottom: 16,
  },
  dateScrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  dateButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  activeDateButton: {
    backgroundColor: '#5DADE2',
  },
  dateText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeDateText: {
    color: '#FFFFFF',
  },
  classesScroll: {
    flex: 1,
    paddingHorizontal: 20,
  },
  classCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    alignItems: 'center',
  },
  classIcon: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  classInfo: {
    flex: 1,
  },
  classTime: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  className: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
    marginBottom: 2,
  },
  classGuru: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  classCredits: {
    fontSize: 12,
    color: '#666',
  },
  bookButton: {
    backgroundColor: '#5DADE2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});