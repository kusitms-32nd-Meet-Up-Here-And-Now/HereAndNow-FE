import { useMutation } from '@tanstack/react-query';
import api from '../../common/api';

export interface PostCourseCommentRequest {
  courseId: number;
  content: string;
}

export interface PostCourseCommentResponse {
  timestamp: string;
  data: Record<string, never>;
  isSuccess: boolean;
}

const postCourseComment = async (data: PostCourseCommentRequest): Promise<PostCourseCommentResponse> => {
  console.log('[코스 댓글 저장 API] 요청 시작:', {
    url: '/course/comment',
    method: 'POST',
    requestData: data,
    courseId: data.courseId,
    contentLength: data.content.length,
  });

  const response = await api.post<PostCourseCommentResponse>('/course/comment', data);

  console.log('[코스 댓글 저장 API] 응답 수신:', {
    status: response.status,
    statusText: response.statusText,
    isSuccess: response.data.isSuccess,
    timestamp: response.data.timestamp,
  });

  return response.data;
};

const usePostCourseComment = () => {
  return useMutation<PostCourseCommentResponse, Error, PostCourseCommentRequest>({
    mutationFn: postCourseComment,
  });
};

export default usePostCourseComment;


