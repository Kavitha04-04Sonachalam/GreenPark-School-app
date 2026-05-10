import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
  Linking,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [activeBanner, setActiveBanner] = useState(0);
  const [menuVisible, setMenuVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const scrollRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      checkLoginStatus();
    }, [])
  );

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const user = await AsyncStorage.getItem('user');
      setIsLoggedIn(!!token);
      if (user) {
        setUserData(JSON.parse(user));
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  };

  const banners = [
    require('../../assets/images/newbanner1.png'),
    require('../../assets/images/new bannr2.png'),
    require('../../assets/images/new benner3.png'),
  ];

  const features = [
    { id: '1', title: 'Event Gallery', icon: '📸', screen: 'EventList' },
    { id: '2', title: 'Notice Board', icon: '📢', screen: 'NoticeScreen' },
    { id: '3', title: 'Contact Us', icon: '📞', screen: 'ContactScreen' },
    { 
      id: '4', 
      title: isLoggedIn ? 'Dashboard' : 'Parent Login', 
      icon: '🎓', 
      screen: isLoggedIn ? 'Dashboard' : 'Login' 
    },
    { id: '5', title: 'About Us', icon: '🏫', screen: 'AboutScreen' },
    { id: '6', title: 'Social Media', icon: '📱', screen: 'SocialScreen' },
  ];

  // Auto-scroll for banner
  useEffect(() => {
    const timer = setInterval(() => {
      if (activeBanner < banners.length - 1) {
        scrollRef.current?.scrollTo({ x: (activeBanner + 1) * (width - 32), animated: true });
        setActiveBanner(activeBanner + 1);
      } else {
        scrollRef.current?.scrollTo({ x: 0, animated: true });
        setActiveBanner(0);
      }
    }, 4000);

    return () => clearInterval(timer);
  }, [activeBanner]);

  const onScroll = (event) => {
    const slide = Math.ceil(event.nativeEvent.contentOffset.x / (width - 32));
    if (slide !== activeBanner) {
      setActiveBanner(slide);
    }
  };

  const toggleMenu = () => setMenuVisible(!menuVisible);

  return (
    <View style={styles.safeArea}>
      <StatusBar style="light" />
      
      {/* 1. TOP NAVIGATION BAR */}
      <View style={styles.header}>
        {/* Hamburger Icon */}
        <TouchableOpacity 
          style={styles.headerIcon} 
          onPress={() => navigation.openDrawer()}
        >
          <Ionicons name="menu" size={30} color="#ffffff" />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <Image 
            source={require('../../assets/images/round.png')} 
            style={styles.headerLogo} 
            resizeMode="contain"
          />
          <Text style={styles.headerTitleText}>GPS Siruvachur</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.headerIcon} 
            onPress={() => navigation.navigate('Notifications')}
          >
            <Ionicons name="notifications-outline" size={24} color="#ffffff" />
            <View style={styles.badge} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.headerIcon} 
            onPress={() => Linking.openURL('https://wa.me/919629322223')}
          >
            <Ionicons name="logo-whatsapp" size={24} color="#ffffff" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.headerIcon} onPress={toggleMenu}>
            <Ionicons name="ellipsis-vertical" size={22} color="#ffffff" />
          </TouchableOpacity>

          {isLoggedIn && (
            <TouchableOpacity 
              style={styles.avatarButton} 
              onPress={() => navigation.navigate('Profile')}
            >
              {userData?.profile_image ? (
                <Image 
                  source={{ uri: userData.profile_image }} 
                  style={styles.avatarImage} 
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person" size={20} color="#2e7d32" />
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 3-DOT MENU MODAL */}
      <Modal
        transparent={true}
        visible={menuVisible}
        animationType="fade"
        onRequestClose={toggleMenu}
      >
        <TouchableWithoutFeedback onPress={toggleMenu}>
          <View style={styles.modalOverlay}>
            <View style={styles.menuDropdown}>
              {isLoggedIn ? (
                <>
                  <TouchableOpacity style={styles.menuItem} onPress={() => { toggleMenu(); navigation.navigate('Settings'); }}>
                    <Ionicons name="settings-outline" size={20} color="#2e7d32" />
                    <Text style={styles.menuItemText}>Settings</Text>
                  </TouchableOpacity>
                  <View style={styles.menuDivider} />
                  <TouchableOpacity 
                    style={styles.menuItem} 
                    onPress={async () => { 
                      toggleMenu(); 
                      await AsyncStorage.multiRemove(['token', 'user', 'selected_student_id', 'selected_class_name']);
                      setIsLoggedIn(false);
                      navigation.replace('Login'); 
                    }}
                  >
                    <Ionicons name="log-out-outline" size={20} color="#d32f2f" />
                    <Text style={[styles.menuItemText, { color: '#d32f2f' }]}>Logout</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity style={styles.menuItem} onPress={() => { toggleMenu(); navigation.navigate('Login'); }}>
                  <Ionicons name="log-in-outline" size={20} color="#2e7d32" />
                  <Text style={styles.menuItemText}>Parent Login</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Main Content Area */}
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* 2. SCROLLABLE BANNER (CAROUSEL) */}
          <View style={styles.bannerContainer}>
              <ScrollView
                ref={scrollRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={onScroll}
                style={styles.bannerScrollView}
              >
                {banners.map((img, index) => (
                  <TouchableOpacity 
                    key={index} 
                    activeOpacity={0.9} 
                    onPress={() => navigation.navigate('EventList')}
                  >
                    <Image source={img} style={styles.bannerImage} resizeMode="cover" />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            
            {/* Banner Pagination Dots */}
            <View style={styles.pagination}>
              {banners.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    { backgroundColor: activeBanner === index ? '#fbc02d' : 'rgba(255,255,255,0.5)' },
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Welcome Text */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Welcome to Green Park</Text>
            <Text style={styles.welcomeSubtitle}>Your gateway to excellence in education</Text>
          </View>

          {/* 3. FEATURE GRID (6 BOXES) */}
          <View style={styles.gridContainer}>
            {features.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                onPress={() => navigation.navigate(item.screen)}
                activeOpacity={0.8}
              >
                <View style={styles.iconContainer}>
                  <Text style={styles.emojiIcon}>{item.icon}</Text>
                </View>
                <Text style={styles.cardTitle}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Footer info */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>© 2026 Green Park Matric Hr Sec School</Text>
          </View>

        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#2e7d32',
  },
  container: {
    flex: 1,
    backgroundColor: '#f1f8f4',
  },
  header: {
    backgroundColor: '#2e7d32',
    height: 95,
    paddingTop: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  headerIcon: {
    padding: 6,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  headerLogo: {
    width: 38,
    height: 38,
    marginRight: 10,
    borderRadius: 19, // Half of width/height for perfect circle
    backgroundColor: '#ffffff', // Ensures logo pops against green
    borderWidth: 1.5,
    borderColor: '#ffffff', // Minimal white border for contrast
    overflow: 'hidden',
  },
  headerTitleText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  avatarButton: {
    marginLeft: 4,
    padding: 2,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#ffffff',
    backgroundColor: '#ffffff',
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
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fbc02d',
    borderWidth: 1.5,
    borderColor: '#2e7d32',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  menuDropdown: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 8,
    width: 160,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  menuItemText: {
    fontSize: 14,
    color: '#1b5e20',
    marginLeft: 12,
    fontWeight: '600',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#f1f8f4',
    marginVertical: 4,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  bannerContainer: {
    marginTop: 15,
    paddingHorizontal: 16,
    height: 180,
  },
  bannerScrollView: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  bannerImage: {
    width: width - 32,
    height: 180,
    borderRadius: 12,
  },
  pagination: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  welcomeSection: {
    marginTop: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  welcomeSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  gridContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#ffffff',
    width: (width - 48) / 2,
    height: 130,
    borderRadius: 15,
    padding: 15,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e8f5e9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  emojiIcon: {
    fontSize: 26,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2e7d32',
    textAlign: 'center',
  },
  footer: {
    marginTop: 10,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
    color: '#999',
  },
});

export default HomeScreen;
