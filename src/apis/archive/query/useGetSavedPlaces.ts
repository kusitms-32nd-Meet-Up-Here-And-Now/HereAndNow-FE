import { useQuery } from '@tanstack/react-query';
import api from '@apis/common/api';
import type { SavedPlacesParams, SavedPlacesResponse } from '../archive';

/**
 * 저장한 장소 목록 조회 API
 * @param params 페이지네이션 및 정렬 파라미터
 * @returns 저장한 장소 목록
 */
const getSavedPlaces = async (params: SavedPlacesParams = {}): Promise<SavedPlacesResponse> => {
  const { data } = await api.get<SavedPlacesResponse>('/scrap/place', { params });
  return data;
};

/**
 * 저장한 장소 목록 조회 훅
 * @param params 페이지네이션 및 정렬 파라미터
 */
const useGetSavedPlaces = (params: SavedPlacesParams = {}) => {
  return useQuery({
    queryKey: ['scrap', 'place', params],
    queryFn: () => getSavedPlaces(params),
  });
};

export default useGetSavedPlaces;

