import axios from 'axios';

// Create axios instance with base URL from environment variables
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000
});

// Add request interceptor for logging or authentication
apiClient.interceptors.request.use(
  config => {
    // You could add authentication headers here
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Handle common errors
    if (error.response) {
      // Server responded with a status code outside of 2xx range
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network Error:', error.request);
    } else {
      // Something else happened while setting up the request
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// User API service
export const userService = {
  // Get all users
  getUsers() {
    return apiClient.get('/users');
  },

  // Get a specific user by ID
  getUser(id) {
    return apiClient.get(`/users/${id}`);
  }
};

export default apiClient;
