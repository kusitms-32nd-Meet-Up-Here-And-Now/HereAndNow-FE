import { useMutation } from '@tanstack/react-query';
import api from '../../common/api';

export interface PostCourseScrapResponse {
  timestamp: string;
  data: {
    scrapId: number;
    memberId: number;
    targetId: number;
    deleted: boolean;
  };
  isSuccess: boolean;
}

const postCourseScrap = async (courseId: number): Promise<PostCourseScrapResponse> => {
  console.log('[코스 스크랩 API] 요청 시작:', {
    url: `/scrap/course/${courseId}`,
    method: 'POST',
    courseId,
  });

  const response = await api.post<PostCourseScrapResponse>(`/scrap/course/${courseId}`);

  console.log('[코스 스크랩 API] 응답 수신:', {
    status: response.status,
    statusText: response.statusText,
    isSuccess: response.data.isSuccess,
    deleted: response.data.data.deleted,
    scrapId: response.data.data.scrapId,
  });

  return response.data;
};

const usePostCourseScrap = () => {
  return useMutation<PostCourseScrapResponse, Error, number>({
    mutationFn: postCourseScrap,
  });
};

export default usePostCourseScrap;



