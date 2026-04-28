import axios from 'axios';

export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.indinexz.com';

const galleryApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getEvents = async () => {
  try {
    console.log(`Fetching events from: ${API_URL}/api/v1/events`);
    const response = await galleryApi.get('/api/v1/events');
    console.log('Events API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error.response || error.message);
    throw error;
  }
};

export const getEventById = async (id) => {
  try {
    console.log(`Fetching event ${id} from: ${API_URL}/api/v1/events/${id}`);
    const response = await galleryApi.get(`/api/v1/events/${id}`);
    console.log(`Event ${id} API Response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching event ${id}:`, error.response || error.message);
    throw error;
  }
};

export default {
  getEvents,
  getEventById,
};
