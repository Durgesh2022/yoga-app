import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../context/UserContext';

// Use full URL for Expo Go compatibility
const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL ? `${process.env.EXPO_PUBLIC_BACKEND_URL}/api` : 'https://yoga-app-self.vercel.app/api';

const GENDER_OPTIONS = ['Male', 'Female', 'Others'];

export default function SignupScreen() {
  const router = useRouter();
  const { setUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  
  // Basic info
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Additional profile info
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [timeOfBirth, setTimeOfBirth] = useState('');
  const [location, setLocation] = useState('');
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
  const [tempDay, setTempDay] = useState(new Date().getDate());
  const [tempMonth, setTempMonth] = useState(new Date().getMonth() + 1);
  const [tempYear, setTempYear] = useState(new Date().getFullYear());
  const [tempHour, setTempHour] = useState(12);
  const [tempMinute, setTempMinute] = useState(0);
  const [tempPeriod, setTempPeriod] = useState<'AM' | 'PM'>('AM');

  const getDaysInMonth = (month: number, year: number) => new Date(year, month, 0).getDate();

  const parseDateString = (value: string) => {
    const parts = value.split('/').map(Number);
    if (parts.length !== 3) return new Date();
    const [day, month, year] = parts;
    return new Date(year, month - 1, day);
  };

  const parseTimeString = (value: string) => {
    const match = value.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
    if (!match) return new Date();
    let hour = Number(match[1]);
    const minute = Number(match[2]);
    const period = match[3].toUpperCase();
    if (hour === 12) hour = 0;
    if (period === 'PM') hour += 12;
    const date = new Date();
    date.setHours(hour, minute, 0, 0);
    return date;
  };

  const formatDateString = (day: number, month: number, year: number) =>
    `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;

  const formatTimeString = (hour: number, minute: number, period: 'AM' | 'PM') => {
    const fixedHour = String(hour).padStart(2, '0');
    const fixedMinute = String(minute).padStart(2, '0');
    return `${fixedHour}:${fixedMinute} ${period}`;
  };

  const openDatePicker = () => {
    const date = dateOfBirth ? parseDateString(dateOfBirth) : new Date();
    setTempDay(date.getDate());
    setTempMonth(date.getMonth() + 1);
    setTempYear(date.getFullYear());
    setIsDatePickerVisible(true);
  };

  const openTimePicker = () => {
    const date = timeOfBirth ? parseTimeString(timeOfBirth) : new Date();
    let hour = date.getHours();
    const minute = date.getMinutes();
    const period: 'AM' | 'PM' = hour >= 12 ? 'PM' : 'AM';
    if (hour === 0) hour = 12;
    else if (hour > 12) hour -= 12;
    setTempHour(hour);
    setTempMinute(minute);
    setTempPeriod(period);
    setIsTimePickerVisible(true);
  };

  const validateForm = () => {
    if (!fullName.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return false;
    }
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return false;
    }
    if (!phone.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return false;
    }
    if (!password) {
      Alert.alert('Error', 'Please enter a password');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: fullName,
          email: email,
          phone: phone,
          password: password,
          gender: gender || null,
          date_of_birth: dateOfBirth || null,
          time_of_birth: timeOfBirth || null,
          location: location || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Signup failed');
      }

      // Save user data to context and navigate to app
      setUser(data);
      router.replace('/(tabs)/astrology');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <Ionicons name="chevron-back" size={24} color="#333" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Create Account</Text>
              <View style={styles.placeholder} />
            </View>

            {/* Logo Section */}
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Image
                  source={require('@/assets/images/logo.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
            </View>

            {/* Welcome Text */}
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeTitle}>Begin your healing journey</Text>
              <Text style={styles.welcomeSubtitle}>
                Create your account and discover inner peace through celestial wisdom.
              </Text>
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
              {/* Section: Basic Info */}
              <Text style={styles.sectionLabel}>BASIC INFORMATION</Text>
              
              {/* Full Name */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Full name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your full name"
                  placeholderTextColor="#000"
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                />
              </View>

              {/* Email */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#000"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Phone */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Phone number *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your phone number"
                  placeholderTextColor="#000"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>

              {/* Password */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password *</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Create password (min 6 characters)"
                    placeholderTextColor="#000"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                      size={22}
                      color="#000"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Confirm password *</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Confirm your password"
                    placeholderTextColor="#000"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                      size={22}
                      color="#000"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Section: Profile Info */}
              <Text style={[styles.sectionLabel, { marginTop: 24 }]}>PROFILE DETAILS (Optional)</Text>

              {/* Gender */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Gender</Text>
                <View style={styles.genderContainer}>
                  {GENDER_OPTIONS.map((option) => (
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

              {/* Date of Birth */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Date of birth</Text>
                <TouchableOpacity
                  style={styles.input}
                  activeOpacity={0.8}
                  onPress={openDatePicker}
                >
                  <Text style={[styles.inputText, !dateOfBirth && styles.inputPlaceholder]}>
                    {dateOfBirth || 'Select your date of birth'}
                  </Text>
                </TouchableOpacity>
                <Text style={styles.inputHint}>Used for astrology & rituals</Text>
              </View>

              {/* Time of Birth */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Time of birth</Text>
                <TouchableOpacity
                  style={styles.input}
                  activeOpacity={0.8}
                  onPress={openTimePicker}
                >
                  <Text style={[styles.inputText, !timeOfBirth && styles.inputPlaceholder]}>
                    {timeOfBirth || 'Select your time of birth'}
                  </Text>
                </TouchableOpacity>
                <Text style={styles.inputHint}>Important for accurate birth chart calculations</Text>
              </View>

              {/* Location */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Location</Text>
                <TextInput
                  style={styles.input}
                  placeholder="City, Country"
                  placeholderTextColor="#000"
                  value={location}
                  onChangeText={setLocation}
                />
                <Text style={styles.inputHint}>For accurate charts & puja timings</Text>
              </View>

              {/* Sign Up Button */}
              <Modal
                visible={isDatePickerVisible}
                animationType="fade"
                transparent
                onRequestClose={() => setIsDatePickerVisible(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Select date of birth</Text>
                    <View style={styles.pickerRow}>
                      <View style={styles.pickerColumn}>
                        <Text style={styles.pickerLabel}>Day</Text>
                        <TouchableOpacity
                          style={styles.pickerButton}
                          onPress={() => setTempDay((prev) => Math.max(prev - 1, 1))}
                        >
                          <Text style={styles.pickerButtonText}>–</Text>
                        </TouchableOpacity>
                        <Text style={styles.pickerValue}>{tempDay}</Text>
                        <TouchableOpacity
                          style={styles.pickerButton}
                          onPress={() =>
                            setTempDay((prev) => Math.min(prev + 1, getDaysInMonth(tempMonth, tempYear)))
                          }
                        >
                          <Text style={styles.pickerButtonText}>+</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.pickerColumn}>
                        <Text style={styles.pickerLabel}>Month</Text>
                        <TouchableOpacity
                          style={styles.pickerButton}
                          onPress={() => setTempMonth((prev) => Math.max(prev - 1, 1))}
                        >
                          <Text style={styles.pickerButtonText}>–</Text>
                        </TouchableOpacity>
                        <Text style={styles.pickerValue}>{tempMonth}</Text>
                        <TouchableOpacity
                          style={styles.pickerButton}
                          onPress={() => setTempMonth((prev) => Math.min(prev + 1, 12))}
                        >
                          <Text style={styles.pickerButtonText}>+</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.pickerColumn}>
                        <Text style={styles.pickerLabel}>Year</Text>
                        <TouchableOpacity
                          style={styles.pickerButton}
                          onPress={() => setTempYear((prev) => Math.max(prev - 1, 1900))}
                        >
                          <Text style={styles.pickerButtonText}>–</Text>
                        </TouchableOpacity>
                        <Text style={styles.pickerValue}>{tempYear}</Text>
                        <TouchableOpacity
                          style={styles.pickerButton}
                          onPress={() => setTempYear((prev) => Math.min(prev + 1, new Date().getFullYear()))}
                        >
                          <Text style={styles.pickerButtonText}>+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={styles.pickerActions}>
                      <TouchableOpacity
                        style={[styles.pickerActionButton, styles.cancelButton]}
                        onPress={() => setIsDatePickerVisible(false)}
                      >
                        <Text style={[styles.pickerActionText, styles.cancelText]}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.pickerActionButton}
                        onPress={() => {
                          setDateOfBirth(formatDateString(tempDay, tempMonth, tempYear));
                          setIsDatePickerVisible(false);
                        }}
                      >
                        <Text style={styles.pickerActionText}>Set Date</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>

              <Modal
                visible={isTimePickerVisible}
                animationType="fade"
                transparent
                onRequestClose={() => setIsTimePickerVisible(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Select time of birth</Text>
                    <View style={styles.pickerRow}>
                      <View style={styles.pickerColumn}>
                        <Text style={styles.pickerLabel}>Hour</Text>
                        <TouchableOpacity
                          style={styles.pickerButton}
                          onPress={() => setTempHour((prev) => (prev === 1 ? 12 : prev - 1))}
                        >
                          <Text style={styles.pickerButtonText}>–</Text>
                        </TouchableOpacity>
                        <Text style={styles.pickerValue}>{tempHour}</Text>
                        <TouchableOpacity
                          style={styles.pickerButton}
                          onPress={() => setTempHour((prev) => (prev === 12 ? 1 : prev + 1))}
                        >
                          <Text style={styles.pickerButtonText}>+</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.pickerColumn}>
                        <Text style={styles.pickerLabel}>Minute</Text>
                        <TouchableOpacity
                          style={styles.pickerButton}
                          onPress={() => setTempMinute((prev) => (prev === 0 ? 59 : prev - 1))}
                        >
                          <Text style={styles.pickerButtonText}>–</Text>
                        </TouchableOpacity>
                        <Text style={styles.pickerValue}>{String(tempMinute).padStart(2, '0')}</Text>
                        <TouchableOpacity
                          style={styles.pickerButton}
                          onPress={() => setTempMinute((prev) => (prev === 59 ? 0 : prev + 1))}
                        >
                          <Text style={styles.pickerButtonText}>+</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.pickerColumn}>
                        <Text style={styles.pickerLabel}>AM/PM</Text>
                        <TouchableOpacity
                          style={styles.pickerButton}
                          onPress={() => setTempPeriod((prev) => (prev === 'AM' ? 'PM' : 'AM'))}
                        >
                          <Text style={styles.pickerButtonText}>⇄</Text>
                        </TouchableOpacity>
                        <Text style={styles.pickerValue}>{tempPeriod}</Text>
                        <View style={{ height: 42, width: 42 }} />
                      </View>
                    </View>
                    <View style={styles.pickerActions}>
                      <TouchableOpacity
                        style={[styles.pickerActionButton, styles.cancelButton]}
                        onPress={() => setIsTimePickerVisible(false)}
                      >
                        <Text style={[styles.pickerActionText, styles.cancelText]}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.pickerActionButton}
                        onPress={() => {
                          setTimeOfBirth(formatTimeString(tempHour, tempMinute, tempPeriod));
                          setIsTimePickerVisible(false);
                        }}
                      >
                        <Text style={styles.pickerActionText}>Set Time</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>

              <TouchableOpacity
                style={[styles.signupButton, isLoading && styles.signupButtonDisabled]}
                onPress={handleSignup}
                activeOpacity={0.8}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.signupButtonText}>Create Account</Text>
                )}
              </TouchableOpacity>

              {/* Login Link */}
              <View style={styles.loginLinkContainer}>
                <Text style={styles.loginLinkText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => router.back()}>
                  <Text style={styles.loginLink}>Login</Text>
                </TouchableOpacity>
              </View>
            </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  placeholder: {
    width: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFF9F0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#f6cf92',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  logo: {
    width: 80,
    height: 80,
  },
  welcomeContainer: {
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  formContainer: {
    width: '100%',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#999',
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#000',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#000',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  inputHint: {
    fontSize: 12,
    color: '#999',
    marginTop: 6,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#000',
  },
  eyeIcon: {
    paddingHorizontal: 12,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  genderButtonActive: {
    backgroundColor: '#D4A574',
    borderColor: '#D4A574',
  },
  genderText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  genderTextActive: {
    color: '#FFF',
    fontWeight: '600',
  },
  signupButton: {
    backgroundColor: '#D4A574',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
    shadowColor: '#D4A574',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  signupButtonDisabled: {
    opacity: 0.7,
  },
  signupButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  loginLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  inputText: {
    fontSize: 15,
    color: '#000',
  },
  inputPlaceholder: {
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 16,
    textAlign: 'center',
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  pickerColumn: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  pickerLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  pickerValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111',
    marginVertical: 10,
  },
  pickerButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerButtonText: {
    fontSize: 24,
    color: '#111',
  },
  pickerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pickerActionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#D4A574',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  pickerActionText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  cancelButton: {
    backgroundColor: '#F2F2F2',
  },
  cancelText: {
    color: '#111',
  },
  loginLinkText: {
    fontSize: 14,
    color: '#666',
  },
  loginLink: {
    fontSize: 14,
    color: '#D4A574',
    fontWeight: '600',
  },
});
