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
import { LinearGradient } from 'expo-linear-gradient';
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
    level: 'Beginner',
  },
  {
    id: 2,
    time: '6:00 PM - 7:00 PM',
    name: 'Hatha Classic',
    guru: 'Guru Mira',
    credits: 1,
    price: 699,
    date: 'Mon, 2 Dec',
    level: 'Intermediate',
  },
  {
    id: 3,
    time: '8:00 AM - 9:00 AM',
    name: 'Power Yoga',
    guru: 'Guru Arjun',
    credits: 2,
    price: 799,
    date: 'Mon, 2 Dec',
    level: 'Advanced',
  },
];

const DATES = ['Mon, 2 Dec', 'Tue, 3 Dec', 'Wed, 4 Dec', 'Thu, 5 Dec'];

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
          <View>
            <Text style={styles.title}>Yoga</Text>
            <Text style={styles.subtitle}>Find your inner peace</Text>
          </View>
          <View style={styles.creditsContainer}>
            <Ionicons name="star" size={16} color="#f6cf92" />
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
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, selectedTab === tab && styles.activeTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
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
              activeOpacity={0.7}
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
              <LinearGradient
                colors={['#FFF9F0', '#FFE8CC']}
                style={styles.classIcon}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="body" size={28} color="#f6cf92" />
              </LinearGradient>
              <View style={styles.classInfo}>
                <View style={styles.classHeader}>
                  <Text style={styles.className}>{yogaClass.name}</Text>
                  <View style={styles.levelBadge}>
                    <Text style={styles.levelText}>{yogaClass.level}</Text>
                  </View>
                </View>
                <Text style={styles.classTime}>{yogaClass.time}</Text>
                <View style={styles.classFooter}>
                  <View style={styles.guruContainer}>
                    <Ionicons name="person-circle-outline" size={16} color="#666" />
                    <Text style={styles.classGuru}>{yogaClass.guru}</Text>
                  </View>
                  <View style={styles.creditsInfo}>
                    <Ionicons name="star" size={14} color="#f6cf92" />
                    <Text style={styles.classCredits}>{yogaClass.credits} credit</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                style={styles.bookButton}
                onPress={() => handleBookClass(yogaClass)}
                activeOpacity={0.8}
              >
                <Text style={styles.bookButtonText}>Book</Text>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
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
    backgroundColor: '#FAFAFA',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
  },
  creditsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9F0',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 6,
  },
  creditsText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f6cf92',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 10,
    backgroundColor: '#FFFFFF',
    paddingBottom: 16,
  },
  tab: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
  },
  activeTab: {
    backgroundColor: '#f6cf92',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  dateScroll: {
    maxHeight: 60,
    backgroundColor: '#FFFFFF',
    paddingBottom: 16,
  },
  dateScrollContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  dateButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  activeDateButton: {
    backgroundColor: '#FFF9F0',
    borderColor: '#f6cf92',
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeDateText: {
    color: '#f6cf92',
  },
  classesScroll: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  classCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    alignItems: 'center',
  },
  classIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  classInfo: {
    flex: 1,
  },
  classHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  className: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  levelBadge: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  levelText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#666',
  },
  classTime: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  classFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  guruContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  classGuru: {
    fontSize: 12,
    color: '#666',
  },
  creditsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  classCredits: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f6cf92',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});