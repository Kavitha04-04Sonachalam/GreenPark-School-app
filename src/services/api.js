import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://api.indinexz.com';

const request = async (endpoint, options = {}) => {
  try {
    const token = await AsyncStorage.getItem('token');
    
    const headers = {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();
    
    // Log the API result for debugging
    console.log(`API [${options.method || 'GET'}] ${endpoint}:`, data);

    if (!response.ok) {
      throw new Error(data?.message || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error.message);
    throw error;
  }
};

export const loginUser = async (mobile, password) => {
  const requestBody = {
    phone_number: mobile,
    password: password,
    role: 'parent',
  };

  return request('/api/v1/login', {
    method: 'POST',
    body: JSON.stringify(requestBody),
  });
};

// --- Student & Parent APIs ---

export const getStudents = async (parentId) => {
  return request(`/api/v1/students/${parentId}`);
};

export const getMarks = async (studentId) => {
  return request(`/api/v1/marks/${studentId}`);
};

export const getAttendance = async (studentId) => {
  return request(`/api/v1/attendance/${studentId}`);
};

export const getFees = async (studentId) => {
  return request(`/api/v1/fees/${studentId}`);
};

export const getNotifications = async (className) => {
  const endpoint = className 
    ? `/api/v1/parent/notifications?class_name=${className}`
    : '/api/v1/parent/notifications';
  return request(endpoint);
};
export const changePassword = async (phone, currentPassword, newPassword) => {
  const requestBody = {
    phone_number: phone,
    current_password: currentPassword,
    new_password: newPassword,
  };

  return request('/api/v1/change-password', {
    method: 'POST',
    body: JSON.stringify(requestBody),
  });
};

export const getStudentsByParent = async (parentId) => {
  return request(`/api/v1/students/${parentId}`);
};

// --- Profile APIs ---

export const getParentProfile = async (parentId) => {
  return request(`/api/v1/profile/${parentId}`);
};

export const uploadProfilePhoto = async (formData) => {
  return request('/api/v1/profile/upload-photo', {
    method: 'POST',
    body: formData,
  });
};
