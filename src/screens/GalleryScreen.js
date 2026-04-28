import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CommonHeader from '../components/CommonHeader';

const { height } = Dimensions.get('window');

const GalleryScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <CommonHeader title="Event Gallery" navigation={navigation} />
      
      <View style={styles.content}>
        <View style={styles.topSection}>
          <Ionicons name="images-outline" size={50} color="#2e7d32" style={{ marginBottom: 10 }} />
          <Text style={styles.title}>School Gallery</Text>
          <Text style={styles.subtitle}>Explore our school events and memories.</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.galleryButton} 
            onPress={() => navigation.navigate('ImageGallery')}
          >
            <View style={styles.iconCircle}>
              <Ionicons name="image" size={24} color="#2e7d32" />
            </View>
            <Text style={styles.buttonText}>Photo Gallery</Text>
            <Ionicons name="chevron-forward" size={20} color="#1b5e20" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.galleryButton} 
            onPress={() => navigation.navigate('VideoGallery')}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#fff8e1' }]}>
              <Ionicons name="videocam" size={24} color="#fbc02d" />
            </View>
            <Text style={styles.buttonText}>Video Gallery</Text>
            <Ionicons name="chevron-forward" size={20} color="#1b5e20" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f5e9',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2e7d32',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: 'grey',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20, // Move upward slightly as requested
  },
  galleryButton: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    width: '85%',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    flex: 1,
    color: '#1b5e20',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 15,
  },
});

export default GalleryScreen;
