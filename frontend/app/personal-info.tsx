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

export default function PersonalInfoScreen() {
  const router = useRouter();
  const [gender, setGender] = useState('Female');
  const [phoneNumber] = useState('+91 · 98765 43210');
  const [email] = useState('ananya.celestials@example.com');
  const [dob] = useState('12 Aug 1994');
  const [location] = useState('Bengaluru, India');

  const handleSaveChanges = () => {
    console.log('Changes saved');
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Personal info</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Contact Details Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CONTACT DETAILS</Text>
            
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Phone number</Text>
                  <Text style={styles.infoValue}>{phoneNumber}</Text>
                </View>
                <TouchableOpacity>
                  <Ionicons name="create-outline" size={20} color="#999" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Email ID</Text>
                  <Text style={styles.infoValue}>{email}</Text>
                </View>
                <TouchableOpacity>
                  <Ionicons name="create-outline" size={20} color="#999" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Gender</Text>
                <View style={styles.genderOptions}>
                  {['Male', 'Female', 'Rather not say'].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.genderButton,
                        gender === option && styles.genderButtonActive,
                      ]}
                      onPress={() => setGender(option)}
                    >
                      <Text
                        style={[
                          styles.genderText,
                          gender === option && styles.genderTextActive,
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </View>

          {/* Security Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SECURITY</Text>
            
            <TouchableOpacity style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Change password</Text>
                  <Text style={styles.infoSubtext}>Last updated 3 months ago</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#CCC" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Birth & Location Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>BIRTH & LOCATION</Text>
            
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Date of birth</Text>
                  <Text style={styles.infoValue}>{dob}</Text>
                  <Text style={styles.infoSubtext}>Used for astrology & rituals</Text>
                </View>
                <TouchableOpacity>
                  <Ionicons name="calendar-outline" size={20} color="#999" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Location</Text>
                  <Text style={styles.infoValue}>{location}</Text>
                  <Text style={styles.infoSubtext}>For accurate charts & puja timings</Text>
                </View>
                <TouchableOpacity>
                  <Ionicons name="location-outline" size={20} color="#999" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
            <Text style={styles.saveButtonText}>Save changes</Text>
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
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
  },
  infoSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  genderOptions: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 10,
  },
  genderButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  genderButtonActive: {
    backgroundColor: '#f6cf92',
  },
  genderText: {
    fontSize: 14,
    color: '#666',
  },
  genderTextActive: {
    color: '#FFF',
    fontWeight: '600',
  },
  saveButton: {
    marginHorizontal: 16,
    marginTop: 32,
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
  bottomSpace: {
    height: 40,
  },
});
