import { useMutation } from '@tanstack/react-query';
import api from '@apis/common/api';

// POST /couple/requests/{coupleId}/approve
// 나에게 온 커플 요청을 수락하는 API
export const usePostApproveCouple = () => {
  return useMutation({
    // coupleId만 받아서 path param으로 사용
    mutationFn: async (coupleId: number) => {
      const { data } = await api.post(`/couple/requests/${coupleId}/approve`);
      return data;
    },
    onSuccess: data => {
      console.log('[usePostApproveCouple] 커플 요청 수락 성공!', data);
    },
    onError: error => {
      console.error('[usePostApproveCouple] 커플 요청 수락 실패', error);
    },
  });
};

export default usePostApproveCouple;
