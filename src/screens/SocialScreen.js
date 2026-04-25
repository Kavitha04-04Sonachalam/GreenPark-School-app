import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SocialScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top + 20 }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1b5e20" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Social Media</Text>
        <View style={{ width: 40 }} />
      </View>
      
      <View style={styles.content}>
        <View style={styles.socialIcons}>
          <Ionicons name="logo-facebook" size={40} color="#3b5998" style={styles.socialIcon} />
          <Ionicons name="logo-instagram" size={40} color="#e1306c" style={styles.socialIcon} />
          <Ionicons name="logo-youtube" size={40} color="#ff0000" style={styles.socialIcon} />
        </View>
        <Text style={styles.title}>Connect With Us</Text>
        <Text style={styles.subtitle}>Follow our social media handles for daily updates.</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f8f4',
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1b5e20',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIcons: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  socialIcon: {
    marginHorizontal: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#1b5e20',
    textAlign: 'center',
    opacity: 0.7,
  },
});

export default SocialScreen;
