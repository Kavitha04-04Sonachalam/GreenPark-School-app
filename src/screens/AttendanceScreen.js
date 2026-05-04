import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import CommonHeader from '../components/CommonHeader';
import { getAttendance } from '../services/api';

export default function AttendanceScreen({ route, navigation }) {
  const { student_id, student_name } = route.params || {};
  const [attendanceData, setAttendanceData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (student_id) {
      fetchAttendance();
    } else {
      Alert.alert('Error', 'Student information not found');
      navigation.goBack();
    }
  }, [student_id]);

  const fetchAttendance = async () => {
    setIsLoading(true);
    try {
      const data = await getAttendance(student_id);
      setAttendanceData(data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      Alert.alert('Error', 'Failed to load attendance records');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2e7d32" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <CommonHeader title="Attendance" navigation={navigation} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.studentInfoCard}>
          <Text style={styles.studentName}>{student_name}</Text>
          <Text style={styles.infoSubtitle}>Attendance Overview</Text>
        </View>

        {attendanceData ? (
          <>
            <View style={styles.statsGrid}>
              <View style={[styles.statCard, { borderBottomColor: '#2e7d32' }]}>
                <Text style={styles.statLabel}>Present Days</Text>
                <Text style={[styles.statValue, { color: '#2e7d32' }]}>
                  {attendanceData.present_days || 0}
                </Text>
              </View>
              <View style={[styles.statCard, { borderBottomColor: '#d32f2f' }]}>
                <Text style={styles.statLabel}>Absent Days</Text>
                <Text style={[styles.statValue, { color: '#d32f2f' }]}>
                  {attendanceData.absent_days || 0}
                </Text>
              </View>
            </View>

            <View style={styles.percentageCard}>
              <View style={styles.percentageCircle}>
                <Text style={styles.percentageText}>
                  {attendanceData.percentage || '0'}%
                </Text>
              </View>
              <View style={styles.percentageInfo}>
                <Text style={styles.percentageLabel}>Attendance Percentage</Text>
                <Text style={styles.percentageSubtext}>Current Academic Session</Text>
              </View>
            </View>

            {/* Placeholder for history or calendar if needed */}
            <View style={styles.historySection}>
              <Text style={styles.sectionTitle}>Summary Details</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Total Working Days</Text>
                <Text style={styles.detailValue}>{attendanceData.total_days || 0}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Leave Applied</Text>
                <Text style={styles.detailValue}>{attendanceData.leaves || 0}</Text>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.emptyCard}>
            <Ionicons name="calendar-outline" size={48} color="#bdc3c7" />
            <Text style={styles.emptyText}>No attendance data available</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
  },
  studentInfoCard: {
    backgroundColor: '#2e7d32',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  studentName: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  infoSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#ffffff',
    width: '48%',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderBottomWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  percentageCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  percentageCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: '#2e7d32',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  percentageText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  percentageInfo: {
    flex: 1,
  },
  percentageLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c3e50',
  },
  percentageSubtext: {
    fontSize: 12,
    color: '#95a5a6',
    marginTop: 2,
  },
  historySection: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  detailLabel: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    padding: 40,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  emptyText: {
    color: '#95a5a6',
    marginTop: 10,
    fontSize: 14,
  },
});
