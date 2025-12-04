import { useQuery } from '@tanstack/react-query';
import api from '@apis/common/api';
import type { ArchiveSearchParams, ArchiveSearchResponse } from '../archive';

/**
 * 아카이빙 폴더 검색(필터링) API
 * @param params 검색 필터 파라미터
 * @returns 검색 결과와 적용된 필터 정보
 */
const searchArchive = async (params: ArchiveSearchParams = {}): Promise<ArchiveSearchResponse> => {
  const { data } = await api.get<ArchiveSearchResponse>('/archive/search', { params });
  return data;
};

/**
 * 아카이빙 폴더 검색(필터링) 훅
 * @param params 검색 필터 파라미터
 * @param enabled 쿼리 실행 여부 (기본값: true)
 */
const useSearchArchive = (params: ArchiveSearchParams = {}, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['archive', 'search', params],
    queryFn: () => searchArchive(params),
    enabled,
  });
};

export default useSearchArchive;
