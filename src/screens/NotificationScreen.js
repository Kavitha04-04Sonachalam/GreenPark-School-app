import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import CommonHeader from '../components/CommonHeader';
import { getNotifications } from '../services/api';

const NotificationScreen = ({ route, navigation }) => {
  const { class_name, student_name } = route.params || {};
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      fetchNotifications();
    }, [class_name])
  );

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const data = await getNotifications(class_name);
      const notificationList = Array.isArray(data) ? data : (data.data || []);
      setNotifications(notificationList);
    } catch (error) {
      console.error('Fetch Error:', error);
      if (error.message.includes('401')) {
        Alert.alert('Session Expired', 'Please login to view notifications.', [
          { text: 'Login', onPress: () => navigation.navigate('Login') }
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const renderNotificationItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconCircle}>
          <Ionicons name="notifications" size={18} color="#ffffff" />
        </View>
        <Text style={styles.notificationTitle} numberOfLines={1}>{item.title}</Text>
      </View>
      
      <Text style={styles.notificationMessage}>{item.message}</Text>
      
      <View style={styles.cardFooter}>
        {item.class_name && (
          <View style={styles.tagContainer}>
            <Text style={styles.tagText}>Class: {item.class_name}</Text>
          </View>
        )}
        <Text style={styles.notificationDate}>{formatDate(item.created_at)}</Text>
      </View>
    </View>
  );

  if (isLoading && notifications.length === 0) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#2e7d32" />
        <Text style={styles.loadingText}>Loading notifications...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <CommonHeader title="Notifications" navigation={navigation} />

      <View style={styles.topInfo}>
        <Text style={styles.studentName}>{student_name || 'School Updates'}</Text>
        <Text style={styles.infoSubtitle}>Stay updated with important notices</Text>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item, index) => (item.id || index).toString()}
        renderItem={renderNotificationItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={60} color="#bdc3c7" />
            <Text style={styles.emptyText}>No notifications available</Text>
          </View>
        }
        refreshing={isLoading}
        onRefresh={fetchNotifications}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  topInfo: {
    backgroundColor: '#2e7d32',
    padding: 20,
    paddingBottom: 25,
  },
  studentName: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 13,
    marginTop: 4,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#2e7d32',
  },
  listContent: {
    padding: 16,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#2e7d32',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#576574',
    lineHeight: 20,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f1f1',
    paddingTop: 12,
  },
  tagContainer: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
    color: '#2e7d32',
    fontWeight: '600',
  },
  notificationDate: {
    fontSize: 12,
    color: '#95a5a6',
  },
  emptyContainer: {
    marginTop: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 15,
    fontSize: 15,
    color: '#bdc3c7',
    fontWeight: '500',
  },
});

export default NotificationScreen;

