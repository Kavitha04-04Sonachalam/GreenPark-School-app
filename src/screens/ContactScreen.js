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
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';
import CommonHeader from '../components/CommonHeader';

const ContactScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    student_name: '',
    class_applied: '',
    parent_name: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    if (!formData.student_name.trim()) {
      Alert.alert('Required', 'Please enter student name');
      return false;
    }
    if (!formData.class_applied.trim()) {
      Alert.alert('Required', 'Please enter class applied');
      return false;
    }
    if (!formData.parent_name.trim()) {
      Alert.alert('Required', 'Please enter parent name');
      return false;
    }
    if (!formData.phone.trim() || formData.phone.length !== 10) {
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
      await axios.post("https://api.indinexz.com/api/v1/admission-enquiry", {
        student_name: formData.student_name,
        class_applied: formData.class_applied,
        parent_name: formData.parent_name,
        phone: formData.phone,
        message: formData.message,
      });

      Alert.alert('Success', 'Enquiry submitted successfully');
      setFormData({
        student_name: '',
        class_applied: '',
        parent_name: '',
        phone: '',
        message: '',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to submit enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 1. HEADER */}
      <CommonHeader title="Contact Us" navigation={navigation} />

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
              <TouchableOpacity 
                activeOpacity={0.8}
                onPress={() => {
                  const url = "https://www.google.com/maps/search/?api=1&query=Green+Park+Matric+Hr+Sec+School,+No+9,+Sai+Ram+Nagar,+Siruvachur,+Perambalur+-+621113";
                  Linking.openURL(url);
                }}
              >
                <View pointerEvents="none">
                  <MapView
                    style={styles.map}
                    initialRegion={{
                      latitude: 11.2785,
                      longitude: 78.8730,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }}
                  >
                    <Marker 
                      coordinate={{
                        latitude: 11.2785,
                        longitude: 78.8730,
                      }} 
                      title="Green Park Matric Hr Sec School"
                      description="No : 9, Sai Ram Nagar, Siruvachur, Perambalur - 621113"
                    />
                  </MapView>
                </View>
              </TouchableOpacity>
            </View>

            {/* 4. FORM SECTION */}
            <View style={styles.formContainer}>
              <Text style={styles.sectionTitle}>Enquiry Form</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Student Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter student name"
                  value={formData.student_name}
                  onChangeText={(val) => handleInputChange('student_name', val)}
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                  <Text style={styles.label}>Class Applied *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 10th"
                    value={formData.class_applied}
                    onChangeText={(val) => handleInputChange('class_applied', val)}
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Parent Name *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter parent name"
                    value={formData.parent_name}
                    onChangeText={(val) => handleInputChange('parent_name', val)}
                  />
                </View>
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
