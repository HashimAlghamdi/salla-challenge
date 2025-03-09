import axios from 'axios';
import { env } from '@/config/env';
import { redirect } from 'next/navigation';
import { getAuthToken, removeAuthToken } from './auth';

export const apiClient = axios.create({
  baseURL: env.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  config => {
    if (typeof window !== 'undefined') {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      removeAuthToken();
      redirect('/login');
    }
    return Promise.reject(error);
  }
);
