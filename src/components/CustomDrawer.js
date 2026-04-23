import React, { useEffect, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function CustomDrawer(props) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const userJson = await AsyncStorage.getItem('user');
      if (userJson) {
        setUserData(JSON.parse(userJson));
      }
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.clear();
    props.navigation.replace('Login');
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerScrollView}>
        {/* Drawer Header - Profile Section */}
        <View style={styles.headerContainer}>
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={40} color="#2e7d32" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.userName} numberOfLines={1}>
                {userData?.name || 'Parent Name'}
              </Text>
              <Text style={styles.userClass}>
                {userData?.children?.[0]?.class_name || userData?.children?.[0]?.grade || 'GreenPark Parent'}
              </Text>
            </View>
          </View>
        </View>

        {/* Drawer Menu Items */}
        <View style={styles.menuItemsContainer}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>

      {/* Logout Button at Bottom */}
      <View style={styles.footerContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#d32f2f" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
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
    padding: 20,
    backgroundColor: '#e8f5e9',
    marginBottom: 10,
    paddingTop: 40,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#2e7d32',
  },
  textContainer: {
    marginLeft: 15,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1b5e20',
  },
  userClass: {
    fontSize: 14,
    color: '#2e7d32',
    marginTop: 2,
    fontWeight: '500',
  },
  menuItemsContainer: {
    flex: 1,
    paddingTop: 10,
  },
  footerContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f1f8f4',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  logoutText: {
    fontSize: 16,
    color: '#d32f2f',
    marginLeft: 15,
    fontWeight: '600',
  },
});
