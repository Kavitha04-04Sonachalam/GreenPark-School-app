import React, { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  
  // Custom Dot Animations
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  // Logo sizing: 80% of width
  const logoWidth = width * 0.8;
  const logoHeight = logoWidth * 0.35; // Assuming ~3:1 aspect ratio for horizontal logo

  useEffect(() => {
    // Entrance Animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    // Loader Dot Sequence
    const animateDots = (dot, delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 400, useNativeDriver: true }),
        ])
      );
    };

    animateDots(dot1, 0).start();
    animateDots(dot2, 200).start();
    animateDots(dot3, 400).start();

    // Navigation logic
    const checkUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const user = await AsyncStorage.getItem('user');

        setTimeout(() => {
          if (token && user) {
            navigation.replace('Dashboard');
          } else {
            navigation.replace('Login');
          }
        }, 3000);
      } catch (e) {
        navigation.replace('Login');
      }
    };

    checkUser();
  }, []);

  const renderDot = (anim) => (
    <Animated.View 
      style={[
        styles.dot, 
        { 
          opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }),
          transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.3] }) }]
        }
      ]} 
    />
  );

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <LinearGradient colors={['#e8f5e9', '#ffffff']} style={styles.gradient}>
        
        {/* Main Centered Content */}
        <Animated.View style={[styles.mainContent, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          {/* Full Horizontal Logo */}
          <Image
            source={require('../../assets/images/school-logo.jpg')}
            style={{ width: logoWidth, height: logoHeight }}
            resizeMode="contain"
          />

          {/* Clean Subtitle */}
          <Text style={styles.subtitle}>Parent Portal</Text>

          {/* Minimalist Dot Loader */}
          <View style={styles.loaderContainer}>
            {renderDot(dot1)}
            {renderDot(dot2)}
            {renderDot(dot3)}
          </View>
        </Animated.View>

        {/* Branded Footer */}
        <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
          <Text style={styles.footerText}>Secure App for Parents</Text>
          <Text style={styles.schoolCredit}>© Green Park School</Text>
        </Animated.View>

      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#1b5e20',
    fontWeight: '600',
    marginTop: 15,
    letterSpacing: 1,
    textTransform: 'uppercase',
    opacity: 0.8,
  },
  loaderContainer: {
    flexDirection: 'row',
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2e7d32',
    marginHorizontal: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#2e7d32',
    fontWeight: '600',
    letterSpacing: 0.5,
    opacity: 0.6,
  },
  schoolCredit: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
    fontWeight: '400',
  },
});
