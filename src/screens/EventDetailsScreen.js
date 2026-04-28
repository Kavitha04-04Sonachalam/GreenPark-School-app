import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator, 
  Dimensions,
  Modal,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import CommonHeader from '../components/CommonHeader';
import { getEventById } from '../services/galleryApi';
import { getMediaUrl, getPlaceholderImage } from '../utils/media';

const { width } = Dimensions.get('window');
const GRID_SPACING = 10;
const ITEM_WIDTH = (width - 40 - GRID_SPACING) / 2;

const EventDetailsScreen = ({ route, navigation }) => {
  const { eventId } = route.params;
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showFullMedia, setShowFullMedia] = useState(false);

  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const response = await getEventById(eventId);
      
      // Handle both { data: {...} } and {...} formats
      const eventData = response?.data || response;
      setEvent(eventData);
    } catch (error) {
      console.error('Failed to fetch event details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMediaPress = (media) => {
    setSelectedMedia(media);
    setShowFullMedia(true);
  };

  const renderMediaItem = ({ item }) => {
    const isVideo = item.type === 'video' || item.url?.endsWith('.mp4');
    
    return (
      <TouchableOpacity 
        style={styles.mediaItem} 
        onPress={() => handleMediaPress(item)}
        activeOpacity={0.8}
      >
        <Image 
          source={{ uri: getMediaUrl(item) || getPlaceholderImage() }} 
          style={styles.mediaThumbnail} 
          resizeMode="cover"
        />
        {isVideo && (
          <View style={styles.playOverlay}>
            <Ionicons name="play-circle" size={40} color="#ffffff" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2e7d32" />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle-outline" size={60} color="#d32f2f" />
        <Text style={styles.errorText}>Event details not available</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonLarge}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CommonHeader title="Event Details" navigation={navigation} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.detailsContainer}>
          <Text style={styles.eventName}>{event.name}</Text>
          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={16} color="#2e7d32" />
            <Text style={styles.dateText}>{event.date || 'School Event'}</Text>
          </View>
          <View style={styles.divider} />
          <Text style={styles.description}>{event.description}</Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Gallery</Text>
          <Text style={styles.mediaCount}>
            {event.media && event.media.length > 0 ? event.media.length : (getMediaUrl(event) ? 1 : 0)} Items
          </Text>
        </View>
        
        <FlatList
          data={event.media && event.media.length > 0 ? event.media : (getMediaUrl(event) ? [event] : [])}
          renderItem={renderMediaItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={styles.columnWrapper}
          ListEmptyComponent={
            <View style={styles.emptyMediaContainer}>
              <Ionicons name="images-outline" size={40} color="lightgrey" />
              <Text style={styles.emptyMedia}>No photos or videos in this gallery.</Text>
            </View>
          }
        />
      </ScrollView>

      {/* Full Screen Media Modal */}
      <Modal
        visible={showFullMedia}
        transparent={false}
        animationType="fade"
        onRequestClose={() => setShowFullMedia(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={() => setShowFullMedia(false)}
          >
            <Ionicons name="close" size={30} color="#ffffff" />
          </TouchableOpacity>
          
          {selectedMedia && (
            selectedMedia.type === 'video' || selectedMedia.url?.endsWith('.mp4') ? (
              <Video
                source={{ uri: selectedMedia.url }}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode="contain"
                shouldPlay
                useNativeControls
                style={styles.fullMedia}
              />
            ) : (
              <Image 
                source={{ uri: getMediaUrl(selectedMedia) || getPlaceholderImage() }} 
                style={styles.fullMedia} 
                resizeMode="contain" 
              />
            )
          )}
        </View>
      </Modal>
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
    backgroundColor: '#e8f5e9',
  },
  scrollContent: {
    padding: 16,
  },
  detailsContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 20,
    marginBottom: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  eventName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1b5e20',
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  dateText: {
    fontSize: 14,
    color: '#2e7d32',
    marginLeft: 6,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginBottom: 15,
  },
  description: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1b5e20',
  },
  mediaCount: {
    fontSize: 12,
    color: 'grey',
    fontWeight: '500',
  },
  columnWrapper: {
    justifyContent: 'flex-start',
    gap: GRID_SPACING,
  },
  mediaItem: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: GRID_SPACING,
    backgroundColor: '#ffffff',
    elevation: 2,
  },
  mediaThumbnail: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyMediaContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyMedia: {
    textAlign: 'center',
    color: 'grey',
    marginTop: 10,
    fontSize: 14,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    marginVertical: 15,
  },
  backButtonLarge: {
    backgroundColor: '#2e7d32',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
  },
  backButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 25,
  },
  fullMedia: {
    width: '100%',
    height: '100%',
  },
});

export default EventDetailsScreen;
