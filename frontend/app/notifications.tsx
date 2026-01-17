import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function NotificationsScreen() {
  const router = useRouter();
  const [astrologyUpdates, setAstrologyUpdates] = useState(true);
  const [yogaReminders, setYogaReminders] = useState(true);
  const [reikiLaunches, setReikiLaunches] = useState(false);
  const [emailOffers, setEmailOffers] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Push Notifications Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Push notifications</Text>

            <View style={styles.notificationCard}>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>Astrology updates</Text>
                <Text style={styles.notificationDesc}>Daily insights, transit alerts</Text>
              </View>
              <Switch
                value={astrologyUpdates}
                onValueChange={setAstrologyUpdates}
                trackColor={{ false: '#E8E8E8', true: '#f6cf92' }}
                thumbColor={astrologyUpdates ? '#FFF' : '#FFF'}
              />
            </View>

            <View style={styles.notificationCard}>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>Yoga reminders</Text>
                <Text style={styles.notificationDesc}>Class reminders and streaks</Text>
              </View>
              <Switch
                value={yogaReminders}
                onValueChange={setYogaReminders}
                trackColor={{ false: '#E8E8E8', true: '#f6cf92' }}
                thumbColor={yogaReminders ? '#FFF' : '#FFF'}
              />
            </View>

            <View style={styles.notificationCard}>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>Reiki & puja launches</Text>
                <Text style={styles.notificationDesc}>New sessions and events</Text>
              </View>
              <Switch
                value={reikiLaunches}
                onValueChange={setReikiLaunches}
                trackColor={{ false: '#E8E8E8', true: '#f6cf92' }}
                thumbColor={reikiLaunches ? '#FFF' : '#FFF'}
              />
            </View>
          </View>

          {/* Promotions Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Promotions & offers</Text>

            <View style={styles.notificationCard}>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>Email offers</Text>
                <Text style={styles.notificationDesc}>Exclusive deals and updates</Text>
              </View>
              <Switch
                value={emailOffers}
                onValueChange={setEmailOffers}
                trackColor={{ false: '#E8E8E8', true: '#f6cf92' }}
                thumbColor={emailOffers ? '#FFF' : '#FFF'}
              />
            </View>
          </View>

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
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  notificationContent: {
    flex: 1,
    marginRight: 16,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  notificationDesc: {
    fontSize: 13,
    color: '#999',
  },
  bottomSpace: {
    height: 40,
  },
});
