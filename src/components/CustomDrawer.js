import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

export default function CustomDrawer(props) {
  const menuItems = [
    { label: 'Event Gallery', icon: 'images-outline', screen: 'EventList' },
    { label: 'Notice Board', icon: 'megaphone-outline', screen: 'NoticeScreen' },
    { label: 'Contact Us & Administration', icon: 'call-outline', screen: 'ContactScreen' },
    { label: 'Student Login', icon: 'school-outline', screen: 'Login' },
    { label: 'About Us', icon: 'business-outline', screen: 'AboutScreen' },
    { label: 'Social Media', icon: 'globe-outline', screen: 'SocialScreen' },
  ];

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerScrollView}>
        {/* Drawer Header - School Section */}
        <View style={styles.headerContainer}>
          <View style={styles.logoCircle}>
            <Image
              source={require('../../assets/images/round.png')}
              style={styles.schoolLogo}
              resizeMode="cover"
            />
          </View>
          <Text style={styles.schoolName}>GREEN PARK MATRIC HR SEC SCHOOL</Text>
        </View>

        {/* Divider line below header */}
        <View style={styles.divider} />

        {/* Drawer Menu Items */}
        <View style={styles.menuItemsContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                props.state.routes[props.state.index].name === item.screen && styles.activeMenuItem
              ]}
              onPress={() => {
                props.navigation.navigate(item.screen);
                props.navigation.closeDrawer();
              }}
            >
              <Ionicons 
                name={item.icon} 
                size={22} 
                color={props.state.routes[props.state.index].name === item.screen ? '#2e7d32' : '#2e7d32'} 
              />
              <Text style={[
                styles.menuText,
                props.state.routes[props.state.index].name === item.screen && styles.activeMenuText
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </DrawerContentScrollView>

      {/* Optional: Footer section if needed, but keeping it clean as requested */}
      <View style={styles.footerContainer}>
        <Text style={styles.versionText}>Version 1.0.2</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerScrollView: {
    backgroundColor: '#ffffff',
    paddingTop: 0,
  },
  headerContainer: {
    paddingTop: 60,
    paddingBottom: 25,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    // Soft shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    overflow: 'hidden',
  },
  schoolLogo: {
    width: '100%',
    height: '100%',
  },
  schoolName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1b5e20',
    textAlign: 'center',
    lineHeight: 22,
    letterSpacing: 0.5,
  },
  divider: {
    height: 1.5,
    backgroundColor: '#c8e6c9', // Darker green for visibility
    marginHorizontal: 30,
    marginTop: 25,
    marginBottom: 10,
  },
  menuItemsContainer: {
    paddingTop: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    marginVertical: 4,
    borderRadius: 10,
  },
  activeMenuItem: {
    backgroundColor: '#e8f5e9', // Active item highlight
  },
  menuText: {
    fontSize: 15,
    color: '#1b5e20',
    marginLeft: 15,
    fontWeight: '500',
  },
  activeMenuText: {
    color: '#1b5e20',
    fontWeight: '700',
  },
  footerContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f1f8f4',
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
    color: '#999',
  },
});
