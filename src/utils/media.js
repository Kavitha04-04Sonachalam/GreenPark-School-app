import { API_URL } from '../services/galleryApi';

/**
 * Robust helper to format media URLs (Images/Videos)
 * Handles absolute, relative, and various field names.
 */
export const getMediaUrl = (item) => {
  const path = item?.thumbnail_url || 
               item?.url || 
               item?.media_url ||
               item?.image || 
               item?.thumbnail || 
               item?.image_url || 
               item?.file_path || 
               item?.src;

  if (!path) return null;

  // If it's already an absolute URL, return it
  if (typeof path === 'string' && (path.startsWith('http://') || path.startsWith('https://'))) {
    return path;
  }

  // Handle relative paths
  // Ensure we don't double slash
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // Some backends use a different base for uploads, 
  // but we'll assume the API_URL is the root for now.
  return `${API_URL}${cleanPath}`;
};

export const getPlaceholderImage = () => 'https://via.placeholder.com/400x300?text=No+Image+Available';
