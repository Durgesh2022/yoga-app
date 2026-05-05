import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { fonts, typography } from '../../constants/theme';
import AnimatedPressable from '../../components/AnimatedPressable';
import FloatingIcon from '../../components/FloatingIcon';

export default function ReikiScreen() {
  const fadeIcon = useRef(new Animated.Value(0)).current;
  const scaleIcon = useRef(new Animated.Value(0.8)).current;
  const fadeContent = useRef(new Animated.Value(0)).current;
  const translateContent = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    const ease = Easing.bezier(0.16, 1, 0.3, 1);
    Animated.stagger(140, [
      Animated.parallel([
        Animated.timing(fadeIcon, { toValue: 1, duration: 600, easing: ease, useNativeDriver: true }),
        Animated.timing(scaleIcon, { toValue: 1, duration: 720, easing: ease, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(fadeContent, { toValue: 1, duration: 520, easing: ease, useNativeDriver: true }),
        Animated.timing(translateContent, { toValue: 0, duration: 520, easing: ease, useNativeDriver: true }),
      ]),
    ]).start();
  }, [fadeIcon, scaleIcon, fadeContent, translateContent]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Healing</Text>
          <Text style={styles.title}>Reiki</Text>
          <Text style={styles.subtitle}>Energy healing awaits</Text>
        </View>

        {/* Coming Soon Content */}
        <View style={styles.content}>
          <Animated.View style={{ opacity: fadeIcon, transform: [{ scale: scaleIcon }] }}>
            <FloatingIcon amplitude={8} duration={2800}>
              <LinearGradient
                colors={['#FFF9F0', '#FFE8CC']}
                style={styles.imageContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="hand-left" size={80} color="#f6cf92" />
              </LinearGradient>
            </FloatingIcon>
          </Animated.View>

          <Animated.View
            style={[
              { alignItems: 'center', width: '100%' },
              { opacity: fadeContent, transform: [{ translateY: translateContent }] },
            ]}
          >
            <View style={styles.badge}>
              <Ionicons name="time-outline" size={16} color="#f6cf92" />
              <Text style={styles.badgeText}>Coming Soon</Text>
            </View>

            <Text style={styles.comingSoonTitle}>Reiki Sessions Launching Soon</Text>
            <Text style={styles.description}>
              Experience gentle energy healing sessions designed to restore balance in your body, mind, and spirit. Our certified Reiki practitioners will help you find your path to wellness.
            </Text>

            <AnimatedPressable style={styles.notifyButton}>
              <Ionicons name="notifications" size={18} color="#FFFFFF" />
              <Text style={styles.notifyButtonText}>Notify me when available</Text>
            </AnimatedPressable>

            <TouchableOpacity style={styles.learnMoreButton}>
              <Text style={styles.learnMoreText}>Learn more about Reiki</Text>
              <Ionicons name="arrow-forward" size={16} color="#f6cf92" />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
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
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  imageContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#D4A574',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 18,
    elevation: 4,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9F0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    marginBottom: 20,
  },
  badgeText: {
    ...typography.captionMedium,
    fontFamily: fonts.sansSemiBold,
    color: '#f6cf92',
  },
  comingSoonTitle: {
    fontFamily: fonts.display,
    fontSize: 26,
    lineHeight: 32,
    color: '#1F1B16',
    textAlign: 'center',
    marginBottom: 14,
    letterSpacing: -0.4,
    paddingHorizontal: 8,
  },
  description: {
    ...typography.bodyLg,
    color: '#7A7065',
    textAlign: 'center',
    marginBottom: 40,
  },
  notifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f6cf92',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    width: '100%',
    gap: 8,
    marginBottom: 12,
    shadowColor: '#D4A574',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  notifyButtonText: {
    ...typography.buttonLg,
    color: '#FFFFFF',
  },
  learnMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  learnMoreText: {
    ...typography.button,
    color: '#f6cf92',
  },
});
