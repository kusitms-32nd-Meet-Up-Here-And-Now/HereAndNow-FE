import api from '../common/api';
import { useQuery } from '@tanstack/react-query';

const useGetConnectingRecent = () => {
  return useQuery({
    queryKey: ['connectingRecent'],
    queryFn: async () => {
      const res = await api.get('/couple/search/recent');
      return res.data;
    },
    enabled: !!localStorage.getItem('accessToken'),
  });
};

export default useGetConnectingRecent;
