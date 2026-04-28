import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { submitContactForm } from '../services/contactApi';

const ContactScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    studentClass: '',
    section: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Required', 'Please enter your name');
      return false;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      Alert.alert('Required', 'Please enter a valid 10-digit phone number');
      return false;
    }
    if (!formData.message.trim()) {
      Alert.alert('Required', 'Please enter your message');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await submitContactForm(formData);
      if (response.success) {
        Alert.alert('Success', response.message);
        setFormData({
          name: '',
          phone: '',
          studentClass: '',
          section: '',
          message: '',
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to submit enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 1. HEADER */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.headerTitle}>Contact Us</Text>
          <Text style={{ fontSize: 10, color: '#fbc02d' }}>v1.0.3 - Map & Form Ready</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* 2. SCHOOL INFO CARD */}
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Ionicons name="business" size={20} color="#2e7d32" style={styles.infoIcon} />
                <View>
                  <Text style={styles.infoLabel}>School Name:</Text>
                  <Text style={styles.infoText}>Green Park Matric Hr Sec School</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="location" size={20} color="#2e7d32" style={styles.infoIcon} />
                <View>
                  <Text style={styles.infoLabel}>Address:</Text>
                  <Text style={styles.infoText}>No : 9, Sai Ram Nagar,</Text>
                  <Text style={styles.infoText}>Siruvachur, Perambalur - 621113</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="call" size={20} color="#2e7d32" style={styles.infoIcon} />
                <View>
                  <Text style={styles.infoLabel}>Phone:</Text>
                  <Text style={styles.infoText}>+91 96293 22223</Text>
                  <Text style={styles.infoText}>+91 95009 59963</Text>
                </View>
              </View>
            </View>

            {/* 3. MAP SECTION */}
            <View style={styles.mapContainer}>
              <Text style={styles.sectionTitle}>Locate Us</Text>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: 11.2341,
                  longitude: 78.8762,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                <Marker 
                  coordinate={{ latitude: 11.2341, longitude: 78.8762 }} 
                  title="Green Park School"
                  description="Siruvachur, Perambalur"
                />
              </MapView>
            </View>

            {/* 4. FORM SECTION */}
            <View style={styles.formContainer}>
              <Text style={styles.sectionTitle}>Enquiry Form</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your name"
                  value={formData.name}
                  onChangeText={(val) => handleInputChange('name', val)}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="10-digit mobile number"
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={formData.phone}
                  onChangeText={(val) => handleInputChange('phone', val)}
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                  <Text style={styles.label}>Class</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 10th"
                    value={formData.studentClass}
                    onChangeText={(val) => handleInputChange('studentClass', val)}
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Section</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. A"
                    value={formData.section}
                    onChangeText={(val) => handleInputChange('section', val)}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Message *</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Your enquiry or message..."
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  value={formData.message}
                  onChangeText={(val) => handleInputChange('message', val)}
                />
              </View>

              <TouchableOpacity 
                style={styles.submitButton} 
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.submitText}>Submit</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f1f8f4',
  },
  header: {
    height: 60,
    backgroundColor: '#2e7d32',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    margin: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  infoIcon: {
    marginRight: 15,
    marginTop: 2,
  },
  infoLabel: {
    fontSize: 12,
    color: '#66bb6a',
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  infoText: {
    fontSize: 15,
    color: '#1b5e20',
    fontWeight: '600',
    lineHeight: 22,
  },
  mapContainer: {
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1b5e20',
    marginBottom: 12,
    marginLeft: 4,
  },
  map: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e8f5e9',
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1b5e20',
    marginBottom: 6,
    marginLeft: 2,
  },
  input: {
    backgroundColor: '#fcfcfc',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
  },
  textArea: {
    minHeight: 100,
  },
  submitButton: {
    backgroundColor: '#2e7d32',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  submitText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ContactScreen;
