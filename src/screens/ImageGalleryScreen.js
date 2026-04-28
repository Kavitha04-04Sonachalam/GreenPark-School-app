import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator, 
  Dimensions 
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import CommonHeader from '../components/CommonHeader';
import { getEvents } from '../services/galleryApi';
import { getMediaUrl, getPlaceholderImage } from '../utils/media';

const { width } = Dimensions.get('window');

const ImageGalleryScreen = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await getEvents();
      
      // Handle both { data: [...] } and [...] formats
      const allEvents = response?.data || (Array.isArray(response) ? response : []);
      
      // Filter: Show events that likely have images
      const filteredEvents = allEvents.filter(event => {
        // If it has any of these fields, it's likely an image event
        const hasImageField = !!(event.thumbnail_url || event.thumbnail || event.image || event.image_url || event.url || event.file_path);
        
        // If it's not explicitly a video-only event, show it in images
        const isVideoOnly = event.media && event.media.length > 0 && event.media.every(m => m.type === 'video' || m.url?.endsWith('.mp4'));

        return hasImageField || !isVideoOnly;
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
      <Image 
        source={{ uri: getMediaUrl(item) || getPlaceholderImage() }} 
        style={styles.thumbnail} 
        resizeMode="cover"
      />
      <View style={styles.cardContent}>
        <Text style={styles.eventName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.eventDate}>{item.date || 'School Event'}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <CommonHeader title="Photo Gallery" navigation={navigation} />

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
              <Text style={styles.emptyText}>No events available at the moment.</Text>
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
    padding: 10,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    minHeight: 80,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f1f8f4',
  },
  cardContent: {
    flex: 1,
    marginLeft: 12,
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

export default ImageGalleryScreen;
