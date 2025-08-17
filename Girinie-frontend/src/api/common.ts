// src/api/common.ts
import axios from 'axios';
import Cookies from 'js-cookie';

export const apiClient = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(config => {
  console.log("🔒 Interceptor fired, headers before:", config.headers);

  const csrftoken = Cookies.get('csrftoken');
  const accessToken = Cookies.get('accessToken');

  if (config.headers) {
    if (csrftoken) {
      config.headers['X-CSRFToken'] = csrftoken;
    }
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    config.headers['ngrok-skip-browser-warning'] = 'true';
  }

  console.log("🔒 Interceptor applied, headers after:", config.headers);
  return config;
});
