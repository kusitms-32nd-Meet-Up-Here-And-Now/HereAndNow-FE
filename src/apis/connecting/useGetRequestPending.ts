import { useQuery } from '@tanstack/react-query';
import api from '@apis/common/api';

const useGetRequestPending = () => {
  return useQuery({
    queryKey: ['requestPending'],
    queryFn: async () => {
      const res = await api.get('/couple/requests/pending');
      return res.data;
    },
    enabled: !!localStorage.getItem('accessToken'),
  });
};

export default useGetRequestPending;
