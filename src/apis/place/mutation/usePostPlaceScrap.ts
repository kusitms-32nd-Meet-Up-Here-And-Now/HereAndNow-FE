import { useMutation } from '@tanstack/react-query';
import api from '../../common/api';

export interface PostPlaceScrapRequest {
  placeId: number;
}

export interface PostPlaceScrapResponse {
  timestamp: string;
  data: {
    scrapId: number;
    memberId: number;
    targetId: number;
    deleted: boolean;
  };
  isSuccess: boolean;
}

const postPlaceScrap = async (placeId: number): Promise<PostPlaceScrapResponse> => {
  console.log('[장소 스크랩 API] 요청 시작:', {
    url: `/scrap/place/${placeId}`,
    method: 'POST',
    placeId,
  });

  const response = await api.post<PostPlaceScrapResponse>(`/scrap/place/${placeId}`);

  console.log('[장소 스크랩 API] 응답 수신:', {
    status: response.status,
    statusText: response.statusText,
    isSuccess: response.data.isSuccess,
    deleted: response.data.data.deleted,
    scrapId: response.data.data.scrapId,
  });

  return response.data;
};

const usePostPlaceScrap = () => {
  return useMutation<PostPlaceScrapResponse, Error, number>({
    mutationFn: postPlaceScrap,
  });
};

export default usePostPlaceScrap;
