import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT token if it exists
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle Refresh Token on 401 Unauthorized
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          // Note: call refresh API directly on axios to avoid circular interceptor call
          const response = await axios.post(
            `${API.defaults.baseURL}/api/auth/refresh?refreshToken=${refreshToken}`
          );
          const { token, refreshToken: newRefreshToken } = response.data;

          localStorage.setItem('token', token);
          localStorage.setItem('refreshToken', newRefreshToken);

          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return API(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token failed or expired -> log out user
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
