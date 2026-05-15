import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser } from '../services/api';

const { width } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Constants for logo aspect ratio
  const logoWidth = width * 0.8;
  const logoHeight = logoWidth * 0.35;

  const handleLogin = async () => {
    if (!mobile.trim() || !password.trim()) {
      Alert.alert('Validation', 'Please enter your mobile number and password.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await loginUser(mobile.trim(), password);
      const token = response.access_token || response.token;

      if (token) {
        const user = response.user || {};
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        
        // Save specific fields for quick access as requested
        const parentId = user.parent_id || user.phone_number || user.id;
        if (parentId) await AsyncStorage.setItem('parent_id', parentId.toString());
        if (user.phone_number || user.phone) await AsyncStorage.setItem('phone_number', (user.phone_number || user.phone).toString());
        if (user.role) await AsyncStorage.setItem('role', user.role);

        navigation.replace('Dashboard');
      } else {
        Alert.alert('Login Failed', 'Invalid login credentials. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error.message);
      Alert.alert('Login Failed', error.message || 'Unable to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button to Home */}
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.replace('Main')}
          >
            <Ionicons name="arrow-back" size={24} color="#2e7d32" />
            <Text style={styles.backText}>Back to Home</Text>
          </TouchableOpacity>

          {/* Top Logo - Full Horizontal Version */}
          <View style={styles.brandingSection}>
            <Image
              source={require('../../assets/images/school-logo.jpg')}
              style={{ width: logoWidth, height: logoHeight }}
              resizeMode="contain"
            />
            {/* Subtitle Only (Headings removed to avoid redundancy) */}
            <Text style={styles.portalSubtitle}>Parent Portal</Text>
          </View>


          {/* Login Card */}
          <View style={styles.loginCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Login to Your Account</Text>
              <Text style={styles.cardInfo}>Access child's school records</Text>
            </View>
            
            {/* Mobile Number Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Mobile Number</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="call-outline" size={20} color="#2e7d32" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your phone number"
                  placeholderTextColor="#999"
                  keyboardType="number-pad"
                  value={mobile}
                  onChangeText={setMobile}
                  maxLength={15}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color="#2e7d32" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#999"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <Ionicons 
                    name={showPassword ? "eye-outline" : "eye-off-outline"} 
                    size={20} 
                    color="#666" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password - Right Aligned */}
            <TouchableOpacity style={styles.forgotAction}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button - Full Width */}
            <TouchableOpacity 
              style={styles.loginBtn} 
              onPress={handleLogin} 
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <View style={styles.btnContent}>
                  <Text style={styles.loginBtnText}>Login</Text>
                  <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Help & Support */}
          <View style={styles.supportSection}>
            <TouchableOpacity style={styles.supportBtn}>
              <Text style={styles.supportText}>Need Help? <Text style={styles.contactLink}>Contact School</Text></Text>
            </TouchableOpacity>
            
            <View style={styles.secureBadge}>
              <Ionicons name="shield-checkmark" size={12} color="#2e7d32" />
              <Text style={styles.secureText}>Secure login for parents</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60, // Adjusted for back button
    paddingBottom: 40,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
  },
  backText: {
    fontSize: 16,
    color: '#2e7d32',
    fontWeight: '600',
    marginLeft: 8,
  },
  brandingSection: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 30,
  },
  portalSubtitle: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
    marginTop: 15,
    letterSpacing: 0.5,
  },
  loginCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  cardHeader: {
    marginBottom: 25,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1b5e20',
    textAlign: 'left',
  },
  cardInfo: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 8,
    marginLeft: 2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fcfcfc',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 55,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#333',
    fontSize: 15,
  },
  eyeIcon: {
    padding: 5,
  },
  forgotAction: {
    alignSelf: 'flex-end',
    marginBottom: 25,
  },
  forgotText: {
    color: '#2e7d32',
    fontSize: 14,
    fontWeight: '600',
  },
  loginBtn: {
    backgroundColor: '#2e7d32',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginBtnText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  supportSection: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingTop: 30,
  },
  supportBtn: {
    padding: 10,
  },
  supportText: {
    color: '#666',
    fontSize: 14,
  },
  contactLink: {
    color: '#2e7d32',
    fontWeight: 'bold',
  },
  secureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    opacity: 0.7,
  },
  secureText: {
    fontSize: 11,
    color: '#2e7d32',
    fontWeight: '600',
    marginLeft: 4,
    textTransform: 'uppercase',
  },
});
