import axios from 'axios';

// Create an Axios instance with a base URL
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Interceptor to add authorization token dynamically
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    // const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
    const customerToken = localStorage.getItem('token');

      config.headers['Authorization'] = `${customerToken}`;
    

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
