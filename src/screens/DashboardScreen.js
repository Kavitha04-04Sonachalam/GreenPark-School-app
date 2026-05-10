import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { getStudents } from '../services/api';

export default function DashboardScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [children, setChildren] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChildrenLoading, setIsChildrenLoading] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const userJson = await AsyncStorage.getItem('user');
        console.log("Logged in User Data:", userJson);
        
        if (userJson) {
          const user = JSON.parse(userJson);
          setUserData(user);
          
          // CRITICAL: Use children already present in the user object if available
          if (user.children && Array.isArray(user.children) && user.children.length > 0) {
            console.log("Using children from user object:", user.children);
            setChildren(user.children);
            handleSelectStudent(user.children[0]);
            setIsLoading(false);
            // Optionally still fetch for latest data, but we already have data to show
            fetchChildren(user.parent_id || user.id || user.user_id);
          } else {
            const parentId = user.parent_id || user.id || user.user_id || user.parentId;
            if (parentId) {
              fetchChildren(parentId);
            } else {
              setIsLoading(false);
            }
          }
        } else {
          navigation.replace('Login');
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const fetchChildren = async (parentId) => {
    setIsChildrenLoading(true);
    try {
      console.log(`Fetching students for Parent ID: ${parentId}`);
      const response = await getStudents(parentId);
      console.log("Students API Raw Response:", response);
      
      let studentList = [];
      if (Array.isArray(response)) {
        studentList = response;
      } else if (response && Array.isArray(response.data)) {
        studentList = response.data;
      } else if (response && Array.isArray(response.students)) {
        studentList = response.students;
      }

      // Only update if we actually got data, otherwise keep what we have from user object
      if (studentList.length > 0) {
        console.log("Updating children with API response:", studentList);
        setChildren(studentList);
        if (!selectedStudent) {
          handleSelectStudent(studentList[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching children:', error);
    } finally {
      setIsChildrenLoading(false);
    }
  };



  const handleSelectStudent = async (student) => {
    setSelectedStudent(student);
    const sId = student.student_id || student.id;
    const cName = student.class_ || student.class_name || '';
    
    try {
      if (sId) await AsyncStorage.setItem('selected_student_id', sId.toString());
      if (cName) await AsyncStorage.setItem('selected_class_name', cName.toString());
    } catch (error) {
      console.error('Error saving selected student:', error);
    }
  };

  const navigateToService = (screen) => {
    if (screen === 'Settings') {
      navigation.navigate('Settings');
      return;
    }
    if (screen === 'Profile') {
      navigation.navigate('Profile');
      return;
    }

    if (!selectedStudent) {
      Alert.alert('Select Student', 'Please select a child to view their details.');
      return;
    }
    navigation.navigate(screen, {
      student_id: selectedStudent.student_id || selectedStudent.id,
      class_name: selectedStudent.class_ || selectedStudent.class_name,
      student_name: `${selectedStudent.first_name || ''} ${selectedStudent.last_name || selectedStudent.name || ''}`.trim(),
    });
  };

  const ServiceCard = ({ title, icon, screen }) => (
    <TouchableOpacity
      style={styles.serviceCard}
      onPress={() => navigateToService(screen)}
      activeOpacity={0.7}
    >
      <View style={styles.serviceIconContainer}>
        <Text style={styles.serviceEmoji}>{icon}</Text>
      </View>
      <Text style={styles.serviceTitle}>{title}</Text>
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
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={() => navigation.replace('Login')}
        >
          <Text style={styles.retryButtonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView 
        contentContainerStyle={[
          styles.scrollContent, 
          { paddingTop: insets.top + 16 }
        ]} 
        showsVerticalScrollIndicator={false}
      >
        
        {/* Floating Header Section */}
        <View style={styles.headerCard}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <TouchableOpacity 
                style={styles.homeButton} 
                onPress={() => navigation.replace('Main')}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="home-outline" size={24} color="#ffffff" />
              </TouchableOpacity>
              <View style={styles.headerTextContainer}>
                <Text style={styles.welcomeText}>Welcome,</Text>
                <Text style={styles.userName}>{userData.name}</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.profileButton} 
              onPress={() => navigation.navigate('Profile')}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              activeOpacity={0.7}
            >
              <Ionicons name="person-circle-outline" size={32} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Guardian Profile</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <Text style={styles.viewAllText}>View Details</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity 
            style={styles.profileCard}
            onPress={() => navigation.navigate('Profile')}
            activeOpacity={0.8}
          >
            <View style={styles.profileContent}>
              <View style={styles.detailRow}>
                <Ionicons name="person-outline" size={18} color="#2e7d32" style={styles.detailIcon} />
                <View>
                  <Text style={styles.detailLabel}>Parent Name</Text>
                  <Text style={styles.detailValue}>{userData.name}</Text>
                </View>
              </View>
              <View style={[styles.detailRow, { borderBottomWidth: 0, marginBottom: 0, paddingBottom: 0 }]}>
                <Ionicons name="call-outline" size={18} color="#2e7d32" style={styles.detailIcon} />
                <View>
                  <Text style={styles.detailLabel}>Phone Number</Text>
                  <Text style={styles.detailValue}>{userData.phone_number}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Children Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Children</Text>
          {isChildrenLoading ? (
            <ActivityIndicator color="#2e7d32" style={{ marginVertical: 20 }} />
          ) : children && children.length > 0 ? (
            children.map((child, index) => {
              const studentId = child.student_id || child.id;
              const isSelected = (selectedStudent?.student_id || selectedStudent?.id) === studentId;
              const fullName = `${child.first_name || ''} ${child.last_name || child.name || ''}`.trim();
              const classDisplay = child.class_ ? `${child.class_} - ${child.section || ''}` : child.class_name;

              return (
                <TouchableOpacity 
                  key={index} 
                  style={[
                    styles.childCard,
                    isSelected && styles.selectedChildCard
                  ]} 
                  onPress={() => handleSelectStudent(child)}
                  activeOpacity={0.8}
                >
                  <View style={[
                    styles.childIconCircle,
                    isSelected && styles.selectedChildIconCircle
                  ]}>
                    <Text style={styles.childEmoji}>🎓</Text>
                  </View>
                  <View style={styles.childTextContainer}>
                    <Text style={[
                      styles.childName,
                      isSelected && styles.selectedChildText
                    ]}>{fullName || child.name}</Text>
                    <Text style={[
                      styles.childInfo,
                      isSelected && styles.selectedChildSubtext
                    ]}>
                      Class: {child.class || classDisplay}
                    </Text>
                  </View>
                  {isSelected ? (
                    <Ionicons name="checkmark-circle" size={24} color="#2e7d32" />
                  ) : (
                    <Ionicons name="chevron-forward" size={20} color="#bdc3c7" />
                  )}
                </TouchableOpacity>

              );
            })
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No children records found</Text>
            </View>
          )}
        </View>

        {/* Services Grid Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>School Services</Text>
            {selectedStudent && (
              <Text style={styles.selectedTag}>For {(selectedStudent.first_name || selectedStudent.name || '').split(' ')[0]}</Text>
            )}
          </View>
          <View style={styles.servicesGrid}>
            <ServiceCard title="Attendance" icon="📊" screen="Attendance" />
            <ServiceCard title="Fees" icon="💰" screen="Fees" />
            <ServiceCard title="Marks" icon="📝" screen="Marks" />
            <ServiceCard title="Notifications" icon="🔔" screen="Notifications" />
            <ServiceCard title="Settings" icon="⚙️" screen="Settings" />
          </View>
        </View>

      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAF9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAF9',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#E74C3C',
    fontWeight: '600',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#2e7d32',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  headerCard: {
    backgroundColor: '#2E7D32',
    padding: 24,
    borderRadius: 20,
    marginBottom: 24,
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  homeButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    marginRight: 12,
  },
  headerTextContainer: {
    justifyContent: 'center',
  },
  welcomeText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  profileButton: {
    padding: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2C3E50',
    marginLeft: 4,
    letterSpacing: 0.2,
  },
  selectedTag: {
    fontSize: 12,
    color: '#2e7d32',
    backgroundColor: '#e8f5e9',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    fontWeight: '600',
  },
  viewAllText: {
    fontSize: 12,
    color: '#2e7d32',
    fontWeight: '600',
    marginRight: 4,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
  },
  profileContent: {
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F3F1',
    paddingBottom: 12,
    marginBottom: 4,
  },
  detailIcon: {
    marginRight: 14,
    backgroundColor: '#E8F5E9',
    padding: 8,
    borderRadius: 10,
    overflow: 'hidden',
  },
  detailLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '700',
    marginTop: 2,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    width: '47.5%',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  serviceIconContainer: {
    width: 54,
    height: 54,
    backgroundColor: '#F1F8F4',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  serviceEmoji: {
    fontSize: 26,
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2E7D32',
  },
  childCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedChildCard: {
    borderColor: '#2e7d32',
    backgroundColor: '#F1F8F4',
  },
  childIconCircle: {
    width: 48,
    height: 48,
    backgroundColor: '#E8F5E9',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  selectedChildIconCircle: {
    backgroundColor: '#FFFFFF',
  },
  childEmoji: {
    fontSize: 22,
  },
  childTextContainer: {
    flex: 1,
  },
  childName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C3E50',
  },
  selectedChildText: {
    color: '#1B5E20',
  },
  childInfo: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 2,
    fontWeight: '500',
  },
  selectedChildSubtext: {
    color: '#2E7D32',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    padding: 30,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F0F3F1',
    borderStyle: 'dashed',
  },
  emptyText: {
    color: '#95A5A6',
    fontSize: 14,
    fontStyle: 'italic',
  },
});

