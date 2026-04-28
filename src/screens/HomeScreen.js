import React, { useEffect, useState, useRef } from 'react';
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
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [activeBanner, setActiveBanner] = useState(0);
  const [menuVisible, setMenuVisible] = useState(false);
  const scrollRef = useRef(null);

  const banners = [
    require('../../assets/images/newbanner1.png'),
    require('../../assets/images/new bannr2.png'),
    require('../../assets/images/new benner3.png'),
  ];

  const features = [
    { id: '1', title: 'Event Gallery', icon: '📸', screen: 'GalleryScreen' },
    { id: '2', title: 'Notice Board', icon: '📢', screen: 'NoticeScreen' },
    { id: '3', title: 'Contact Us', icon: '📞', screen: 'ContactScreen' },
    { id: '4', title: 'Student Login', icon: '🎓', screen: 'Login' },
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
          <Text style={styles.headerTitle}>GREEN PARK MATRIC</Text>
          <Text style={styles.headerSubtitle}>HR SEC SCHOOL</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.headerIcon} 
            onPress={() => navigation.navigate('Notifications')}
          >
            <Ionicons name="notifications-outline" size={26} color="#ffffff" />
            <View style={styles.badge} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.headerIcon} onPress={toggleMenu}>
            <Ionicons name="ellipsis-vertical" size={24} color="#ffffff" />
          </TouchableOpacity>
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
              <TouchableOpacity style={styles.menuItem} onPress={() => { toggleMenu(); /* Navigate to Profile */ }}>
                <Ionicons name="person-outline" size={20} color="#2e7d32" />
                <Text style={styles.menuItemText}>Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => { toggleMenu(); /* Navigate to Settings */ }}>
                <Ionicons name="settings-outline" size={20} color="#2e7d32" />
                <Text style={styles.menuItemText}>Settings</Text>
              </TouchableOpacity>
              <View style={styles.menuDivider} />
              <TouchableOpacity style={styles.menuItem} onPress={() => { toggleMenu(); navigation.replace('Login'); }}>
                <Ionicons name="log-out-outline" size={20} color="#d32f2f" />
                <Text style={[styles.menuItemText, { color: '#d32f2f' }]}>Logout</Text>
              </TouchableOpacity>
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
                    onPress={() => navigation.navigate('GalleryScreen')}
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
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  headerIcon: {
    padding: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitleContainer: {
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  headerSubtitle: {
    color: '#fbc02d',
    fontSize: 10,
    fontWeight: '600',
    marginTop: -2,
    letterSpacing: 0.5,
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
