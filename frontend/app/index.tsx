import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    Easing,
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../context/UserContext';
import { fonts, typography } from '../constants/theme';

// Use full URL for Expo Go compatibility
const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL ? `${process.env.EXPO_PUBLIC_BACKEND_URL}/api` : 'https://yoga-app-self.vercel.app/api';

export default function LoginScreen() {
  const router = useRouter();
  const { setUser, user, isLoading } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fadeLogo = useRef(new Animated.Value(0)).current;
  const fadeWelcome = useRef(new Animated.Value(0)).current;
  const fadeForm = useRef(new Animated.Value(0)).current;
  const translateLogo = useRef(new Animated.Value(-12)).current;
  const translateWelcome = useRef(new Animated.Value(16)).current;
  const translateForm = useRef(new Animated.Value(20)).current;
  const loginScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!isLoading && user) {
      router.replace('/(tabs)/astrology');
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    const ease = Easing.bezier(0.16, 1, 0.3, 1);
    Animated.stagger(120, [
      Animated.parallel([
        Animated.timing(fadeLogo, { toValue: 1, duration: 520, easing: ease, useNativeDriver: true }),
        Animated.timing(translateLogo, { toValue: 0, duration: 520, easing: ease, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(fadeWelcome, { toValue: 1, duration: 520, easing: ease, useNativeDriver: true }),
        Animated.timing(translateWelcome, { toValue: 0, duration: 520, easing: ease, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(fadeForm, { toValue: 1, duration: 520, easing: ease, useNativeDriver: true }),
        Animated.timing(translateForm, { toValue: 0, duration: 520, easing: ease, useNativeDriver: true }),
      ]),
    ]).start();
  }, [fadeLogo, fadeWelcome, fadeForm, translateLogo, translateWelcome, translateForm]);

  const pressIn = () => Animated.spring(loginScale, { toValue: 0.97, useNativeDriver: true, speed: 40, bounciness: 0 }).start();
  const pressOut = () => Animated.spring(loginScale, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 6 }).start();

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    if (!password) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Login failed');
      }

      setUser(data);
      router.replace('/(tabs)/astrology');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = () => {
    router.replace('/(tabs)/astrology');
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#D4A574" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
            <View style={styles.header}>
              <View style={styles.backButton} />
              <Text style={styles.headerTitle}>Login</Text>
              <View style={styles.placeholder} />
            </View>

            <Animated.View
              style={[
                styles.logoContainer,
                { opacity: fadeLogo, transform: [{ translateY: translateLogo }] },
              ]}
            >
              <View style={styles.logoCircle}>
                <Image
                  source={require('@/assets/images/logo.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
            </Animated.View>

            <Animated.View
              style={[
                styles.welcomeContainer,
                { opacity: fadeWelcome, transform: [{ translateY: translateWelcome }] },
              ]}
            >
              <Text style={styles.welcomeTitle}>Your journey to heal starts here</Text>
              <Text style={styles.welcomeSubtitle}>
                Align your energy with the stars through astrology, yoga and reiki all in one calm space.
              </Text>
            </Animated.View>

            <Animated.View
              style={[
                styles.formContainer,
                { opacity: fadeForm, transform: [{ translateY: translateForm }] },
              ]}
            >
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#000"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Enter password"
                    placeholderTextColor="#000"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                      size={22}
                      color="#000"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <Animated.View style={{ transform: [{ scale: loginScale }] }}>
                <Pressable
                  style={[styles.loginButton, isSubmitting && styles.loginButtonDisabled]}
                  onPress={handleLogin}
                  onPressIn={pressIn}
                  onPressOut={pressOut}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.loginButtonText}>Login</Text>
                  )}
                </Pressable>
              </Animated.View>

              <TouchableOpacity
                style={styles.signupButton}
                onPress={() => router.push('/signup')}
                activeOpacity={0.8}
              >
                <Text style={styles.signupButtonText}>Sign up</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickAccessButton}
                onPress={handleQuickLogin}
              >
                <Text style={styles.quickAccessText}>Continue as Guest</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.forgotPasswordContainer}>
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
              </TouchableOpacity>
            </Animated.View>
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
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
  },
  headerTitle: {
    ...typography.h3,
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  logoCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FFF9F0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#D4A574',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  logo: {
    width: 120,
    height: 120,
  },
  welcomeContainer: {
    marginBottom: 28,
  },
  welcomeTitle: {
    fontFamily: fonts.display,
    fontSize: 26,
    lineHeight: 34,
    color: '#1F1B16',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  welcomeSubtitle: {
    ...typography.body,
    color: '#7A7065',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    ...typography.captionMedium,
    fontSize: 13,
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#000',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    fontFamily: fonts.sans,
    fontSize: 15,
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
    color: '#000',
    fontFamily: fonts.sans,
    fontSize: 15,
  },
  eyeIcon: {
    paddingHorizontal: 12,
  },
  loginButton: {
    backgroundColor: '#D4A574',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
    shadowColor: '#D4A574',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    ...typography.buttonLg,
    color: '#FFFFFF',
  },
  signupButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#D4A574',
  },
  signupButtonText: {
    ...typography.button,
    color: '#D4A574',
  },
  quickAccessButton: {
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 12,
  },
  quickAccessText: {
    ...typography.bodyMedium,
    fontSize: 13,
    color: '#666',
    textDecorationLine: 'underline',
    letterSpacing: 0.3,
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  forgotPasswordText: {
    ...typography.bodyMedium,
    color: '#D4A574',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...typography.body,
    marginTop: 12,
    color: '#666',
  },
});
