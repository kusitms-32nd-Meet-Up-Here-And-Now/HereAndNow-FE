import api from '../common/api';
import { useQuery } from '@tanstack/react-query';

const useGetCoupleComment = (courseId: number) => {
  return useQuery({
    queryKey: ['coupleComment', courseId],
    queryFn: async () => {
      const res = await api.get(`/couple/comment/${courseId}`);
      return res.data;
    },
    enabled: !!courseId && !!localStorage.getItem('accessToken'),
  });
};

export default useGetCoupleComment;
