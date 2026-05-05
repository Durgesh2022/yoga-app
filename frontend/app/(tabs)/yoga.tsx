import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import BookingModal from '@/components/BookingModal';
import PackageConfirmModal from '@/components/PackageConfirmModal';
import AnimatedPressable from '../../components/AnimatedPressable';
import StaggerItem from '../../components/StaggerItem';
import { fonts, typography } from '../../constants/theme';
import { useUser } from '../../context/UserContext';

const YOGA_TABS = ['Classes', 'Pricing', 'Consultation'] as const;

// Helper function to get next 4 days including today
const getNext4Days = () => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dates = [];
  
  for (let i = 0; i < 4; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const dayName = days[date.getDay()];
    const dayNum = date.getDate();
    const monthName = months[date.getMonth()];
    dates.push(`${dayName}, ${dayNum} ${monthName}`);
  }
  
  return dates;
};

const DATES = getNext4Days();

const YOGA_CLASSES = [
  {
    id: 1,
    time: '7:00 AM - 8:00 AM',
    name: 'Vinyasa Basic',
    guru: 'Assigned Guru',
    credits: 1,
    price: 599,
    date: DATES[0],
    level: 'Beginner',
  },
  {
    id: 2,
    time: '6:00 PM - 7:00 PM',
    name: 'Hatha Classic',
    guru: 'Guru Mira',
    credits: 1,
    price: 699,
    date: DATES[0],
    level: 'Intermediate',
  },
  {
    id: 3,
    time: '8:00 AM - 9:00 AM',
    name: 'Power Yoga',
    guru: 'Guru Arjun',
    credits: 2,
    price: 799,
    date: DATES[0],
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
    description: 'Your first step into Celestials. Try your very first group yoga class at no extra cost to help guide you towards the class that best suits your pace and energy. This class is valid for one week from the date of purchase.',
    mode: 'Online',
    showFree: true,
  },
  {
    id: 3,
    name: 'Monthly Flow Pack',
    price: 2399,
    credits: 4,
    validity: '1 month',
    description: 'Stay consistent with 4 classes over a month.',
  },
  {
    id: 4,
    name: 'Deep Practice Pack',
    price: 6999,
    credits: 12,
    validity: '3 months',
    description: 'Build a deeper habit. 12 credits. Validity: 3 months.',
  },
  {
    id: 5,
    name: '6-Month Journey',
    price: 10782,
    credits: 24,
    validity: '6 months',
    description: 'Commit to a deep, long-term practice with 24 classes. Ideal for transformative growth. validity: validity: 6 months.',
    discount: '25% OFF',
  },
];

const PRIVATE_SESSIONS = [
  {
    id: 1,
    name: '1 on 1 Class',
    price: 5999,
    credits: 10,
    validity: '2 weeks',
    description: 'Discover your unique yoga journey with a dedicated personal session.',
    mode: 'Online',
  },
  {
    id: 2,
    name: '1 on 1 Sound therapy',
    price: 7200,
    credits: 12,
    validity: '2 weeks',
    description: 'Immerse yourself in harmony and relaxation with a private sound bath yoga experience. (This session is valid for two weeks from the date of purchase.)',
    mode: 'Online',
  },
];

