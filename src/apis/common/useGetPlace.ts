import { useQuery } from '@tanstack/react-query';
import api from './api';

/**
 * Place 카드 정보 타입
 */
export interface PlaceCardResponseDto {
  placeId: number;
  placeName: string;
  placeCategory: string;
  placeStreetNameAddress: string;
  placeNumberAddress: string;
  placeRating: number;
  reviewCount: number;
  placeImageUrl: string;
  lat: number;
  lon: number;
}

/**
 * 코스 정보 타입
 */
export interface CourseInfo {
  courseId: number;
  memberProfileImage: string;
  memberNickname: string;
  courseTitle: string;
  courseRegion: string;
  pinCount: number;
  courseTags: string[];
  courseImages: string[];
}

/**
 * Place 상세 정보 응답 타입
 */
export interface PlaceDetailData {
  placeCardResponseDto: PlaceCardResponseDto;
  placeTagList: string[];
  bannerImageList: string[];
  placeInfoImageList: string[];
  placePositiveList: string[];
  placeNegativeList: string[];
  courseList: CourseInfo[];
}

export interface PlaceDetailResponse {
  timestamp: string;
  data: PlaceDetailData;
  isSuccess: boolean;
}

/**
 * 장소 상세 조회
 * @param placeId - 숫자형 장소 ID
 */
const getPlace = async (placeId: number): Promise<PlaceDetailResponse> => {
  console.log('[getPlace] 요청 시작:', {
    placeId,
    url: `/place/${placeId}`,
  });

  const response = await api.get<PlaceDetailResponse>(`/place/${placeId}`);

  console.log('[getPlace] 응답 수신:', {
    placeId: response.data.data.placeCardResponseDto.placeId,
    placeName: response.data.data.placeCardResponseDto.placeName,
    fullResponse: response.data,
  });

  return response.data;
};

/**
 * 장소 상세 조회 훅
 * @param placeId - 숫자형 장소 ID
 */
const useGetPlace = (placeId: number) => {
  return useQuery({
    queryKey: ['place', placeId],
    queryFn: () => getPlace(placeId),
    enabled: !!placeId && placeId > 0, // placeId가 유효할 때만 쿼리 실행
  });
};

export default useGetPlace;
