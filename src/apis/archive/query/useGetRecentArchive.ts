import { useQuery } from '@tanstack/react-query';
import api from '@apis/common/api';
import type { RecentArchiveResponse } from '../archive';

/**
 * 가장 최신 아카이빙 폴더 API
 * @returns 최신 아카이빙 폴더 정보
 */
const getRecentArchive = async (): Promise<RecentArchiveResponse> => {
  const { data } = await api.get<RecentArchiveResponse>('/archive/recent');
  return data;
};

/**
 * 가장 최신 아카이빙 폴더 조회 훅
 */
const useGetRecentArchive = () => {
  return useQuery({
    queryKey: ['archive', 'recent'],
    queryFn: getRecentArchive,
  });
};

export default useGetRecentArchive;

