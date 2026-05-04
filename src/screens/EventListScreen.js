import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator 
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import CommonHeader from '../components/CommonHeader';
import { getEvents } from '../services/galleryApi';
import { getMediaUrl, getPlaceholderImage } from '../utils/media';

const EventListScreen = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchEvents();
    }, [])
  );

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await getEvents();
      const eventsData = response?.data || response || [];
      // If it returns an array directly or inside data
      setEvents(Array.isArray(eventsData) ? eventsData : []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    let thumbnailUrl = getPlaceholderImage();
    if (getMediaUrl(item)) {
      // Prioritize the event's own thumbnail if it exists
      thumbnailUrl = getMediaUrl(item);
    } else if (item.media && item.media.length > 0) {
      // Fallback to the first media item inside the event
      thumbnailUrl = getMediaUrl(item.media[0]) || thumbnailUrl;
    }

    return (
      <TouchableOpacity 
        style={styles.card} 
        onPress={() => navigation.navigate('EventDetails', { eventId: item.id })}
        activeOpacity={0.8}
      >
        <Image 
          source={{ uri: thumbnailUrl }} 
          style={styles.thumbnail} 
          resizeMode="cover"
        />
        <View style={styles.textContainer}>
          <Text style={styles.eventName} numberOfLines={2}>{item.name || 'Event Name'}</Text>
          <Text style={styles.eventDate}>{item.date || 'Date TBD'}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <CommonHeader title="Event Gallery" navigation={navigation} />
      
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2e7d32" />
        </View>
      ) : events.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No events found.</Text>
        </View>
      ) : (
        <FlatList
          data={events}
          renderItem={renderItem}
          keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
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
    paddingVertical: 10,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 10,
    marginHorizontal: 10,
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  thumbnail: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  textContainer: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  eventName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1b5e20',
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 13,
    color: 'grey',
  },
  emptyText: {
    fontSize: 16,
    color: 'grey',
  },
});

export default EventListScreen;
