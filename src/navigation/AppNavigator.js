import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import CustomDrawer from '../components/CustomDrawer';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Placeholder screens for other sections
const AttendanceScreen = () => <View style={styles.center}><Text>Attendance Screen</Text></View>;
const FeesScreen = () => <View style={styles.center}><Text>Fees Screen</Text></View>;
const MarksScreen = () => <View style={styles.center}><Text>Marks Screen</Text></View>;
const NotificationsScreen = () => <View style={styles.center}><Text>Notifications Screen</Text></View>;
const ProfileScreen = () => <View style={styles.center}><Text>Profile Screen</Text></View>;
const SettingsScreen = () => <View style={styles.center}><Text>Settings Screen</Text></View>;

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={({ navigation }) => ({
        headerStyle: {
          backgroundColor: '#2e7d32',
          height: 60,
          elevation: 5,
          shadowOpacity: 0.3,
        },
        headerTitleStyle: {
          color: '#ffffff',
          fontWeight: 'bold',
          fontSize: 18,
        },
        headerTitleAlign: 'center',
        headerTintColor: '#ffffff',
        headerTitle: 'Parent Portal', // Center Section
        
        // Custom Navbar Section
        headerLeft: () => (
          <TouchableOpacity 
            onPress={() => navigation.toggleDrawer()}
            style={{ marginLeft: 16 }}
          >
            <Ionicons name="menu" size={28} color="#ffffff" />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <View style={{ flexDirection: 'row', marginRight: 16 }}>
            <TouchableOpacity style={{ marginRight: 15 }}>
              <View>
                <Ionicons name="notifications-outline" size={24} color="#ffffff" />
                <View style={styles.badge}><Text style={styles.badgeText}>2</Text></View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="ellipsis-vertical" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
        ),
        drawerActiveBackgroundColor: '#e8f5e9',
        drawerActiveTintColor: '#1b5e20',
        drawerInactiveTintColor: '#1b5e20',
        drawerLabelStyle: {
          marginLeft: -10,
          fontSize: 16,
          fontWeight: '600',
        },
        itemStyle: {
          borderLeftWidth: 5,
          borderLeftColor: 'transparent',
          marginVertical: 5,
        },
      })}
    >
      <Drawer.Screen 
        name="Home" 
        component={DashboardScreen} 
        options={{
          drawerIcon: ({ color }) => <Ionicons name="home-outline" size={22} color={color} />,
        }}
      />
      <Drawer.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          drawerIcon: ({ color }) => <Ionicons name="person-outline" size={22} color={color} />,
        }}
      />
      <Drawer.Screen 
        name="Attendance" 
        component={AttendanceScreen} 
        options={{
          drawerIcon: ({ color }) => <Ionicons name="calendar-outline" size={22} color={color} />,
        }}
      />
      <Drawer.Screen 
        name="Fees" 
        component={FeesScreen} 
        options={{
          drawerIcon: ({ color }) => <Ionicons name="cash-outline" size={22} color={color} />,
        }}
      />
      <Drawer.Screen 
        name="Marks" 
        component={MarksScreen} 
        options={{
          drawerIcon: ({ color }) => <Ionicons name="document-text-outline" size={22} color={color} />,
        }}
      />
      <Drawer.Screen 
        name="Notifications" 
        component={NotificationsScreen} 
        options={{
          drawerIcon: ({ color }) => <Ionicons name="notifications-outline" size={22} color={color} />,
        }}
      />
      <Drawer.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{
          drawerIcon: ({ color }) => <Ionicons name="settings-outline" size={22} color={color} />,
        }}
      />
    </Drawer.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Dashboard" component={DrawerNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f8f4',
  },
  badge: {
    position: 'absolute',
    right: -4,
    top: -4,
    backgroundColor: '#fbc02d',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#2e7d32',
  },
  badgeText: {
    color: '#1b5e20',
    fontSize: 9,
    fontWeight: 'bold',
  }
});
