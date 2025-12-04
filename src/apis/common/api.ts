import axios, { AxiosError, type AxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
  maxRedirects: 0, // 리다이렉트 방지 (CORS 에러 방지)
});

api.interceptors.request.use(
  config => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      console.log('[API Request] 토큰 포함:', {
        url: config.url,
        hasToken: !!accessToken,
        tokenPrefix: accessToken.substring(0, 20) + '...',
      });
    } else {
      console.warn('[API Request] 토큰 없음:', {
        url: config.url,
      });
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalReq = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // CORS로 차단된 Network Error 처리 (백엔드 리다이렉트 시 발생)
    if (!error.response && error.message === 'Network Error') {
      console.warn('[API] Network Error 감지 (CORS 차단 가능성):', {
        url: error.config?.url,
        message: error.message,
      });
      // 인증 실패로 간주하고 로그인 페이지로 이동
      localStorage.clear();
      window.location.href = '/login';
      return Promise.reject(new Error('Network error - authentication required'));
    }

    // 리다이렉트 에러 처리 (3xx 상태 코드) - CORS 에러 방지
    if (error.response?.status && error.response.status >= 300 && error.response.status < 400) {
      console.warn('[API] 리다이렉트 감지 (인증 필요):', {
        status: error.response.status,
        url: error.config?.url,
        redirectLocation: error.response.headers.location,
      });
      // 리다이렉트는 인증 문제로 간주하고 로그인 페이지로 이동
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(new Error('Authentication required - redirect detected'));
      }
      // refreshToken이 있으면 토큰 갱신 시도
    }

    if (error.response?.status === 401 && !originalReq._retry) {
      originalReq._retry = true;
      console.log('[API] 401 에러 - 토큰 갱신 시도');
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          console.warn('[API] Refresh token 없음 - 로그인 페이지로 이동');
          localStorage.clear();
          window.location.href = '/login';
          return Promise.reject(new Error('No refresh token available'));
        }

        console.log('[API] 토큰 갱신 요청 시작');
        const { data: refreshRes } = await axios.post<{
          accessToken: string;
          refreshToken: string;
        }>(`${import.meta.env.VITE_BASE_URL}/auth/re-issue`, { refreshToken }, { withCredentials: true });

        console.log('[API] 토큰 갱신 성공');
        localStorage.setItem('accessToken', refreshRes.accessToken);
        localStorage.setItem('refreshToken', refreshRes.refreshToken);

        api.defaults.headers.common['Authorization'] = `Bearer ${refreshRes.accessToken}`;
        if (originalReq.headers) {
          originalReq.headers['Authorization'] = `Bearer ${refreshRes.accessToken}`;
        }

        console.log('[API] 원래 요청 재시도:', originalReq.url);
        return api(originalReq);
      } catch (_err) {
        console.error('[API] 토큰 갱신 실패:', _err);
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(_err);
      }
    }

    console.error('[API] 에러 발생:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      message: error.message,
      response: error.response?.data,
    });

    return Promise.reject(error);
  },
);

export default api;
