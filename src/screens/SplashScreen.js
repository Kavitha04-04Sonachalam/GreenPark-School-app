import React, { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoScaleAnim = useRef(new Animated.Value(0.8)).current;
  const { width } = Dimensions.get('window');
  const isCompact = width < 360;
  const logoSize = isCompact ? Math.min(width * 0.5, 150) : Math.min(width * 0.48, 185);
  const titleSize = isCompact ? 20 : 22;
  const subtitleSize = isCompact ? 14 : 15;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(logoScaleAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 3000);

    return () => clearTimeout(timer);
  }, [fadeAnim, logoScaleAnim, navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#F3FBF4', '#FFFFFF']} style={styles.gradient}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <Animated.View style={{ transform: [{ scale: logoScaleAnim }] }}>
            <Image
              source={require('../../assets/images/school-logo.jpg')}
              style={[styles.logo, { width: logoSize, height: logoSize }]}
              resizeMode="contain"
            />
          </Animated.View>

          <Text style={[styles.schoolName, { fontSize: titleSize }]}>Green Park School</Text>
          <Text style={[styles.subtitle, { fontSize: subtitleSize }]}>Parent Portal</Text>

          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#2e7d32" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  logo: {
    maxWidth: 185,
    maxHeight: 185,
    marginBottom: 10,
  },
  schoolName: {
    textAlign: 'center',
    color: '#2e7d32',
    fontWeight: '700',
    letterSpacing: 0.2,
    marginBottom: 3,
    paddingHorizontal: 8,
  },
  subtitle: {
    color: '#6D7B74',
    fontWeight: '500',
    marginBottom: 10,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  loadingText: {
    marginTop: 5,
    fontSize: 13,
    color: '#6C7A73',
  },
});
