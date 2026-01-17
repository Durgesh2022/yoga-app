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

const CONNECTION_METHODS = [
  { id: 'text', label: 'Text + voice notes' },
  { id: 'voice', label: 'Voice call (15 min)' },
  { id: 'video', label: 'Video call (20 min)' },
];

const SCHEDULE_OPTIONS = [
  { id: 'now', label: 'Within 30 mins' },
  { id: 'evening', label: 'This evening (6-10 PM)' },
  { id: 'tomorrow', label: 'Tomorrow morning' },
  { id: 'custom', label: 'Share my own time' },
];

export default function TalkToExpertScreen() {
  const router = useRouter();
  const [connectionMethod, setConnectionMethod] = useState('text');
  const [scheduleTiming, setScheduleTiming] = useState('now');
  const [contextText, setContextText] = useState('');

  const handleConfirmConsultation = () => {
    router.push('/consultation-confirm');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Yoga</Text>
            <Text style={styles.headerSubtitle}>Talk to an expert</Text>
          </View>
          <View style={styles.creditsBox}>
            <Ionicons name="star" size={14} color="#D4A574" />
            <Text style={styles.creditsText}>Credits: 6</Text>
          </View>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Consultation Info Card */}
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>1:1 consultation call</Text>
            <Text style={styles.infoDesc}>
              A certified yoga consultant will help you choose the safest, most supportive start to your practice.
            </Text>
            
            <View style={styles.expertRow}>
              <View style={styles.expertAvatar}>
                <Ionicons name="person" size={24} color="#D4A574" />
              </View>
              <View style={styles.expertInfo}>
                <Text style={styles.expertTitle}>Certified yoga therapist</Text>
                <Text style={styles.expertTags}>Trauma-aware & beginner friendly</Text>
                <Text style={styles.expertAvailable}>Available today</Text>
              </View>
            </View>

            <Text style={styles.freeLabel}>Consultation is free</Text>
          </View>

          {/* How to connect */}
          <View style={styles.section}>
            <Text style={styles.questionLabel}>How would you like to connect?</Text>
            <View style={styles.optionRow}>
              {CONNECTION_METHODS.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.optionChip,
                    connectionMethod === method.id && styles.optionChipSelected,
                  ]}
                  onPress={() => setConnectionMethod(method.id)}
                >
                  <Text
                    style={[
                      styles.optionChipText,
                      connectionMethod === method.id && styles.optionChipTextSelected,
                    ]}
                  >
                    {method.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* When to schedule */}
          <View style={styles.section}>
            <Text style={styles.questionLabel}>When do you want to schedule it?</Text>
            <View style={styles.scheduleGrid}>
              {SCHEDULE_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.scheduleChip,
                    scheduleTiming === option.id && styles.scheduleChipSelected,
                  ]}
                  onPress={() => setScheduleTiming(option.id)}
                >
                  <Text
                    style={[
                      styles.scheduleChipText,
                      scheduleTiming === option.id && styles.scheduleChipTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Context */}
          <View style={styles.section}>
            <View style={styles.contextHeader}>
              <Text style={styles.questionLabel}>Anything you want them to know first?</Text>
              <Text style={styles.optionalText}>Optional</Text>
            </View>
            <View style={styles.contextInputContainer}>
              <Text style={styles.contextPlaceholder}>Give a short context</Text>
              <Text style={styles.charCount}>{contextText.length}/200</Text>
            </View>
            <TextInput
              style={styles.textInput}
              placeholder="Eg. I have lower back pain, sit at a desk all day, tried a few YouTube classes but felt overwhelmed."
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
              maxLength={200}
              value={contextText}
              onChangeText={setContextText}
              textAlignVertical="top"
            />
          </View>

          {/* What to expect */}
          <View style={styles.expectCard}>
            <View style={styles.expectHeader}>
              <Text style={styles.expectTitle}>What to expect during the call</Text>
              <Text style={styles.expectDuration}>Takes ~15 mins</Text>
            </View>
            
            <View style={styles.expectList}>
              <View style={styles.expectItem}>
                <View style={styles.bulletDot} />
                <Text style={styles.expectText}>
                  Your consultant will take a gentle deep dive into why you are seeking yoga now, how you want to feel, and any past injuries or health conditions.
                </Text>
              </View>
              <View style={styles.expectItem}>
                <View style={styles.bulletDot} />
                <Text style={styles.expectText}>
                  They will ask about your previous experience with yoga, meditation or fitness (if any) and how much time you realistically have in a week.
                </Text>
              </View>
              <View style={styles.expectItem}>
                <View style={styles.bulletDot} />
                <Text style={styles.expectText}>
                  Together you will decide whether to start with gentle Hatha, Yin, Restorative, chair-based or breath-focused practices.
                </Text>
              </View>
              <View style={styles.expectItem}>
                <View style={styles.bulletDot} />
                <Text style={styles.expectText}>
                  You will leave the call with 1-3 concrete class recommendations, a safe starting frequency, and tips on how to listen to your body.
                </Text>
              </View>
            </View>

            <Text style={styles.expectNote}>
              Have a quiet space, any relevant medical notes, and your usual daily schedule in mind so your consultant can tailor things to you.
            </Text>
          </View>

          {/* Confirm Button */}
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
    backgroundColor: '#FAF8F5',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0EBE3',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAF8F5',
    borderRadius: 20,
  },
  headerCenter: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D2A26',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#8B8680',
    marginTop: 2,
  },
  creditsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9F0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F0EBE3',
    gap: 6,
  },
  creditsText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#D4A574',
  },
  scrollView: {
    flex: 1,
  },
  infoCard: {
    padding: 20,
    backgroundColor: '#FFF',
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D2A26',
    marginBottom: 8,
  },
  infoDesc: {
    fontSize: 14,
    color: '#6B6560',
    lineHeight: 21,
    marginBottom: 20,
  },
  expertRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  expertAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFF9F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 2,
    borderColor: '#F0EBE3',
  },
  expertInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  expertTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D2A26',
    marginBottom: 3,
  },
  expertTags: {
    fontSize: 13,
    color: '#8B8680',
    marginBottom: 3,
  },
  expertAvailable: {
    fontSize: 13,
    color: '#8B8680',
  },
  freeLabel: {
    fontSize: 13,
    color: '#8B8680',
  },
  section: {
    padding: 20,
    backgroundColor: '#FFF',
    marginBottom: 8,
  },
  questionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D2A26',
    marginBottom: 16,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionChip: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: '#E8E4DE',
  },
  optionChipSelected: {
    backgroundColor: '#D4A574',
    borderColor: '#D4A574',
  },
  optionChipText: {
    fontSize: 14,
    color: '#6B6560',
    fontWeight: '500',
  },
  optionChipTextSelected: {
    color: '#FFF',
    fontWeight: '600',
  },
  scheduleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  scheduleChip: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: '#E8E4DE',
    minWidth: '45%',
  },
  scheduleChipSelected: {
    backgroundColor: '#D4A574',
    borderColor: '#D4A574',
  },
  scheduleChipText: {
    fontSize: 14,
    color: '#6B6560',
    fontWeight: '500',
    textAlign: 'center',
  },
  scheduleChipTextSelected: {
    color: '#FFF',
    fontWeight: '600',
  },
  contextHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionalText: {
    fontSize: 13,
    color: '#A9A5A0',
  },
  contextInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  contextPlaceholder: {
    fontSize: 14,
    color: '#8B8680',
  },
  charCount: {
    fontSize: 13,
    color: '#A9A5A0',
  },
  textInput: {
    borderWidth: 0,
    fontSize: 14,
    color: '#999',
    minHeight: 60,
    backgroundColor: '#FFF',
  },
  expectCard: {
    padding: 20,
    backgroundColor: '#FAF8F5',
    marginHorizontal: 0,
  },
  expectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  expectTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D2A26',
  },
  expectDuration: {
    fontSize: 13,
    color: '#8B8680',
  },
  expectList: {
    marginBottom: 16,
  },
  expectItem: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D4A574',
    marginTop: 7,
    marginRight: 12,
  },
  expectText: {
    flex: 1,
    fontSize: 14,
    color: '#6B6560',
    lineHeight: 21,
  },
  expectNote: {
    fontSize: 13,
    color: '#8B8680',
    lineHeight: 19,
  },
  confirmButton: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: '#D4A574',
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
  },
  creditsLinkText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D4A574',
  },
  bottomSpace: {
    height: 30,
  },
});
