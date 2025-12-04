import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import api from 'src/apis/common/api';

interface AuthTokenPayload {
  authKey: string;
}

interface AuthTokenResponse {
  timestamp: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
  isSuccess: boolean;
}

const postAuthToken = async (payload: AuthTokenPayload) => {
  try {
    const { data } = await api.post<AuthTokenResponse>('/auth/token', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const useKakaoToken = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: postAuthToken,
    onSuccess: (response: AuthTokenResponse) => {
      const accessToken = response.data.accessToken;
      const refreshToken = response.data.refreshToken;

      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
        navigate('/');
      }
    },
    onError: error => {
      const axiosError = error as AxiosError;
      alert(`로그인에 실패했습니다. 에러: ${axiosError.message}`);
      navigate('/');
    },
  });
};
