import axios from 'axios';
import { baseUrl } from '../utils/baseUrl';
import { store } from '../store/store';
import { handleTokenExpireModal } from '../store/apiCall/handleTokenExpire';

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: baseUrl, // replace with your API base URL
    timeout: 600000, // request timeout
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
    async (config) => {
        const token = store?.getState()?.auth?.token?.access_token || ''; // or get token from another storage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        // Conditionally set Content-Type if not already defined
        // if (!config.headers['Content-Type']) {
        //     if (config.data instanceof FormData) {
        //         config.headers['Content-Type'] = 'multipart/form-data'; // for file uploads
        //     } else {
        //         config.headers['Content-Type'] = 'application/json'; // for JSON requests
        //     }
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
    (response) => {


        const contentDisposition = response.headers['content-disposition'];
        if (contentDisposition) {
            console.log('Content-Disposition:', contentDisposition);
        } else {
            console.warn('Content-Disposition header not found in response.');
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response) {
            console.log(error.response);
            // Handle 401 errors (unauthorized)
            if (
                error.response.status === 401 &&
                (error?.response?.data?.error === 'Token expired' ||
                    error?.response?.data?.error === 'Required token') &&
                !originalRequest._retry
            ) {
                handleTokenExpireModal();
            }

            // Handle other bad responses
            if (error.response.status >= 400 && error.response.status < 500) {
                // Handle client errors (e.g., show a specific error message)
            } else if (error.response.status >= 500) {
                // Handle server errors
            }
        } else if (error.request) {
            // Handle network errors
            console.error('Network error: ', error.request);
        } else {
            // Handle other errors
            console.error('Error: ', error.message);
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
