import api from 'src/apis/common/api';

// 타입 정의

// 추천 장소 리스트 API 파라미터
export interface RecommendedPlaceParams {
  page?: number;
  size?: number;
  sort?: 'RECENT' | 'REVIEWS' | 'SCRAPS';
  lat: string;
  lon: string;
}

// 추천 장소 데이터
export interface RecommendedPlaceData {
  placeId: number;
  placeName: string;
  placeCategory: string;
  placeStreetNameAddress: string;
  placeNumberAddress: string;
  placeRating: number;
  reviewCount: number;
  placeImageUrl: string;
}

// 추천 장소 리스트 응답
export interface RecommendedPlaceResponse {
  timestamp: string;
  data: RecommendedPlaceData[];
  isSuccess: boolean;
}

// 광고 추천 장소 리스트 API 파라미터
export interface AdsPlaceParams {
  lat: string;
  lon: string;
}

// 광고 추천 장소 마커
export interface PlaceMarker {
  latitude: number;
  longitude: number;
}

// 광고 추천 장소 데이터
export interface AdsPlaceData {
  placeId: number;
  placeName: string;
  placeMarker: PlaceMarker;
  imageUrl: string[];
}

// 광고 추천 장소 리스트 응답
export interface AdsPlaceResponse {
  timestamp: string;
  data: AdsPlaceData[];
  isSuccess: boolean;
}

// 추천 코스 리스트 API 파라미터
export interface RecommendedCourseParams {
  page?: number;
  size?: number;
  sort?: 'RECENT' | 'REVIEWS' | 'SCRAPS';
  lat: string;
  lon: string;
}

// 추천 코스 데이터
export interface RecommendedCourseData {
  courseId: number;
  memberProfileImage: string;
  memberNickname: string;
  courseTitle: string;
  courseRegion: string;
  pinCount: number;
  courseTags: string[];
  courseImages: string[];
}

// 추천 코스 리스트 응답
export interface RecommendedCourseResponse {
  timestamp: string;
  data: RecommendedCourseData[];
  isSuccess: boolean;
}

// API 함수들

/**
 * 홈 - 추천 장소 리스트 API
 * 근처 추천 장소 리스트를 반환합니다.
 * @param params 쿼리 파라미터 (lat, lon 필수)
 * @returns 추천 장소 리스트
 */
export const getRecommendedPlaces = async (params: RecommendedPlaceParams): Promise<RecommendedPlaceResponse> => {
  try {
    const { data } = await api.get<RecommendedPlaceResponse>('/place/home/recommended', { params });
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * 홈 - 광고 추천 장소 리스트 API
 * 지도에 타원형 및 핀으로 표시되는, DB 내의 현재 위치 근처 장소들이 랜덤으로 반환됩니다.
 * @param params 쿼리 파라미터 (lat, lon 필수)
 * @returns 광고 추천 장소 리스트
 */
export const getAdsPlaces = async (params: AdsPlaceParams): Promise<AdsPlaceResponse> => {
  try {
    const { data } = await api.get<AdsPlaceResponse>('/place/home/ads', { params });
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * 홈 - 추천 코스 리스트 API
 * 근처 추천 코스 리스트를 반환합니다.
 * @param params 쿼리 파라미터 (lat, lon 필수)
 * @returns 추천 코스 리스트
 */
export const getRecommendedCourses = async (params: RecommendedCourseParams): Promise<RecommendedCourseResponse> => {
  try {
    const { data } = await api.get<RecommendedCourseResponse>('/course/home/recommended', { params });
    return data;
  } catch (error) {
    throw error;
  }
};
