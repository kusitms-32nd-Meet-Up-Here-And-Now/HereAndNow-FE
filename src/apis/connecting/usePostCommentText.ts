import { useMutation } from '@tanstack/react-query';
import api from '../common/api';

export interface PostCommentTextRequest {
  courseId: number;
  content: string;
}

export interface PostCommentTextResponse {}

const usePostCommentText = () => {
  return useMutation<PostCommentTextResponse, Error, PostCommentTextRequest>({
    mutationFn: async (data: PostCommentTextRequest) => {
      console.log('[댓글 텍스트 등록 API] 요청 시작:', {
        url: '/couple/comment/text',
        method: 'POST',
        requestData: data,
        courseId: data.courseId,
        content: data.content,
        fullUrl: `${import.meta.env.VITE_BASE_URL}/couple/comment/text`,
      });

      try {
        const response = await api.post<PostCommentTextResponse>('/couple/comment/text', data);

        console.log('[댓글 텍스트 등록 API] 응답 성공:', {
          status: response.status,
          statusText: response.statusText,
          isOk: response.status === 200,
        });

        // 200 OK 응답만 확인
        return {} as PostCommentTextResponse;
      } catch (error: any) {
        console.error('[댓글 텍스트 등록 API] 요청 실패:', {
          error,
          errorMessage: error?.message,
          errorResponse: error?.response?.data,
          errorStatus: error?.response?.status,
          errorStatusText: error?.response?.statusText,
          requestData: data,
        });
        throw error;
      }
    },
  });
};

export default usePostCommentText;
