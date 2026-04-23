const BASE_URL = 'https://api.indinexz.com';

const request = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });

    const data = await response.json();
    
    // Log the API result for debugging
    console.log('API RESULT:', data);

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
  // Backend expects phone_number, password, and role
  const requestBody = {
    phone_number: mobile,
    password: password,
    role: 'parent',
  };

  console.log('LOGIN REQUEST:', requestBody);

  // Correct Endpoint: /api/v1/login
  return request('/api/v1/login', {
    method: 'POST',
    body: JSON.stringify(requestBody),
  });
};




