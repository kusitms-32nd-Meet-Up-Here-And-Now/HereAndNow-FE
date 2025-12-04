import { useQuery } from '@tanstack/react-query';
import api from '../common/api';

interface UseGetConnectingSearchParams {
  page?: number; // 기본값: 0
  size?: number; // 기본값: 32
  rating?: number;
  keyword?: string[];
  startDate?: string; // YYYY-MM-DD 형식
  endDate?: string; // YYYY-MM-DD 형식
  region?: string;
  placeCode?: string[];
  tag?: string[];
}

const useGetConnectingSearch = (params: UseGetConnectingSearchParams = {}) => {
  const { page = 0, size = 32, rating, keyword, startDate, endDate, region, placeCode, tag } = params;

  return useQuery({
    queryKey: ['connectingSearch', page, size, rating, keyword, startDate, endDate, region, placeCode, tag],
    queryFn: async () => {
      const res = await api.get('/couple/search', {
        params: {
          page,
          size,
          ...(rating !== undefined && { rating }),
          ...(keyword && keyword.length > 0 && { keyword }),
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
          ...(region && { region }),
          ...(placeCode && placeCode.length > 0 && { placeCode }),
          ...(tag && tag.length > 0 && { tag }),
        },
      });
      return res.data;
    },
    enabled: !!localStorage.getItem('accessToken'),
  });
};

export default useGetConnectingSearch;
