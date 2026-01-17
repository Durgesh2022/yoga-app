import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function ReikiScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Reiki</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Coming Soon Content */}
        <View style={styles.content}>
          <View style={styles.imageContainer}>
            <Ionicons name="hand-left" size={100} color="#f6cf92" />
          </View>

          <Text style={styles.comingSoonTitle}>Reiki 13 Coming Soon</Text>
          <Text style={styles.description}>
            Gentle energy healing sessions to restore balance in body, mind and spirit. Be the
            first to know when we launch.
          </Text>

          <TouchableOpacity style={styles.notifyButton}>
            <Text style={styles.notifyButtonText}>Notify me</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  imageContainer: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#FFF9F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  comingSoonTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  notifyButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#5DADE2',
    borderRadius: 12,
    paddingHorizontal: 48,
    paddingVertical: 16,
  },
  notifyButtonText: {
    color: '#5DADE2',
    fontSize: 16,
    fontWeight: '600',
  },
});