import { useMutation } from '@tanstack/react-query';
import api from '@apis/common/api';

export interface CoupleConnectRequest {
  coupleStartDate: string | null; // "YYYY-MM-DD" 형식 또는 null
  imageObjectKey: string | null; // 이미지 objectKey 또는 null
}

export interface CoupleConnectResponse {
  timestamp: string;
  data: {
    coupleStartDate: string;
    imageObjectKey: string;
  };
  isSuccess: boolean;
}

/**
 * 커플 정보 변경 API
 * POST /couple/connect
 * 변경하지 않는 필드는 null로 전송
 */
export const usePostCoupleConnect = () => {
  return useMutation({
    mutationFn: async (data: CoupleConnectRequest): Promise<CoupleConnectResponse> => {
      console.log('[usePostCoupleConnect] 요청 시작:', data);
      const response = await api.post<CoupleConnectResponse>('/couple/connect', data);
      console.log('[usePostCoupleConnect] 응답 성공:', response.data);
      return response.data;
    },
    onSuccess: data => {
      console.log('[usePostCoupleConnect] 커플 정보 변경 성공!', data);
    },
    onError: error => {
      console.error('[usePostCoupleConnect] 커플 정보 변경 실패', error);
    },
  });
};

export default usePostCoupleConnect;

