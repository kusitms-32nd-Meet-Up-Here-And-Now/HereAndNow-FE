import { useQuery } from '@tanstack/react-query';
import api from '@apis/common/api';
import type { CourseDetailResponse } from '../types';

/**
 * 코스 상세 조회
 * @param courseId - 숫자형 코스 ID
 */
const getCourse = async (courseId: number): Promise<CourseDetailResponse> => {
  console.log('[getCourse] 요청 시작:', {
    courseId,
    url: `/course/${courseId}`,
  });

  const response = await api.get<CourseDetailResponse>(`/course/${courseId}`);

  console.log('[getCourse] 응답 수신:', {
    courseId: response.data.data.courseId,
    courseTitle: response.data.data.courseTitle,
    pinCount: response.data.data.pins.length,
    fullResponse: response.data,
  });

  return response.data;
};

/**
 * 코스 상세 조회 훅
 * @param courseId - 숫자형 코스 ID
 */
const useGetCourse = (courseId: number) => {
  return useQuery({
    queryKey: ['course', courseId],
    queryFn: () => getCourse(courseId),
    enabled: !!courseId && courseId > 0, // courseId가 유효할 때만 쿼리 실행
  });
};

export default useGetCourse;
