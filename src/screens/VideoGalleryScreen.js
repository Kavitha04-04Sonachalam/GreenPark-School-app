import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  Dimensions 
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import CommonHeader from '../components/CommonHeader';
import { getEvents } from '../services/galleryApi';

const { width } = Dimensions.get('window');

const VideoGalleryScreen = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await getEvents();
      
      // Handle both { data: [...] } and [...] formats
      const allEvents = response?.data || (Array.isArray(response) ? response : []);
      
      // Filter: Only show events that actually have video media
      const filteredEvents = allEvents.filter(event => {
        const hasVideoMedia = event.media && Array.isArray(event.media) && event.media.some(m => m.type === 'video' || m.url?.endsWith('.mp4'));
        const hasVideoField = !!(event.video_url || event.video);
        return hasVideoMedia || hasVideoField;
      });
      
      setEvents(filteredEvents);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchEvents();
    }, [])
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => navigation.navigate('EventDetails', { eventId: item.id })}
      activeOpacity={0.7}
    >
      <View style={styles.videoPlaceholder}>
        <Ionicons name="play" size={24} color="#2e7d32" />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.eventName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.eventDate}>{item.date || 'Video Event'}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="lightgrey" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <CommonHeader title="Video Gallery" navigation={navigation} />

      {loading && events.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2e7d32" />
        </View>
      ) : (
        <FlatList
          data={events}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          onRefresh={fetchEvents}
          refreshing={loading}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No video events available.</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f5e9',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingVertical: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginVertical: 6,
    marginHorizontal: 12,
    padding: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    minHeight: 80,
  },
  videoPlaceholder: {
    width: 56,
    height: 56,
    backgroundColor: '#fff8e1',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  eventName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1b5e20',
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 12,
    color: 'grey',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    marginTop: 100,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 14,
    color: 'grey',
    textAlign: 'center',
  },
});

export default VideoGalleryScreen;
