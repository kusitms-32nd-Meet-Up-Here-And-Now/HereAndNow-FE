import api from '../../apis/common/api';
import { useQuery } from '@tanstack/react-query';

const useGetCoupleInfo = () =>
  useQuery({
    queryKey: ['coupleInfo'],
    queryFn: async () => {
      const res = await api.get('/couple/info');
      return res.data;
    },
    enabled: !!localStorage.getItem('accessToken'),
  });

export default useGetCoupleInfo;
