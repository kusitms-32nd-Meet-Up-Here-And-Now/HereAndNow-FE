import { useMutation } from '@tanstack/react-query';
import api from '@apis/common/api';

// POST /couple/requests
// 서버 스펙: opponentUsername를 query parameter로 전달해야 함
export const usePostCoupleRequest = () => {
  return useMutation({
    // mutation 변수로 opponentUsername 문자열만 받도록 정의
    mutationFn: async (opponentUsername: string) => {
      const { data } = await api.post('/couple/requests', null, {
        params: { opponentUsername },
      });
      return data;
    },

    onSuccess: data => {
      console.log('[usePostCoupleRequest] 커플 요청 성공!', data);
    },

    onError: error => {
      console.error('[usePostCoupleRequest] 커플 요청 실패', error);
    },
  });
};
