import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import CommonHeader from '../components/CommonHeader';
import { getMarks } from '../services/api';

export default function MarksScreen({ route, navigation }) {
  const { student_id, student_name } = route.params || {};
  const [marksData, setMarksData] = useState([]);
  const [filteredMarks, setFilteredMarks] = useState([]);
  const [examTypes, setExamTypes] = useState([]);
  const [selectedExam, setSelectedExam] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (student_id) {
      fetchMarks();
    } else {
      Alert.alert('Error', 'Student information not found');
      navigation.goBack();
    }
  }, [student_id]);

  const fetchMarks = async () => {
    setIsLoading(true);
    try {
      const data = await getMarks(student_id);
      const marksArray = Array.isArray(data) ? data : (data.marks || []);
      setMarksData(marksArray);
      setFilteredMarks(marksArray);
      
      // Extract unique exam types
      const types = ['All', ...new Set(marksArray.map(m => m.exam_type).filter(Boolean))];
      setExamTypes(types);
    } catch (error) {
      console.error('Error fetching marks:', error);
      Alert.alert('Error', 'Failed to load marks records');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExamFilter = (type) => {
    setSelectedExam(type);
    if (type === 'All') {
      setFilteredMarks(marksData);
    } else {
      setFilteredMarks(marksData.filter(m => m.exam_type === type));
    }
  };

  const MarkCard = ({ item }) => (
    <View style={styles.markCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.subjectText}>{item.subject_name}</Text>
        <View style={styles.examBadge}>
          <Text style={styles.examBadgeText}>{item.exam_type}</Text>
        </View>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.markInfo}>
          <Text style={styles.markLabel}>Obtained</Text>
          <Text style={styles.markValue}>{item.marks_obtained}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.markInfo}>
          <Text style={styles.markLabel}>Max Marks</Text>
          <Text style={styles.markValue}>{item.max_marks}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.markInfo}>
          <Text style={styles.markLabel}>Grade</Text>
          <Text style={[styles.markValue, { color: '#2e7d32' }]}>{item.grade || 'A'}</Text>
        </View>
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
      <CommonHeader title="Examination Marks" navigation={navigation} />
      
      <View style={styles.topInfo}>
        <Text style={styles.studentName}>{student_name}</Text>
        <Text style={styles.infoSubtitle}>Academic Performance</Text>
      </View>

      {examTypes.length > 1 && (
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {examTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.filterBtn,
                  selectedExam === type && styles.filterBtnActive
                ]}
                onPress={() => handleExamFilter(type)}
              >
                <Text style={[
                  styles.filterBtnText,
                  selectedExam === type && styles.filterBtnTextActive
                ]}>{type}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <FlatList
        data={filteredMarks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={MarkCard}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Ionicons name="document-text-outline" size={48} color="#bdc3c7" />
            <Text style={styles.emptyText}>No marks data found</Text>
          </View>
        }
      />
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
  topInfo: {
    backgroundColor: '#2e7d32',
    padding: 20,
    paddingBottom: 25,
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
  filterContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    elevation: 2,
    marginBottom: 8,
  },
  filterScroll: {
    paddingHorizontal: 16,
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterBtnActive: {
    backgroundColor: '#2e7d32',
    borderColor: '#2e7d32',
  },
  filterBtnText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
  },
  filterBtnTextActive: {
    color: '#ffffff',
  },
  listContent: {
    padding: 16,
    paddingBottom: 30,
  },
  markCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8faf9',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  subjectText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  examBadge: {
    backgroundColor: '#e8f5e9',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  examBadgeText: {
    fontSize: 11,
    color: '#2e7d32',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  cardBody: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  markInfo: {
    flex: 1,
    alignItems: 'center',
  },
  markLabel: {
    fontSize: 11,
    color: '#95a5a6',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  markValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: '#eee',
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
