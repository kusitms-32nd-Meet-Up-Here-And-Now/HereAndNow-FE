import api from '../common/api';
import { useQuery } from '@tanstack/react-query';

interface UseGetCoupleBannerParams {
  page: number;
  size: number;
}

const useGetCoupleBanner = (params: UseGetCoupleBannerParams) => {
  return useQuery({
    queryKey: ['coupleBanner', params.page, params.size],
    queryFn: async () => {
      const res = await api.get('/couple/banner', {
        params: {
          page: params.page,
          size: params.size,
        },
      });
      return res.data;
    },
    enabled: !!localStorage.getItem('accessToken'),
  });
};

export default useGetCoupleBanner;
