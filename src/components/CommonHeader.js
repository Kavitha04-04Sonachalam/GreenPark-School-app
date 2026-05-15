import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

const CommonHeader = ({ title, navigation, showBack = true }) => {
  const insets = useSafeAreaInsets();
  const [userData, setUserData] = useState(null);
  const isFocused = useIsFocused();
  
  useEffect(() => {
    if (isFocused) {
      loadUserData();
    }
  }, [isFocused]);

  const loadUserData = async () => {
    try {
      const userJson = await AsyncStorage.getItem('user');
      if (userJson) {
        setUserData(JSON.parse(userJson));
      }
    } catch (error) {
      console.error('Error loading user data in header:', error);
    }
  };

  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
      <View style={styles.headerContent}>
        {showBack && (
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#1b5e20" />
          </TouchableOpacity>
        )}
        
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>{title}</Text>
        </View>

        <TouchableOpacity 
          style={styles.avatarContainer} 
          onPress={() => navigation.navigate('Profile')}
        >
          {userData?.profile_image_url || userData?.profile_image ? (
            <Image 
              source={{ uri: `${userData.profile_image_url || userData.profile_image}?t=${new Date().getTime()}` }} 
              style={styles.avatarImage} 
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={20} color="#1b5e20" />
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#ffffff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    zIndex: 10,
  },
  headerContent: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: '100%',
  },
  titleContainer: {
    position: 'absolute',
    left: 60,
    right: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1b5e20',
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 15,
    zIndex: 11,
    padding: 8,
  },
  avatarContainer: {
    position: 'absolute',
    right: 15,
    zIndex: 11,
    padding: 2,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#e8f5e9',
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  avatarPlaceholder: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f1f8f4',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CommonHeader;
