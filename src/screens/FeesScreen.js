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
import { getFees } from '../services/api';

export default function FeesScreen({ route, navigation }) {
  const { student_id, student_name } = route.params || {};
  const [feesData, setFeesData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (student_id) {
      fetchFees();
    } else {
      Alert.alert('Error', 'Student information not found');
      navigation.goBack();
    }
  }, [student_id]);

  const fetchFees = async () => {
    setIsLoading(true);
    try {
      const data = await getFees(student_id);
      setFeesData(data);
    } catch (error) {
      console.error('Error fetching fees:', error);
      Alert.alert('Error', 'Failed to load fee records');
    } finally {
      setIsLoading(false);
    }
  };

  const FeeItem = ({ label, amount, color, icon }) => (
    <View style={styles.feeItem}>
      <View style={[styles.feeIconContainer, { backgroundColor: `${color}15` }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.feeInfo}>
        <Text style={styles.feeLabel}>{label}</Text>
        <Text style={[styles.feeAmount, { color }]}>₹{amount || 0}</Text>
      </View>
    </View>
  );

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
      <CommonHeader title="School Fees" navigation={navigation} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.studentInfoCard}>
          <Text style={styles.studentName}>{student_name}</Text>
          <Text style={styles.infoSubtitle}>Fee Structure 2024-25</Text>
        </View>

        {feesData ? (
          <>
            <View style={styles.mainFeesCard}>
              <Text style={styles.summaryTitle}>Payment Summary</Text>
              
              <FeeItem 
                label="Total Fees" 
                amount={feesData.total_fees} 
                color="#2c3e50" 
                icon="wallet-outline" 
              />
              <FeeItem 
                label="Amount Paid" 
                amount={feesData.paid_amount} 
                color="#2e7d32" 
                icon="checkmark-circle-outline" 
              />
              <View style={styles.divider} />
              <FeeItem 
                label="Pending Balance" 
                amount={feesData.pending_amount} 
                color="#d32f2f" 
                icon="alert-circle-outline" 
              />
            </View>

            {/* Additional details if available */}
            {feesData.transactions && feesData.transactions.length > 0 && (
              <View style={styles.historySection}>
                <Text style={styles.sectionTitle}>Recent Payments</Text>
                {feesData.transactions.map((item, index) => (
                  <View key={index} style={styles.transactionRow}>
                    <View>
                      <Text style={styles.transTitle}>{item.title || 'Tuition Fee'}</Text>
                      <Text style={styles.transDate}>{item.date}</Text>
                    </View>
                    <Text style={styles.transAmount}>₹{item.amount}</Text>
                  </View>
                ))}
              </View>
            )}
          </>
        ) : (
          <View style={styles.emptyCard}>
            <Ionicons name="card-outline" size={48} color="#bdc3c7" />
            <Text style={styles.emptyText}>No fee data available</Text>
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
  mainFeesCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 20,
  },
  feeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  feeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  feeInfo: {
    flex: 1,
  },
  feeLabel: {
    fontSize: 13,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  feeAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f1f1',
    marginVertical: 4,
    marginBottom: 20,
  },
  historySection: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 16,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  transTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  transDate: {
    fontSize: 12,
    color: '#95a5a6',
    marginTop: 2,
  },
  transAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2e7d32',
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
