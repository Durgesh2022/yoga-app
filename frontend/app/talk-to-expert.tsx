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
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function TalkToExpertScreen() {
  const router = useRouter();
  const [connectionMethod, setConnectionMethod] = useState('Voice call (15 min)');
  const [scheduleTiming, setScheduleTiming] = useState('This evening (6-10 PM)');
  const [contextText, setContextText] = useState('');
  const [userCredits] = useState(6);

  const handleConfirmConsultation = () => {
    router.push('/consultation-confirm');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.title}>Yoga</Text>
            <Text style={styles.subtitle}>Talk to an expert</Text>
          </View>
          <View style={styles.creditsContainer}>
            <Ionicons name="star" size={14} color="#f6cf92" />
            <Text style={styles.creditsText}>{userCredits}</Text>
          </View>
        </View>

        {/* Expert Info Card */}
        <View style={styles.expertCard}>
          <Text style={styles.consultationType}>1:1 consultation call</Text>
          <Text style={styles.consultationDesc}>
            Get personalized guidance from a yoga expert who'll help you find the right practice for your body and goals.
          </Text>
          
          <View style={styles.expertProfile}>
            <View style={styles.expertAvatar}>
              <Ionicons name="person" size={32} color="#f6cf92" />
            </View>
            <View style={styles.expertInfo}>
              <Text style={styles.expertTitle}>Certified yoga therapist</Text>
              <Text style={styles.expertTags}>Trauma-aware & beginner friendly</Text>
              <Text style={styles.availability}>Available today</Text>
            </View>
          </View>

          <View style={styles.freeBadge}>
            <Ionicons name="checkmark-circle" size={16} color="#4ADE80" />
            <Text style={styles.freeText}>Consultation is free</Text>
          </View>
        </View>

        {/* Connection Method */}
        <View style={styles.section}>
          <Text style={styles.questionTitle}>How would you like to connect?</Text>
          <View style={styles.optionsColumn}>
            {['Text + voice notes', 'Voice call (15 min)', 'Video call (20 min)'].map((method) => (
              <TouchableOpacity
                key={method}
                style={[styles.optionButton, connectionMethod === method && styles.selectedOption]}
                onPress={() => setConnectionMethod(method)}
                activeOpacity={0.7}
              >
                <Text style={[styles.optionText, connectionMethod === method && styles.selectedOptionText]}>
                  {method}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Scheduling */}
        <View style={styles.section}>
          <Text style={styles.questionTitle}>When do you want to schedule it?</Text>
          <View style={styles.optionsColumn}>
            {['Within 30 mins', 'This evening (6-10 PM)', 'Tomorrow morning', 'Share my own time'].map((timing) => (
              <TouchableOpacity
                key={timing}
                style={[styles.optionButton, scheduleTiming === timing && styles.selectedOption]}
                onPress={() => setScheduleTiming(timing)}
                activeOpacity={0.7}
              >
                <Text style={[styles.optionText, scheduleTiming === timing && styles.selectedOptionText]}>
                  {timing}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Context Input */}
        <View style={styles.section}>
          <Text style={styles.questionTitle}>Anything you want them to know first?</Text>
          <Text style={styles.inputLabel}>Give a short context <Text style={styles.optional}>Optional</Text></Text>
          <TextInput
            style={styles.textArea}
            placeholder="Eg. I have lower back pain, sit at a desk all day, tried a few YouTube classes but felt overwhelmed."
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            maxLength={200}
            value={contextText}
            onChangeText={setContextText}
          />
          <Text style={styles.charCount}>{contextText.length}/200</Text>
        </View>

        {/* What to Expect */}
        <View style={styles.expectSection}>
          <Text style={styles.expectTitle}>What to expect during the call</Text>
          <Text style={styles.duration}>Takes ~15 mins</Text>
          
          <View style={styles.expectList}>
            <View style={styles.expectItem}>
              <View style={styles.bulletDot} />
              <Text style={styles.expectText}>
                Deep dive into reasons for seeking yoga, past injuries/conditions.
              </Text>
            </View>
            <View style={styles.expectItem}>
              <View style={styles.bulletDot} />
              <Text style={styles.expectText}>
                Discussion of previous experience with yoga/meditation, time availability.
              </Text>
            </View>
            <View style={styles.expectItem}>
              <View style={styles.bulletDot} />
              <Text style={styles.expectText}>
                Decision on practice types (Hatha, Yin, Restorative, chair-based, breath-focused).
              </Text>
            </View>
            <View style={styles.expectItem}>
              <View style={styles.bulletDot} />
              <Text style={styles.expectText}>
                Outcome: 1-3 class recommendations, safe frequency, tips for listening to the body.
              </Text>
            </View>
          </View>

          <Text style={styles.guidance}>
            Have a quiet space, any relevant medical notes, and your usual daily schedule in mind so your consultant can tailor things to you.
          </Text>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirmConsultation}
          activeOpacity={0.8}
        >
          <Text style={styles.confirmButtonText}>Confirm consultation</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.creditsLink}>
          <Text style={styles.creditsLinkText}>See how credits work</Text>
        </TouchableOpacity>
      </ScrollView>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  creditsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  creditsText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#f6cf92',
  },
  expertCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 16,
    padding: 20,
    borderRadius: 16,
  },
  consultationType: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  consultationDesc: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  expertProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  expertAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF9F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  expertInfo: {
    flex: 1,
  },
  expertTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  expertTags: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  availability: {
    fontSize: 13,
    color: '#4ADE80',
    fontWeight: '600',
  },
  freeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 6,
  },
  freeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4ADE80',
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  optionsColumn: {
    gap: 10,
  },
  optionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
  },
  selectedOption: {
    backgroundColor: '#E8F4F8',
    borderColor: '#5DADE2',
  },
  optionText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#666',
  },
  selectedOptionText: {
    color: '#5DADE2',
    fontWeight: '600',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  optional: {
    color: '#999',
    fontWeight: '400',
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    padding: 12,
    fontSize: 14,
    color: '#333',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
  },
  expectSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 24,
    padding: 20,
    borderRadius: 16,
  },
  expectTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
  },
  duration: {
    fontSize: 13,
    color: '#999',
    marginBottom: 16,
  },
  expectList: {
    marginBottom: 16,
  },
  expectItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#f6cf92',
    marginTop: 6,
    marginRight: 10,
  },
  expectText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  guidance: {
    fontSize: 13,
    color: '#666',
    lineHeight: 19,
    fontStyle: 'italic',
  },
  confirmButton: {
    backgroundColor: '#f6cf92',
    marginHorizontal: 20,
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  creditsLink: {
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 24,
  },
  creditsLinkText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5DADE2',
  },
});