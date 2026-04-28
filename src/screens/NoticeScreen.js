import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import CommonHeader from '../components/CommonHeader';

const NoticeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [notices, setNotices] = useState([]);
  const [filteredNotices, setFilteredNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      fetchAnnouncements();
    }, [])
  );

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredNotices(notices);
    } else {
      const filtered = notices.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredNotices(filtered);
    }
  }, [searchQuery, notices]);

  const fetchAnnouncements = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('token');
      console.log('TOKEN STATUS:', token ? 'Token Found' : 'No Token Found');
      
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Try fetching announcements
      let response = await fetch('https://api.indinexz.com/api/v1/admin/announcements', {
        method: 'GET',
        headers: headers,
      });

      // Fallback: If 404 or 401, try the public endpoint
      if (!response.ok) {
        console.log('Trying public fallback...');
        const publicResponse = await fetch('https://api.indinexz.com/api/v1/announcements', {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
        });
        if (publicResponse.ok) response = publicResponse;
      }

      const data = await response.json();
      console.log('Announcements Response:', data);

      if (response.ok) {
        // Handle both direct array and nested data object
        const noticeList = Array.isArray(data) ? data : (data.data || []);
        setNotices(noticeList);
        setFilteredNotices(noticeList);
      } else if (response.status === 401) {
        Alert.alert('Session Expired', 'Please login to view announcements.', [
          { text: 'Login', onPress: () => navigation.navigate('Login') },
          { text: 'Cancel', style: 'cancel' }
        ]);
      } else {
        console.warn('Notice fetch failed:', data.message);
      }
    } catch (error) {
      console.error('Fetch Error:', error);
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

  const renderNoticeItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name="notifications-circle" size={24} color="#2e7d32" />
        <Text style={styles.noticeTitle}>{item.title}</Text>
      </View>
      <Text style={styles.noticeMessage}>{item.message}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.noticeDate}>{formatDate(item.created_at)}</Text>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#2e7d32" />
        <Text style={styles.loadingText}>Loading announcements...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CommonHeader title="Notice Board" navigation={navigation} />

      {/* 2. SEARCH BAR */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#66bb6a" style={styles.searchIcon} />
          <TextInput
            placeholder="Search notifications"
            placeholderTextColor="#999"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 3. NOTIFICATIONS LIST */}
      <FlatList
        data={filteredNotices}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderNoticeItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="megaphone-outline" size={80} color="#66bb6a" opacity={0.5} />
            <Text style={styles.emptyText}>No announcements available</Text>
          </View>
        }
        refreshing={isLoading}
        onRefresh={fetchAnnouncements}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f8f4',
  },
  // APP BAR STYLES
  appBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    // Removed fixed marginTop to use dynamic safe area insets
  },
  appBarTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1b5e20',
    textAlign: 'center',
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // SEARCH BAR STYLES
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#e8f5e9',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1b5e20',
    height: '100%',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f8f4',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#1b5e20',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#2e7d32',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  noticeTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginLeft: 8,
    flex: 1,
  },
  noticeMessage: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginBottom: 10,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#f1f1f1',
    paddingTop: 8,
    alignItems: 'flex-end',
  },
  noticeDate: {
    fontSize: 12,
    color: '#757575',
    fontStyle: 'italic',
  },
  emptyContainer: {
    marginTop: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 15,
    fontSize: 16,
    color: '#66bb6a',
    fontWeight: '500',
  },
});

export default NoticeScreen;
