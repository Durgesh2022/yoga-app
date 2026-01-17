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
import { useRouter } from 'expo-router';

const PRIMARY_FOCUS_OPTIONS = [
  {
    id: 'astrology',
    title: 'Astrology',
    description: 'Birth chart, transits, guidance',
  },
  {
    id: 'yoga',
    title: 'Yoga',
    description: 'Movement, breath and body',
  },
  {
    id: 'reiki',
    title: 'Reiki & energy',
    description: 'Subtle body healing',
  },
];

const SESSION_STYLE_OPTIONS = [
  {
    id: 'gentle',
    title: 'Gentle & reflective',
    description: 'Slow, spacious and calming',
  },
  {
    id: 'direct',
    title: 'Direct & actionable',
    description: 'Clear, concise guidance',
  },
];

export default function SpiritualPreferencesScreen() {
  const router = useRouter();
  const [selectedFocus, setSelectedFocus] = useState('astrology');
  const [selectedStyle, setSelectedStyle] = useState('gentle');

  const handleSavePreferences = () => {
    console.log('Preferences saved:', { selectedFocus, selectedStyle });
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Spiritual preferences</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Primary Focus Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Primary focus</Text>

            <View style={styles.optionsCard}>
              {PRIMARY_FOCUS_OPTIONS.map((option, index) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.optionItem,
                    index < PRIMARY_FOCUS_OPTIONS.length - 1 && styles.optionBorder,
                  ]}
                  onPress={() => setSelectedFocus(option.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.optionContent}>
                    <Text style={styles.optionTitle}>{option.title}</Text>
                    <Text style={styles.optionDescription}>{option.description}</Text>
                  </View>
                  <Text
                    style={[
                      styles.optionStatus,
                      selectedFocus === option.id && styles.optionStatusSelected,
                    ]}
                  >
                    {selectedFocus === option.id ? 'Selected' : 'Tap to choose'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Session Style Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Session style</Text>

            <View style={styles.optionsCard}>
              {SESSION_STYLE_OPTIONS.map((option, index) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.optionItem,
                    index < SESSION_STYLE_OPTIONS.length - 1 && styles.optionBorder,
                  ]}
                  onPress={() => setSelectedStyle(option.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.optionContent}>
                    <Text style={styles.optionTitle}>{option.title}</Text>
                    <Text style={styles.optionDescription}>{option.description}</Text>
                  </View>
                  <Text
                    style={[
                      styles.optionStatus,
                      selectedStyle === option.id && styles.optionStatusPreferred,
                    ]}
                  >
                    {selectedStyle === option.id ? 'Preferred' : ''}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.bottomSpace} />
        </ScrollView>

        {/* Save Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSavePreferences}>
            <Text style={styles.saveButtonText}>Save preferences</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
    fontWeight: '500',
    color: '#999',
    marginBottom: 12,
  },
  optionsCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  optionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#999',
  },
  optionStatus: {
    fontSize: 14,
    color: '#CCC',
    marginLeft: 12,
  },
  optionStatusSelected: {
    color: '#333',
    fontWeight: '500',
  },
  optionStatusPreferred: {
    color: '#333',
    fontWeight: '500',
  },
  bottomSpace: {
    height: 100,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#F5F5F5',
  },
  saveButton: {
    backgroundColor: '#f6cf92',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
});
