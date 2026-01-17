import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
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

const PRICING_PACKAGES = [
  {
    id: 1,
    name: 'Introductory Class',
    price: 599,
    credits: 1,
    validity: '1 week',
    description: 'Your first step into Celestials',
  },
  {
    id: 2,
    name: 'Monthly Flow Pack',
    price: 2399,
    credits: 4,
    validity: '1 month',
    description: 'Perfect for regular practice',
  },
  {
    id: 3,
    name: 'Deep Practice Pack',
    price: 6999,
    credits: 12,
    validity: '3 months',
    description: 'Deepen your practice journey',
  },
  {
    id: 4,
    name: '6-Month Journey',
    price: 10782,
    credits: 24,
    validity: '6 months',
    description: 'Transform with consistent practice',
    discount: '25% OFF',
  },
];

const DATES = ['Mon, 2 Dec', 'Tue, 3 Dec', 'Wed, 4 Dec', 'Thu, 5 Dec'];

export default function YogaScreen() {
  const [selectedTab, setSelectedTab] = useState('Classes');
  const [selectedDate, setSelectedDate] = useState('Mon, 2 Dec');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedClass, setSelectedClass] = useState(YOGA_CLASSES[0]);
  const [userCredits] = useState(6);
  
  // Consultation form states
  const [selectedGoal, setSelectedGoal] = useState('');
  const [selectedIntensity, setSelectedIntensity] = useState('Balanced');
  const [contextText, setContextText] = useState('');

  const handleBookClass = (yogaClass: typeof YOGA_CLASSES[0]) => {
    setSelectedClass(yogaClass);
    setModalVisible(true);
  };

  const renderClassesTab = () => (
    <>
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
            <Text style={[styles.dateText, selectedDate === date && styles.activeDateText]}>
              {date}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

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
    </>
  );

  const renderPricingTab = () => (
    <ScrollView style={styles.pricingScroll} showsVerticalScrollIndicator={false}>
      <View style={styles.pricingHeader}>
        <Ionicons name="information-circle-outline" size={16} color="#f6cf92" />
        <Text style={styles.creditInfo}>1 credit = ₹599 INR</Text>
      </View>

      {PRICING_PACKAGES.map((pkg) => (
        <View key={pkg.id} style={styles.pricingCard}>
          {pkg.discount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{pkg.discount}</Text>
            </View>
          )}
          <Text style={styles.packageName}>{pkg.name}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.packagePrice}>₹{pkg.price.toLocaleString()}</Text>
            <View style={styles.creditPack}>
              <Ionicons name="star" size={14} color="#f6cf92" />
              <Text style={styles.creditPackText}>{pkg.credits} credits</Text>
            </View>
          </View>
          <View style={styles.validityRow}>
            <Ionicons name="time-outline" size={14} color="#666" />
            <Text style={styles.validityText}>{pkg.validity}</Text>
          </View>
          <Text style={styles.packageDesc}>{pkg.description}</Text>
          <TouchableOpacity style={styles.buyButton} activeOpacity={0.8}>
            <Text style={styles.buyButtonText}>Buy now</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );

  const renderConsultationTab = () => (
    <ScrollView style={styles.consultationScroll} showsVerticalScrollIndicator={false}>
      <View style={styles.consultationCard}>
        <Text style={styles.consultationTitle}>Not sure which yoga is right?</Text>
        <Text style={styles.consultationDesc}>
          Answer a few questions and we'll gently guide you to a practice that suits your energy and routine.
        </Text>
      </View>

      <View style={styles.questionSection}>
        <Text style={styles.questionTitle}>What brings you to yoga?</Text>
        <View style={styles.optionsGrid}>
          {['Stress & anxiety', 'Flexibility & mobility', 'Back or neck pain', 'Better sleep', 'Energy & focus', 'Just want to try'].map((goal) => (
            <TouchableOpacity
              key={goal}
              style={[styles.optionChip, selectedGoal === goal && styles.selectedChip]}
              onPress={() => setSelectedGoal(goal)}
              activeOpacity={0.7}
            >
              <Text style={[styles.optionText, selectedGoal === goal && styles.selectedOptionText]}>
                {goal}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.questionSection}>
        <Text style={styles.questionTitle}>How intense do you want your sessions?</Text>
        <View style={styles.optionsRow}>
          {['Very gentle', 'Balanced', 'Sweaty & strong'].map((intensity) => (
            <TouchableOpacity
              key={intensity}
              style={[styles.intensityChip, selectedIntensity === intensity && styles.selectedChip]}
              onPress={() => setSelectedIntensity(intensity)}
              activeOpacity={0.7}
            >
              <Text style={[styles.optionText, selectedIntensity === intensity && styles.selectedOptionText]}>
                {intensity}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {selectedGoal && selectedIntensity && (
        <View style={styles.aiPreview}>
          <Text style={styles.aiPreviewTitle}>AI preview</Text>
          <Text style={styles.aiPreviewText}>
            Based on your selections, we'll recommend gentle-to-moderate classes that help with {selectedGoal.toLowerCase()}, combining breath work and mindful movement.
          </Text>
          <Text style={styles.aiPreviewNote}>
            You'll see exact class names, timings and credit use on the next step.
          </Text>
        </View>
      )}

      <View style={styles.expertSection}>
        <LinearGradient
          colors={['#FFF9F0', '#FFE8CC']}
          style={styles.expertCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.expertHeader}>
            <View style={styles.expertAvatar}>
              <Ionicons name="person" size={32} color="#f6cf92" />
            </View>
            <View style={styles.expertInfo}>
              <Text style={styles.expertTitle}>Talk to an expert</Text>
              <Text style={styles.expertDesc}>Chat with a certified yoga guide</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.connectButton}>
            <Text style={styles.connectButtonText}>Connect</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      <TouchableOpacity style={styles.generateButton} activeOpacity={0.8}>
        <Text style={styles.generateButtonText}>Generate my yoga plan</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.skipButton}>
        <Text style={styles.skipButtonText}>Skip for now, browse all classes</Text>
      </TouchableOpacity>
    </ScrollView>
  );

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

        {/* Tab Content */}
        {selectedTab === 'Classes' && renderClassesTab()}
        {selectedTab === 'Pricing' && renderPricingTab()}
        {selectedTab === 'Consultation' && renderConsultationTab()}
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
  // Classes Tab Styles
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
  // Pricing Tab Styles
  pricingScroll: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  pricingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  creditInfo: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  pricingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    position: 'relative',
  },
  discountBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#4ADE80',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  discountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  packageName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  packagePrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f6cf92',
  },
  creditPack: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  creditPackText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#f6cf92',
  },
  validityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  validityText: {
    fontSize: 13,
    color: '#666',
  },
  packageDesc: {
    fontSize: 13,
    color: '#999',
    marginBottom: 16,
  },
  buyButton: {
    backgroundColor: '#f6cf92',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  buyButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // Consultation Tab Styles
  consultationScroll: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  consultationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  consultationTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  consultationDesc: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  questionSection: {
    marginBottom: 24,
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  optionChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  intensityChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    alignItems: 'center',
  },
  selectedChip: {
    backgroundColor: '#f6cf92',
    borderColor: '#f6cf92',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  selectedOptionText: {
    color: '#FFFFFF',
  },
  aiPreview: {
    backgroundColor: '#F0F8FF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#5DADE2',
  },
  aiPreviewTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#5DADE2',
    marginBottom: 8,
  },
  aiPreviewText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  aiPreviewNote: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  expertSection: {
    marginBottom: 24,
  },
  expertCard: {
    borderRadius: 16,
    padding: 20,
  },
  expertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  expertAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  expertInfo: {
    flex: 1,
  },
  expertTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  expertDesc: {
    fontSize: 13,
    color: '#666',
  },
  connectButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  connectButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#f6cf92',
  },
  generateButton: {
    backgroundColor: '#f6cf92',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  skipButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f6cf92',
  },
});
