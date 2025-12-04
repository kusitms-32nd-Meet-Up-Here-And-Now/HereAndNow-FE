import { useQuery } from '@tanstack/react-query';
import api from '@apis/common/api';
import type { SavedCoursesParams, SavedCoursesResponse } from '../archive';

/**
 * 저장한 코스 목록 조회 API
 * @param params 페이지네이션 및 정렬 파라미터
 * @returns 저장한 코스 목록
 */
const getSavedCourses = async (params: SavedCoursesParams = {}): Promise<SavedCoursesResponse> => {
  const { data } = await api.get<SavedCoursesResponse>('/scrap/course', { params });
  return data;
};

/**
 * 저장한 코스 목록 조회 훅
 * @param params 페이지네이션 및 정렬 파라미터
 */
const useGetSavedCourses = (params: SavedCoursesParams = {}) => {
  return useQuery({
    queryKey: ['scrap', 'course', params],
    queryFn: () => getSavedCourses(params),
  });
};

export default useGetSavedCourses;

