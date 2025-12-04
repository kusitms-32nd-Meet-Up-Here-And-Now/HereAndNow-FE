import { useQuery } from '@tanstack/react-query';
import api from '@apis/common/api';
import type { CreatedArchiveParams, CreatedArchiveResponse } from '../archive';

/**
 * 내가 생성한 코스 폴더 리스트 API
 * @param params 페이지네이션 파라미터
 * @returns 생성한 코스 폴더 리스트
 */
const getCreatedArchives = async (params: CreatedArchiveParams = {}): Promise<CreatedArchiveResponse> => {
  const { data } = await api.get<CreatedArchiveResponse>('/archive/created', { params });
  return data;
};

/**
 * 내가 생성한 코스 폴더 리스트 조회 훅
 * @param params 페이지네이션 파라미터
 */
const useGetCreatedArchives = (params: CreatedArchiveParams = {}) => {
  return useQuery({
    queryKey: ['archive', 'created', params],
    queryFn: () => getCreatedArchives(params),
  });
};

export default useGetCreatedArchives;


