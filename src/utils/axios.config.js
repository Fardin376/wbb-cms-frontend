import axios from 'axios';

const instance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for CSRF token
instance.interceptors.request.use(
  async (config) => {
    // Ensure baseURL is set
    if (!config.baseURL) {
      console.error('API base URL is not defined');
      config.baseURL = 'https://wbb-cms-backend.vercel.app/api';
    }

    // Get CSRF token if needed
    if (!config.headers['CSRF-Token']) {
      try {
        const response = await axios.get(`${config.baseURL}/csrf-token`);
        config.headers['CSRF-Token'] = response.data.csrfToken;
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