export default function YogaScreen() {
  const router = useRouter();
  const { user } = useUser();
  const [selectedTab, setSelectedTab] = useState('Classes');
  const [selectedDate, setSelectedDate] = useState(DATES[0]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedClass, setSelectedClass] = useState(YOGA_CLASSES[0]);
  const [userCredits] = useState(6);
  const [sessionType, setSessionType] = useState('Group class');
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  
  // Consultation form states
  const [selectedGoal, setSelectedGoal] = useState('');
  const [selectedIntensity, setSelectedIntensity] = useState('Balanced');

  const fadeIn = useRef(new Animated.Value(0)).current;
  const translateIn = useRef(new Animated.Value(12)).current;
  const tabIndicator = useRef(new Animated.Value(0)).current;
  const [tabsWidth, setTabsWidth] = useState(0);

  useEffect(() => {
    const ease = Easing.bezier(0.16, 1, 0.3, 1);
    Animated.parallel([
      Animated.timing(fadeIn, { toValue: 1, duration: 480, easing: ease, useNativeDriver: true }),
      Animated.timing(translateIn, { toValue: 0, duration: 480, easing: ease, useNativeDriver: true }),
    ]).start();
  }, [fadeIn, translateIn]);

  useEffect(() => {
    const idx = YOGA_TABS.indexOf(selectedTab as any);
    Animated.spring(tabIndicator, {
      toValue: idx >= 0 ? idx : 0,
      useNativeDriver: true,
      speed: 18,
      bounciness: 6,
    }).start();
  }, [selectedTab, tabIndicator]);

  const handleBookClass = (yogaClass: typeof YOGA_CLASSES[0]) => {
    setSelectedClass(yogaClass);
    setModalVisible(true);
  };

  const handleBuyPackage = (pkg: any) => {
    setSelectedPackage(pkg);
    setConfirmModalVisible(true);
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
        {YOGA_CLASSES.map((yogaClass, idx) => (
          <StaggerItem key={yogaClass.id} index={idx} step={80} translateY={16}>
            <AnimatedPressable style={styles.classCard} onPress={() => handleBookClass(yogaClass)}>
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
              <View style={styles.bookButton}>
                <Text style={styles.bookButtonText}>Book</Text>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </View>
            </AnimatedPressable>
          </StaggerItem>
        ))}
      </ScrollView>
    </>
  );

  const renderPricingTab = () => (
    <View style={styles.pricingContainer}>
      {/* Sidebar for Session Type Selection */}
      <View style={styles.sidebarContainer}>
        <TouchableOpacity
          style={[styles.sidebarOption, sessionType === 'Group class' && styles.sidebarOptionActive]}
          onPress={() => setSessionType('Group class')}
          activeOpacity={0.7}
        >
          <Text style={[styles.sidebarOptionText, sessionType === 'Group class' && styles.sidebarOptionTextActive]}>
            Group class
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sidebarOption, sessionType === 'Private Session' && styles.sidebarOptionActive]}
          onPress={() => setSessionType('Private Session')}
          activeOpacity={0.7}
        >
          <Text style={[styles.sidebarOptionText, sessionType === 'Private Session' && styles.sidebarOptionTextActive]}>
            Private Session
          </Text>
        </TouchableOpacity>
      </View>

      {/* Pricing Content */}
      <ScrollView style={styles.pricingScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.pricingHeader}>
          <Ionicons name="information-circle-outline" size={16} color="#f6cf92" />
          <Text style={styles.creditInfo}>1 credit = ₹599 INR</Text>
        </View>

        {sessionType === 'Group class' ? (
          PRICING_PACKAGES.map((pkg) => (
            <View key={pkg.id} style={styles.pricingCard}>
              {pkg.discount && (
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>{pkg.discount}</Text>
                </View>
              )}
              
              {/* Package Header */}
              <View style={styles.cardHeader}>
                <Text style={styles.packageName}>{pkg.name}</Text>
                {pkg.showFree && (
                  <View style={styles.freeBadge}>
                    <Text style={styles.freeText}>FREE</Text>
                  </View>
                )}
              </View>
              
              {/* Price Section */}
              <View style={styles.priceSection}>
                <Text style={styles.sectionHeading}>Price</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.packagePrice}>₹{pkg.price.toLocaleString()}</Text>
                </View>
              </View>
              
              {/* Credit Pack Section */}
              <View style={styles.creditSection}>
                <Text style={styles.sectionHeading}>Credit Pack</Text>
                <View style={styles.creditBadge}>
                  <Ionicons name="star" size={12} color="#f6cf92" />
                  <Text style={styles.creditPackText}>{pkg.credits} {pkg.credits === 1 ? 'credit' : 'credits'}</Text>
                </View>
              </View>
              
              {/* Validity Section */}
              <View style={styles.validitySection}>
                <Text style={styles.sectionHeading}>Validity</Text>
                <View style={styles.detailItem}>
                  <Ionicons name="time-outline" size={14} color="#666" />
                  <Text style={styles.detailText}>{pkg.validity}</Text>
                </View>
              </View>
              
              {/* Mode Section */}
              {pkg.mode && (
                <View style={styles.locationSection}>
                  <Text style={styles.sectionHeading}>Mode</Text>
                  <View style={styles.detailItem}>
                    <Ionicons name="videocam-outline" size={14} color="#666" />
                    <Text style={styles.detailText}>{pkg.mode}</Text>
                  </View>
                </View>
              )}
              
              {/* Description Section */}
              <View style={styles.descriptionSection}>
                <Text style={styles.sectionHeading}>Description</Text>
                <Text style={styles.packageDesc}>{pkg.description}</Text>
              </View>
              
              <TouchableOpacity 
                style={styles.buyButton} 
                activeOpacity={0.8}
                onPress={() => handleBuyPackage(pkg)}
              >
                <Text style={styles.buyButtonText}>Buy now</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          PRIVATE_SESSIONS.map((session) => (
            <View key={session.id} style={styles.pricingCard}>
              {/* Package Header */}
              <View style={styles.cardHeader}>
                <Text style={styles.packageName}>{session.name}</Text>
              </View>
              
              {/* Price Section */}
              <View style={styles.priceSection}>
                <Text style={styles.sectionHeading}>Price</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.packagePrice}>₹{session.price.toLocaleString()}</Text>
                </View>
              </View>
              
              {/* Credit Pack Section */}
              <View style={styles.creditSection}>
                <Text style={styles.sectionHeading}>Credit Pack</Text>
                <View style={styles.creditBadge}>
                  <Ionicons name="star" size={12} color="#f6cf92" />
                  <Text style={styles.creditPackText}>{session.credits} credits</Text>
                </View>
              </View>
              
              {/* Validity Section */}
              <View style={styles.validitySection}>
                <Text style={styles.sectionHeading}>Validity</Text>
                <View style={styles.detailItem}>
                  <Ionicons name="time-outline" size={14} color="#666" />
                  <Text style={styles.detailText}>{session.validity}</Text>
                </View>
              </View>
              
              {/* Mode Section */}
              <View style={styles.locationSection}>
                <Text style={styles.sectionHeading}>Mode</Text>
                <View style={styles.detailItem}>
                  <Ionicons name="videocam-outline" size={14} color="#666" />
                  <Text style={styles.detailText}>{session.mode}</Text>
                </View>
              </View>
              
              {/* Description Section */}
              <View style={styles.descriptionSection}>
                <Text style={styles.sectionHeading}>Description</Text>
                <Text style={styles.packageDesc}>{session.description}</Text>
              </View>
              
              <TouchableOpacity 
                style={styles.buyButton} 
                activeOpacity={0.8}
                onPress={() => handleBuyPackage(session)}
              >
                <Text style={styles.buyButtonText}>Buy now</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
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
          <TouchableOpacity 
            style={styles.connectButton}
            onPress={() => router.push({
              pathname: '/talk-to-expert',
              params: {
                yogaGoal: selectedGoal,
                intensityPreference: selectedIntensity,
              }
            })}
          >
            <Text style={styles.connectButtonText}>Connect</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      <TouchableOpacity 
        style={styles.skipButton}
        onPress={() => setSelectedTab('Classes')}
      >
        <Text style={styles.skipButtonText}>Skip for now, browse all classes</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            { opacity: fadeIn, transform: [{ translateY: translateIn }] },
          ]}
        >
          <View>
            <Text style={styles.eyebrow}>Practice</Text>
            <Text style={styles.title}>Yoga</Text>
            <Text style={styles.subtitle}>Find your inner peace</Text>
          </View>
          <AnimatedPressable
            style={styles.balanceContainer}
            onPress={() => router.push('/wallet')}
          >
            <Ionicons name="wallet-outline" size={20} color="#FFFFFF" />
            <Text style={styles.balanceText}>₹{user?.wallet_balance || 0}</Text>
          </AnimatedPressable>
        </Animated.View>

        {/* Tabs */}
        <View
          style={styles.tabsContainer}
          onLayout={(e) => setTabsWidth(e.nativeEvent.layout.width - 40)}
        >
          {tabsWidth > 0 && (
            <Animated.View
              style={[
                styles.tabPill,
                {
                  width: tabsWidth / YOGA_TABS.length,
                  transform: [
                    {
                      translateX: tabIndicator.interpolate({
                        inputRange: [0, YOGA_TABS.length - 1],
                        outputRange: [0, (tabsWidth / YOGA_TABS.length) * (YOGA_TABS.length - 1)],
                      }),
                    },
                  ],
                },
              ]}
            />
          )}
          {YOGA_TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={styles.tab}
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

      {/* Package Confirmation Modal */}
      {selectedPackage && (
        <PackageConfirmModal
          visible={confirmModalVisible}
          onClose={() => setConfirmModalVisible(false)}
          packageData={selectedPackage}
          paymentMethod={paymentMethod}
          onPaymentMethodChange={setPaymentMethod}
          sessionType={sessionType}
        />
      )}
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
  eyebrow: {
    ...typography.overline,
    color: '#C9956C',
    marginBottom: 4,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 30,
    lineHeight: 36,
    color: '#1F1B16',
    letterSpacing: -0.4,
  },
  subtitle: {
    ...typography.body,
    color: '#9A8F84',
    marginTop: 4,
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
    fontFamily: fonts.sansBold,
    fontSize: 13,
    color: '#f6cf92',
    letterSpacing: 0.2,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C9956C',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 8,
    shadowColor: '#C9956C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  balanceText: {
    fontFamily: fonts.sansBold,
    fontSize: 15,
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: '#FFFFFF',
    paddingBottom: 16,
    position: 'relative',
  },
  tabPill: {
    position: 'absolute',
    left: 20,
    top: 16,
    bottom: 16,
    borderRadius: 24,
    backgroundColor: '#f6cf92',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: 'transparent',
  },
  tabText: {
    ...typography.button,
    fontSize: 13,
    color: '#666',
  },
  activeTabText: {
    fontFamily: fonts.sansSemiBold,
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
    ...typography.button,
    fontSize: 13,
    color: '#666',
  },
  activeDateText: {
    fontFamily: fonts.sansSemiBold,
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
    fontFamily: fonts.serif,
    fontSize: 17,
    lineHeight: 22,
    color: '#1F1B16',
    letterSpacing: -0.1,
  },
  levelBadge: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  levelText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 10,
    color: '#666',
    letterSpacing: 0.4,
  },
  classTime: {
    ...typography.body,
    fontSize: 13,
    color: '#7A7065',
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
    fontFamily: fonts.sans,
    fontSize: 12,
    color: '#666',
  },
  creditsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  classCredits: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 12,
    color: '#666',
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
    ...typography.button,
    color: '#FFFFFF',
  },
  pricingContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebarContainer: {
    width: 140,
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRightWidth: 1,
    borderRightColor: '#F0F0F0',
  },
  sidebarOption: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  sidebarOptionActive: {
    backgroundColor: '#FFF9F0',
  },
  sidebarOptionText: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: '#666',
  },
  sidebarOptionTextActive: {
    fontFamily: fonts.sansBold,
    color: '#f6cf92',
  },
  pricingScroll: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  pricingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  creditInfo: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: '#666',
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
    zIndex: 1,
  },
  discountText: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  packageName: {
    fontFamily: fonts.serif,
    fontSize: 19,
    lineHeight: 24,
    color: '#1F1B16',
    flex: 1,
    letterSpacing: -0.2,
  },
  freeBadge: {
    backgroundColor: '#4ADE80',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  freeText: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    color: '#FFFFFF',
    letterSpacing: 0.6,
  },
  sectionHeading: {
    ...typography.overline,
    color: '#9A8F84',
    marginBottom: 8,
  },
  priceSection: {
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  packagePrice: {
    fontFamily: fonts.display,
    fontSize: 28,
    lineHeight: 32,
    color: '#C9956C',
    letterSpacing: -0.5,
  },
  creditSection: {
    marginBottom: 16,
  },
  creditBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9F0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
    alignSelf: 'flex-start',
  },
  creditPackText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 12,
    color: '#f6cf92',
  },
  validitySection: {
    marginBottom: 16,
  },
  locationSection: {
    marginBottom: 16,
  },
  descriptionSection: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    ...typography.body,
    fontSize: 13,
    color: '#666',
  },
  packageDesc: {
    ...typography.body,
    fontSize: 13,
    color: '#7A7065',
  },
  buyButton: {
    backgroundColor: '#f6cf92',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buyButtonText: {
    ...typography.buttonLg,
    color: '#FFFFFF',
  },
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
    fontFamily: fonts.display,
    fontSize: 20,
    lineHeight: 26,
    color: '#1F1B16',
    marginBottom: 10,
    letterSpacing: -0.2,
  },
  consultationDesc: {
    ...typography.body,
    color: '#7A7065',
  },
  questionSection: {
    marginBottom: 24,
  },
  questionTitle: {
    fontFamily: fonts.serif,
    fontSize: 17,
    lineHeight: 22,
    color: '#1F1B16',
    marginBottom: 12,
    letterSpacing: -0.1,
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
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: '#666',
  },
  selectedOptionText: {
    fontFamily: fonts.sansSemiBold,
    color: '#FFFFFF',
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
    fontFamily: fonts.serif,
    fontSize: 17,
    lineHeight: 22,
    color: '#1F1B16',
    letterSpacing: -0.1,
  },
  expertDesc: {
    ...typography.body,
    fontSize: 13,
    color: '#7A7065',
  },
  connectButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  connectButtonText: {
    ...typography.buttonLg,
    color: '#f6cf92',
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  skipButtonText: {
    ...typography.button,
    color: '#f6cf92',
  },
});
