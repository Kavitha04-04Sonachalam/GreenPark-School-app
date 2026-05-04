import React, { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
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
import { getEventById, getEventMedia } from '../services/galleryApi';
import { getMediaUrl, getPlaceholderImage } from '../utils/media';
import YoutubePlayer from 'react-native-youtube-iframe';

function getYouTubeId(url) {
  if (!url) return null;
  const regExp = /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([^&?\/]+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

const { width } = Dimensions.get('window');
const GRID_SPACING = 8;
const ITEM_WIDTH = (width - 40 - GRID_SPACING) / 2;

const EventDetailsScreen = ({ route, navigation }) => {
  const { eventId } = route.params;
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showFullMedia, setShowFullMedia] = useState(false);
  const [playing, setPlaying] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchEventDetails();
    }, [eventId])
  );

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const [eventResponse, mediaResponse] = await Promise.all([
        getEventById(eventId),
        getEventMedia(eventId).catch(e => {
          console.log('Failed to fetch media:', e);
          return null;
        })
      ]);
      
      // Handle both { data: {...} } and {...} formats
      let eventData = eventResponse?.data || eventResponse;
      
      const mediaData = mediaResponse?.data || mediaResponse;
      if (mediaData && Array.isArray(mediaData)) {
        eventData = { ...eventData, media: mediaData };
      }
      
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
    if (media.type === 'youtube' || media.media_type === 'youtube') {
      // Small delay to ensure modal is rendered before autoplay
      setTimeout(() => setPlaying(true), 300);
    }
  };

  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
    } else if (state === "playing") {
      setPlaying(true);
    } else if (state === "paused") {
      setPlaying(false);
    }
  }, []);

  const renderMediaItem = ({ item }) => {
    const isVideo = item.type === 'video' || item.media_type === 'video' || item.url?.endsWith('.mp4') || item.media_url?.endsWith('.mp4') || item.url?.endsWith('.mov') || item.media_url?.endsWith('.mov');
    const isYouTube = item.type === 'youtube' || item.media_type === 'youtube';
    
    let thumbUrl = getMediaUrl(item) || getPlaceholderImage();
    if (isYouTube) {
      const videoId = getYouTubeId(item.media_url || item.url);
      if (videoId) {
        thumbUrl = `https://img.youtube.com/vi/${videoId}/0.jpg`;
      }
    }
    
    return (
      <TouchableOpacity 
        style={styles.mediaItem} 
        onPress={() => handleMediaPress(item)}
        activeOpacity={0.8}
      >
        <Image 
          source={{ uri: thumbUrl }} 
          style={styles.mediaThumbnail} 
          resizeMode="cover"
        />
        {(isVideo || isYouTube) && (
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
            onPress={() => {
              setShowFullMedia(false);
              setPlaying(false);
            }}
          >
            <Ionicons name="close" size={30} color="#ffffff" />
          </TouchableOpacity>
          
          {selectedMedia && (
            selectedMedia.type === 'youtube' || selectedMedia.media_type === 'youtube' ? (
              <View style={styles.youtubeWrapper}>
                <YoutubePlayer
                  height={250}
                  play={playing}
                  videoId={getYouTubeId(selectedMedia.media_url || selectedMedia.url)}
                  onChangeState={onStateChange}
                  webViewProps={{
                    androidLayerType: 'hardware',
                  }}
                  forceAndroidAutoplay={true}
                />
              </View>
            ) : selectedMedia.type === 'video' || selectedMedia.media_type === 'video' || selectedMedia.url?.endsWith('.mp4') || selectedMedia.media_url?.endsWith('.mp4') || selectedMedia.url?.endsWith('.mov') || selectedMedia.media_url?.endsWith('.mov') ? (
              <Video
                source={{ uri: getMediaUrl(selectedMedia) }}
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
  youtubeWrapper: {
    width: '100%',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
});

export default EventDetailsScreen;
