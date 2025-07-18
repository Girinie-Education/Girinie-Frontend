// src/api/common.ts
import axios from 'axios';
import Cookies from 'js-cookie';

export const apiClient = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,            // 쿠키 포함
  headers: { 'Content-Type': 'application/json' },
});

// 모든 요청에 CSRF 토큰 헤더를 붙여 줌
apiClient.interceptors.request.use(config => {
  console.log("🔒 CSRF interceptor fired, headers before:", config.headers);
  const csrftoken = Cookies.get('csrftoken');  
  if (csrftoken && config.headers) {
    config.headers['X-CSRFToken'] = csrftoken;
  }
  console.log("🔒 CSRF interceptor applied, headers after:", config.headers);

  return config;
});
