import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DashboardScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userJson = await AsyncStorage.getItem('user');
        if (userJson) {
          setUserData(JSON.parse(userJson));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const ServiceCard = ({ title, icon, screen }) => (
    <TouchableOpacity
      style={styles.serviceCard}
      onPress={() => navigation.navigate(screen)}
      activeOpacity={0.7}
    >
      <View style={styles.serviceIconContainer}>
        <Text style={styles.serviceEmoji}>{icon}</Text>
      </View>
      <Text style={styles.serviceTitle}>{title}</Text>
      <View style={styles.yellowIndicator} />
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2e7d32" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No user data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View style={styles.headerCard}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.welcomeText}>Welcome,</Text>
              <Text style={styles.userName}>{userData.name}</Text>
            </View>
            <View style={styles.headerAccentLine} />
          </View>
        </View>

        {/* Profile Card Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Guardian Profile</Text>
          <View style={styles.profileCard}>
            <View style={styles.profileContent}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Parent Name</Text>
                <Text style={styles.detailValue}>{userData.name}</Text>
              </View>
              <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.detailLabel}>Phone Number</Text>
                <Text style={styles.detailValue}>{userData.phone_number}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Services Grid Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>School Services</Text>
          <View style={styles.servicesGrid}>
            <ServiceCard title="Attendance" icon="📊" screen="Attendance" />
            <ServiceCard title="Fees" icon="💰" screen="Fees" />
            <ServiceCard title="Marks" icon="📝" screen="Marks" />
            <ServiceCard title="Notifications" icon="🔔" screen="Notifications" />
          </View>
        </View>

        {/* Children Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Children</Text>
          {userData.children && userData.children.length > 0 ? (
            userData.children.map((child, index) => (
              <View key={index} style={styles.childCard}>
                <View style={styles.childIconCircle}>
                  <Text style={styles.childEmoji}>🎓</Text>
                </View>
                <View style={styles.childTextContainer}>
                  <Text style={styles.childName}>{child.name}</Text>
                  <Text style={styles.childInfo}>
                    {child.class_name || child.grade || 'Class not available'}
                  </Text>
                </View>
                <View style={styles.childYellowBadge} />
              </View>
            ))
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No children records found</Text>
            </View>
          )}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f8f4',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f8f4',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    fontWeight: '500',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 5,
    paddingBottom: 20,
  },
  headerCard: {
    backgroundColor: '#2e7d32',
    padding: 24,
    borderRadius: 20,
    marginTop: 20,
    marginBottom: 20,

    shadowColor: '#1b5e20',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    color: '#ffffff',
    fontSize: 15,
    opacity: 0.85,
    fontWeight: '500',
  },
  userName: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 2,
  },
  headerAccentLine: {
    width: 4,
    height: 40,
    backgroundColor: '#fbc02d',
    borderRadius: 2,
  },
  section: {
    marginBottom: 25,
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1b5e20',
    marginBottom: 16,
    marginLeft: 4,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    borderLeftWidth: 5,
    borderLeftColor: '#fbc02d',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  profileContent: {
    padding: 16,
  },
  detailRow: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f8f4',
    paddingBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: '#66bb6a',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 16,
    color: '#1b5e20',
    fontWeight: '700',
    marginTop: 2,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  serviceCard: {
    backgroundColor: '#ffffff',
    width: '48%',
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  serviceIconContainer: {
    width: 50,
    height: 50,
    backgroundColor: '#fff8e1',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  serviceEmoji: {
    fontSize: 24,
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1b5e20',
  },
  yellowIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#fbc02d',
  },
  childCard: {
    backgroundColor: '#e8f5e9',
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    position: 'relative',
  },
  childIconCircle: {
    width: 45,
    height: 45,
    backgroundColor: '#ffffff',
    borderRadius: 22.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  childEmoji: {
    fontSize: 20,
  },
  childTextContainer: {
    flex: 1,
  },
  childName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1b5e20',
  },
  childInfo: {
    fontSize: 14,
    color: '#2e7d32',
    marginTop: 2,
    fontWeight: '500',
  },
  childYellowBadge: {
    width: 8,
    height: '100%',
    backgroundColor: '#fbc02d',
    position: 'absolute',
    right: 0,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  emptyText: {
    color: '#66bb6a',
    fontStyle: 'italic',
  },
});
