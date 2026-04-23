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
  return request('/login', {
    method: 'POST',
    body: JSON.stringify({
      mobile,
      password,
    }),
  });
};
