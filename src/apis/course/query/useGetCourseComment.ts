import { useQuery } from '@tanstack/react-query';
import api from '@apis/common/api';

/**
 * 코스 댓글 응답 타입
 */
export interface CourseComment {
  commentId: number;
  nickName: string;
  profileImage: string;
  content: string;
}

export interface CourseCommentResponse {
  timestamp: string;
  data: {
    count: number;
    comments: CourseComment[];
  };
  isSuccess: boolean;
}

/**
 * 코스 댓글 조회
 * @param courseId - 숫자형 코스 ID
 */
const getCourseComment = async (courseId: number): Promise<CourseCommentResponse> => {
  console.log('[getCourseComment] 요청 시작:', {
    courseId,
    url: `/course/comment/${courseId}`,
  });

  const response = await api.get<CourseCommentResponse>(`/course/comment/${courseId}`);

  console.log('[getCourseComment] 응답 수신:', {
    courseId,
    commentCount: response.data.data.count,
    comments: response.data.data.comments.length,
    fullResponse: response.data,
  });

  return response.data;
};

/**
 * 코스 댓글 조회 훅
 * @param courseId - 숫자형 코스 ID
 */
const useGetCourseComment = (courseId: number) => {
  return useQuery({
    queryKey: ['courseComment', courseId],
    queryFn: () => getCourseComment(courseId),
    enabled: !!courseId && courseId > 0, // courseId가 유효할 때만 쿼리 실행
  });
};

export default useGetCourseComment;

