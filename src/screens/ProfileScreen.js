import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { getStudents, getParentProfile, uploadProfilePhoto } from '../services/api';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

export default function ProfileScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [children, setChildren] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isChildrenLoading, setIsChildrenLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const userJson = await AsyncStorage.getItem('user');
      if (userJson) {
        const user = JSON.parse(userJson);
        setUserData(user);
        
        const parentId = user.parent_id || user.phone_number || user.id;
        if (parentId) {
          fetchChildren(parentId);
          refreshProfile(parentId);
        }
      } else {
        navigation.replace('Login');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = async (parentId) => {
    try {
      const response = await getParentProfile(parentId);
      const updatedUser = response.data || response;
      if (updatedUser) {
        setUserData(updatedUser);
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  const pickImage = async () => {
    Alert.alert(
      'Profile Photo',
      'Choose an option',
      [
        {
          text: 'Camera',
          onPress: () => handleImagePicker('camera'),
        },
        {
          text: 'Gallery',
          onPress: () => handleImagePicker('gallery'),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const handleImagePicker = async (type) => {
    console.log('Opening image picker for:', type);
    try {
      let result;
      const options = {
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      };

      if (type === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        console.log('Camera permission status:', status);
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Camera permission is required to take photos.');
          return;
        }
        result = await ImagePicker.launchCameraAsync(options);
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        console.log('Gallery permission status:', status);
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Gallery permission is required to pick photos.');
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync(options);
      }

      console.log('Picker result:', result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        uploadPhoto(result.assets[0]);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Something went wrong while picking the image.');
    }
  };

  const uploadPhoto = async (asset) => {
    const parentId = userData?.parent_id || userData?.phone_number || userData?.id;
    if (!parentId) {
      Alert.alert('Error', 'User ID not found. Please log in again.');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('parent_id', parentId);
      
      const filename = asset.uri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      formData.append('image', {
        uri: asset.uri,
        name: filename,
        type: type,
      });

      await uploadProfilePhoto(formData);
      
      // Success - refresh profile
      await refreshProfile(parentId);
      Alert.alert('Success', 'Profile photo updated successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Upload Failed', error.message || 'Could not upload profile photo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const fetchChildren = async (parentId) => {
    setIsChildrenLoading(true);
    try {
      const response = await getStudents(parentId);
      let studentList = [];
      if (Array.isArray(response)) {
        studentList = response;
      } else if (response && Array.isArray(response.data)) {
        studentList = response.data;
      } else if (response && Array.isArray(response.students)) {
        studentList = response.students;
      }
      setChildren(studentList);
    } catch (error) {
      console.error('Error fetching children:', error);
    } finally {
      setIsChildrenLoading(false);
    }
  };

  const DetailItem = ({ icon, label, value }) => (
    <View style={styles.detailRow}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={20} color="#2e7d32" />
      </View>
      <View style={styles.detailTextContainer}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value || 'Not available'}</Text>
      </View>
    </View>
  );

  const StudentCard = ({ child }) => {
    const fullName = `${child.first_name || ''} ${child.last_name || child.name || ''}`.trim();
    const classDisplay = child.class_ || child.class_name || 'N/A';
    const sectionDisplay = child.section || 'N/A';
    const rollNo = child.roll_number || child.roll_no || 'N/A';
    const studentId = child.student_id || child.id || 'N/A';
    const academicYear = child.academic_year || '2023-24';

    return (
      <View style={styles.studentCard}>
        <View style={styles.studentHeader}>
          <View style={styles.studentAvatar}>
            <Text style={styles.studentEmoji}>🎓</Text>
          </View>
          <View>
            <Text style={styles.studentName}>{fullName}</Text>
            <Text style={styles.studentIdText}>ID: {studentId}</Text>
          </View>
        </View>
        
        <View style={styles.studentGrid}>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Class & Section</Text>
            <Text style={styles.gridValue}>{classDisplay} - {sectionDisplay}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Roll Number</Text>
            <Text style={styles.gridValue}>{rollNo}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Academic Year</Text>
            <Text style={styles.gridValue}>{academicYear}</Text>
          </View>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2e7d32" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#2e7d32" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Settings')}
          style={styles.settingsButton}
        >
          <Ionicons name="settings-outline" size={24} color="#2e7d32" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Header Card */}
        <View style={styles.profileMainCard}>
          <TouchableOpacity 
            style={styles.profileImageContainer} 
            onPress={pickImage}
            disabled={isUploading}
          >
            {userData?.profile_image_url || userData?.profile_image ? (
              <Image 
                source={{ uri: `${userData.profile_image_url || userData.profile_image}?t=${new Date().getTime()}` }} 
                style={styles.profileImage} 
              />
            ) : (
              <View style={styles.profilePlaceholder}>
                <Ionicons name="person" size={50} color="#fff" />
              </View>
            )}
            
            {isUploading ? (
              <View style={styles.uploadingOverlay}>
                <ActivityIndicator color="#fff" />
              </View>
            ) : (
              <View style={styles.editBadge}>
                <Ionicons name="camera" size={14} color="#fff" />
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.profileName}>{userData?.parent_name || userData?.name}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{userData?.role?.toUpperCase() || 'PARENT'}</Text>
          </View>
        </View>

        {/* Parent Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          <View style={styles.infoCard}>
            <DetailItem 
              icon="card-outline" 
              label="Parent ID" 
              value={userData?.parent_id || userData?.id || userData?.user_id} 
            />
            <DetailItem 
              icon="person-outline" 
              label="Parent Name" 
              value={userData?.parent_name || userData?.name} 
            />
            <DetailItem 
              icon="call-outline" 
              label="Phone Number" 
              value={userData?.phone_number} 
            />
            <DetailItem 
              icon="mail-outline" 
              label="Email Address" 
              value={userData?.email || 'Not provided'} 
            />
          </View>
        </View>

        {/* Children Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Children</Text>
            {isChildrenLoading && <ActivityIndicator size="small" color="#2e7d32" />}
          </View>
          
          {children && children.length > 0 ? (
            children.map((child, index) => (
              <StudentCard key={index} child={child} />
            ))
          ) : !isChildrenLoading ? (
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={40} color="#ccc" />
              <Text style={styles.emptyText}>No children found linked to this account.</Text>
            </View>
          ) : null}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F3F1',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  settingsButton: {
    padding: 5,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  profileMainCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  profileImageContainer: {
    marginBottom: 15,
    position: 'relative',
  },
  profilePlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#2e7d32',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: '#fff',
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2e7d32',
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 3,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  roleBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2e7d32',
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F3F1',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F1F8F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2C3E50',
  },
  studentCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#2e7d32',
  },
  studentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  studentAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F1F8F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  studentEmoji: {
    fontSize: 24,
  },
  studentName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  studentIdText: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 2,
  },
  studentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderTopWidth: 1,
    borderTopColor: '#F0F3F1',
    paddingTop: 15,
  },
  gridItem: {
    width: '50%',
    marginBottom: 12,
  },
  gridLabel: {
    fontSize: 11,
    color: '#95A5A6',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  gridValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
  },
  emptyState: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F0F3F1',
    borderStyle: 'dashed',
  },
  emptyText: {
    marginTop: 10,
    color: '#95A5A6',
    textAlign: 'center',
    fontSize: 14,
  },
});
