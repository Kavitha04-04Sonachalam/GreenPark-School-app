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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Modal } from 'react-native';

export default function CustomDrawer(props) {
  const menuItems = [
    { label: 'My Profile', icon: 'person-outline', screen: 'Profile' },
    { label: 'Event Gallery', icon: 'images-outline', screen: 'EventList' },
    { label: 'Notice Board', icon: 'megaphone-outline', screen: 'NoticeScreen' },
    { label: 'Contact Us', icon: 'call-outline', screen: 'ContactScreen' },
    { label: 'Settings', icon: 'settings-outline', screen: 'Settings' },
    { label: 'About Us', icon: 'business-outline', screen: 'AboutScreen' },
    { label: 'Social Media', icon: 'globe-outline', screen: 'SocialScreen' },
  ];

  const [logoutModalVisible, setLogoutModalVisible] = React.useState(false);
  const [studentInfo, setStudentInfo] = React.useState(null);
  const [parentInfo, setParentInfo] = React.useState(null);

  React.useEffect(() => {
    // Load data once on mount
    loadData();

    // Refresh data whenever the drawer is opened
    const unsubscribe = props.navigation.addListener('state', (e) => {
      // The state listener can detect if the drawer is opening
      loadData();
    });

    return unsubscribe;
  }, [props.navigation]);

  const loadData = async () => {
    try {
      const userJson = await AsyncStorage.getItem('user');
      const selectedStudentJson = await AsyncStorage.getItem('selected_student');
      const selectedId = await AsyncStorage.getItem('selected_student_id');
      
      if (userJson) {
        const user = JSON.parse(userJson);
        setParentInfo(user);
        
        // 1. Try to load the explicitly selected student first
        if (selectedStudentJson) {
          console.log('Drawer - Found selected_student object');
          setStudentInfo(JSON.parse(selectedStudentJson));
        } else {
          // 2. Fallback to finding it in the children list
          const children = user.children || user.students || user.student_list || [];
          if (children.length > 0) {
            const currentStudent = children.find(s => 
              String(s.student_id || s.id) === String(selectedId)
            ) || children[0];
            setStudentInfo(currentStudent);
          } else {
            setStudentInfo(null);
          }
        }
      }
    } catch (error) {
      console.error('Error loading student data for drawer:', error);
    }
  };

  const handleLogout = async () => {
    try {
      setLogoutModalVisible(false);
      // Clear all auth related storage
      await AsyncStorage.multiRemove([
        'token', 
        'user', 
        'selected_student_id', 
        'selected_class_name',
        'parent_id'
      ]);
      // Redirect to Login and reset the stack
      props.navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerScrollView}>
        {/* Drawer Header - Student Profile Section */}
        <View style={styles.profileHeaderContainer}>
          <TouchableOpacity 
            style={styles.avatarWrapper}
            onPress={() => {
              props.navigation.navigate('Profile');
              props.navigation.closeDrawer();
            }}
          >
            {parentInfo?.profile_image_url || parentInfo?.profile_image ? (
              <Image
                source={{ uri: `${parentInfo.profile_image_url || parentInfo.profile_image}?t=${new Date().getTime()}` }}
                style={styles.studentAvatar}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={50} color="#2e7d32" />
              </View>
            )}
          </TouchableOpacity>
          <View style={styles.studentDetails}>
            <Text style={styles.studentName}>
              {studentInfo 
                ? (studentInfo.first_name 
                    ? `${studentInfo.first_name} ${studentInfo.last_name || ''}` 
                    : (studentInfo.name || 'Student')) 
                : 'Select Student'}
            </Text>
            <Text style={styles.studentGrade}>
              {studentInfo 
                ? (studentInfo.class_ 
                    ? `Class: ${studentInfo.class_} - ${studentInfo.section || ''}` 
                    : (studentInfo.class ? `Class: ${studentInfo.class}` : 'No class assigned'))
                : 'No class assigned'}
            </Text>
          </View>
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

          {/* Separate Logout Section */}
          <View style={styles.logoutDivider} />
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setLogoutModalVisible(true)}
          >
            <Ionicons name="log-out-outline" size={22} color="#d32f2f" />
            <Text style={[styles.menuText, { color: '#d32f2f' }]}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Confirmation Modal */}
        <Modal
          transparent={true}
          visible={logoutModalVisible}
          animationType="fade"
          onRequestClose={() => setLogoutModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Ionicons name="alert-circle-outline" size={40} color="#2e7d32" />
                <Text style={styles.modalTitle}>Logout Confirmation</Text>
              </View>
              <Text style={styles.modalMessage}>Are you sure you want to logout?</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={styles.cancelButton} 
                  onPress={() => setLogoutModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.logoutButton} 
                  onPress={handleLogout}
                >
                  <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
  profileHeaderContainer: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  avatarWrapper: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#e8f5e9',
    // Premium Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  studentAvatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
  },
  avatarPlaceholder: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#f1f8f4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  studentDetails: {
    alignItems: 'center',
    marginTop: 5,
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1b5e20',
    textAlign: 'center',
    marginBottom: 4,
  },
  studentGrade: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f8f4',
    marginHorizontal: 30,
    marginTop: 10,
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
  logoutDivider: {
    height: 1,
    backgroundColor: '#f1f8f4',
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 25,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1b5e20',
    marginTop: 10,
  },
  modalMessage: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 10,
    borderRadius: 10,
    backgroundColor: '#f1f8f4',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#2e7d32',
    fontWeight: '600',
    fontSize: 15,
  },
  logoutButton: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 10,
    borderRadius: 10,
    backgroundColor: '#2e7d32',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15,
  },
});
