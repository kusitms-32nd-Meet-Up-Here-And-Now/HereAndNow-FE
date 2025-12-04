import { useMutation } from '@tanstack/react-query';
import api from '../common/api';

export interface PostCommentImgRequest {
  courseId: number;
  objectKey: string;
}

export interface PostCommentImgResponse {}

const usePostCommentImg = () => {
  return useMutation<PostCommentImgResponse, Error, PostCommentImgRequest>({
    mutationFn: async (data: PostCommentImgRequest) => {
      console.log('[댓글 이미지 등록 API] 요청 시작:', {
        url: '/couple/comment/image',
        method: 'POST',
        requestData: data,
        courseId: data.courseId,
        objectKey: data.objectKey,
        fullUrl: `${import.meta.env.VITE_BASE_URL}/couple/comment/image`,
      });

      try {
        const response = await api.post<PostCommentImgResponse>('/couple/comment/image', data);

        console.log('[댓글 이미지 등록 API] 응답 성공:', {
          status: response.status,
          statusText: response.statusText,
          isOk: response.status === 200,
        });

        // 200 OK 응답만 확인
        return {} as PostCommentImgResponse;
      } catch (error: any) {
        console.error('[댓글 이미지 등록 API] 요청 실패:', {
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

export default usePostCommentImg;
