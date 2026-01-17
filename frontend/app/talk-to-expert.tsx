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

export default function TalkToExpertScreen() {
  const router = useRouter();
  const [connectionMethod, setConnectionMethod] = useState('Voice call (15 min)');
  const [scheduleTiming, setScheduleTiming] = useState('This evening (6-10 PM)');
  const [contextText, setContextText] = useState('');

  const handleConfirmConsultation = () => {
    router.push('/consultation-confirm');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Yoga</Text>
            <Text style={styles.headerSubtitle}>Talk to an expert</Text>
          </View>
          <View style={styles.creditsBox}>
            <Ionicons name="star" size={14} color="#f6cf92" />
            <Text style={styles.creditsText}>6</Text>
          </View>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Consultation Info */}
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>1:1 consultation call</Text>
            <Text style={styles.infoDesc}>
              Get personalized guidance from a yoga expert who'll help you find the right practice for your body and goals.
            </Text>
            
            <View style={styles.expertRow}>
              <View style={styles.expertAvatar}>
                <Ionicons name="person" size={28} color="#999" />
              </View>
              <View style={styles.expertInfo}>
                <Text style={styles.expertTitle}>Certified yoga therapist</Text>
                <Text style={styles.expertTags}>Trauma-aware & beginner friendly</Text>
                <Text style={styles.expertAvailable}>Available today</Text>
              </View>
            </View>

            <View style={styles.freeBox}>
              <Ionicons name="checkmark-circle" size={16} color="#4ADE80" />
              <Text style={styles.freeText}>Consultation is free</Text>
            </View>
          </View>

          {/* How to connect */}
          <View style={styles.section}>
            <Text style={styles.questionLabel}>How would you like to connect?</Text>
            {['Text + voice notes', 'Voice call (15 min)', 'Video call (20 min)'].map((method) => (
              <TouchableOpacity
                key={method}
                style={[
                  styles.optionButton,
                  connectionMethod === method && styles.optionSelected,
                ]}
                onPress={() => setConnectionMethod(method)}
              >
                <Text
                  style={[
                    styles.optionText,
                    connectionMethod === method && styles.optionTextSelected,
                  ]}
                >
                  {method}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* When to schedule */}
          <View style={styles.section}>
            <Text style={styles.questionLabel}>When do you want to schedule it?</Text>
            {['Within 30 mins', 'This evening (6-10 PM)', 'Tomorrow morning', 'Share my own time'].map((timing) => (
              <TouchableOpacity
                key={timing}
                style={[
                  styles.optionButton,
                  scheduleTiming === timing && styles.optionSelected,
                ]}
                onPress={() => setScheduleTiming(timing)}
              >
                <Text
                  style={[
                    styles.optionText,
                    scheduleTiming === timing && styles.optionTextSelected,
                  ]}
                >
                  {timing}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Context */}
          <View style={styles.section}>
            <Text style={styles.questionLabel}>Anything you want them to know first?</Text>
            <Text style={styles.inputSubLabel}>
              Give a short context <Text style={styles.optional}>Optional</Text>
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="Eg. I have lower back pain, sit at a desk all day, tried a few YouTube classes but felt overwhelmed."
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              maxLength={200}
              value={contextText}
              onChangeText={setContextText}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>{contextText.length}/200</Text>
          </View>

          {/* What to expect */}
          <View style={styles.expectCard}>
            <Text style={styles.expectTitle}>What to expect during the call</Text>
            <Text style={styles.expectDuration}>Takes ~15 mins</Text>
            
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

            <Text style={styles.expectNote}>
              Have a quiet space, any relevant medical notes, and your usual daily schedule in mind so your consultant can tailor things to you.
            </Text>
          </View>

          {/* Buttons */}
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmConsultation}>
            <Text style={styles.confirmButtonText}>Confirm consultation</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.creditsLink}>
            <Text style={styles.creditsLinkText}>See how credits work</Text>
          </TouchableOpacity>

          <View style={styles.bottomSpace} />
        </ScrollView>
      </View>
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
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  creditsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9F0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  creditsText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#f6cf92',
  },
  scrollView: {
    flex: 1,
  },
  infoCard: {
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  infoDesc: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  expertRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  expertAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  expertInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  expertTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  expertTags: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  expertAvailable: {
    fontSize: 13,
    color: '#4ADE80',
    fontWeight: '600',
  },
  freeBox: {
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
    padding: 16,
  },
  questionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  optionButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    marginBottom: 10,
  },
  optionSelected: {
    backgroundColor: '#E8F4F8',
    borderColor: '#f6cf92',
  },
  optionText: {
    fontSize: 15,
    color: '#666',
  },
  optionTextSelected: {
    color: '#f6cf92',
    fontWeight: '600',
  },
  inputSubLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginBottom: 8,
  },
  optional: {
    color: '#999',
    fontWeight: '400',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#000',
    minHeight: 100,
    backgroundColor: '#FFF',
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
  },
  expectCard: {
    padding: 16,
    backgroundColor: '#FFF',
  },
  expectTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  expectDuration: {
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
  expectNote: {
    fontSize: 13,
    color: '#666',
    lineHeight: 19,
    fontStyle: 'italic',
  },
  confirmButton: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: '#f6cf92',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  creditsLink: {
    alignItems: 'center',
    paddingVertical: 16,
    marginHorizontal: 16,
  },
  creditsLinkText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f6cf92',
  },
  bottomSpace: {
    height: 20,
  },
});