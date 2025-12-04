import { useQuery } from '@tanstack/react-query';
import api from '../common/api';

// 타입 정의
export interface PlaceMarker {
  latitude: number;
  longitude: number;
}

export interface PlaceCard {
  placeId: number;
  placeName: string;
  placeCategory: string;
  placeStreetNameAddress: string;
  placeNumberAddress: string;
  placeRating: number;
  reviewCount: number;
  placeImageUrl: string;
}

export interface PlaceAdsItem {
  placeCard: PlaceCard;
  placeMarker: PlaceMarker;
}

export interface PlaceAdsResponse {
  timestamp: string;
  data: PlaceAdsItem[];
  isSuccess: boolean;
}

// 훅 파라미터 타입
export interface UseGetPlaceAdsParams {
  lat?: number;
  lon?: number;
}

// 코스 리스트 관련 타입 정의
export interface CourseCard {
  courseId: number;
  memberProfileImage: string;
  memberNickname: string;
  courseTitle: string;
  courseRegion: string;
  pinCount: number;
  courseTags: string[];
  courseImages: string[];
}

export interface CommentItem {
  commentId: number;
  nickName: string;
  profileImage: string;
  content: string;
}

export interface Comment {
  count: number;
  comments: CommentItem[];
}

export interface CourseListItem {
  courseCard: CourseCard;
  comment: Comment;
  scrapped: boolean;
}

export interface CourseListResponse {
  timestamp: string;
  data: CourseListItem[];
  isSuccess: boolean;
}

export interface UseGetCourseListParams {
  page?: number;
  size?: number;
}

// 코스 검색 관련 타입 정의
export interface CourseSearchParams {
  page?: number;
  size?: number;
  rating?: string;
  keyword?: string;
  startDate?: string;
  endDate?: string;
  with?: string;
  region?: string;
  placeCode?: string;
  tag?: string;
}

export interface SelectedFilters {
  rating?: number;
  keyword?: string[];
  startDate?: string;
  endDate?: string;
  with?: string;
  region?: string;
  placeCode?: string[];
  tag?: string[];
}

export interface CourseSearchResponse {
  timestamp: string;
  data: {
    selectedFilters: SelectedFilters;
    filteredCourses: CourseListItem[];
  };
  isSuccess: boolean;
}

// API 호출 함수
const getPlaceAds = async (params: UseGetPlaceAdsParams): Promise<PlaceAdsResponse> => {
  const { lat = 37.566585446882, lon = 126.978203640984 } = params;

  const response = await api.get<PlaceAdsResponse>('/discover/place/ads', {
    params: {
      lat,
      lon,
    },
  });

  return response.data;
};

// React Query 훅
export const useGetPlaceAds = (params: UseGetPlaceAdsParams = {}) => {
  const { lat = 37.566585446882, lon = 126.978203640984 } = params;

  return useQuery({
    queryKey: ['placeAds', lat, lon],
    queryFn: () => getPlaceAds(params),
  });
};

// 코스 리스트 API 호출 함수
const getCourseList = async (params: UseGetCourseListParams): Promise<CourseListResponse> => {
  const { page = 0, size = 20 } = params;

  const response = await api.get<CourseListResponse>('/discover/course', {
    params: {
      page,
      size,
    },
  });

  return response.data;
};

// 코스 리스트 React Query 훅
export const useGetCourseList = (params: UseGetCourseListParams = {}) => {
  const { page = 0, size = 20 } = params;

  return useQuery({
    queryKey: ['courseList', page, size],
    queryFn: () => getCourseList(params),
  });
};

// 코스 검색 API 호출 함수
const searchCourseList = async (params: CourseSearchParams): Promise<CourseSearchResponse> => {
  const response = await api.get<CourseSearchResponse>('/discover/course/search', {
    params,
  });

  return response.data;
};

// 코스 검색 React Query 훅
export const useSearchCourseList = (params: CourseSearchParams = {}, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['courseSearch', params],
    queryFn: () => searchCourseList(params),
    enabled,
  });
};
