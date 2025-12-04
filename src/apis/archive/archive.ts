// 타입 정의
export interface ArchiveSearchParams {
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

export interface CourseItem {
  id: number;
  courseTitle: string;
  commentCount: number;
  courseVisitDate: string;
}

export interface ArchiveSearchResponse {
  timestamp: string;
  data: {
    selectedFilters: SelectedFilters;
    filteredCourses: CourseItem[];
  };
  isSuccess: boolean;
}

export interface RecentArchiveData {
  courseId: number;
  courseVisitDate: string;
  courseTitle: string;
  courseImages: string[];
  courseDescription: string;
  courseTags: string[];
  commentCount: number;
}

export interface RecentArchiveResponse {
  timestamp: string;
  data: RecentArchiveData | null;
  isSuccess: boolean;
}

export interface CreatedArchiveParams {
  page?: number;
  size?: number;
}

export interface CreatedArchiveResponse {
  timestamp: string;
  data: CourseItem[];
  isSuccess: boolean;
}

// 저장한 코스 관련 타입
export interface SavedCourseItem {
  courseId: number;
  memberProfileImage: string;
  memberNickname: string;
  courseTitle: string;
  courseRegion: string;
  pinCount: number;
  courseTags: string[];
  courseImages: string[];
}

export interface SavedCoursesParams {
  page?: number;
  size?: number;
  sort?: 'RECENT' | 'REVIEWS' | 'SCRAPS';
}

export interface SavedCoursesResponse {
  timestamp: string;
  data: SavedCourseItem[];
  isSuccess: boolean;
}

// 저장한 장소 관련 타입
export interface SavedPlaceItem {
  placeId: number;
  placeName: string;
  placeCategory: string;
  placeStreetNameAddress: string;
  placeNumberAddress: string;
  placeRating: number;
  reviewCount: number;
  placeImageUrl: string;
}

export interface SavedPlacesParams {
  page?: number;
  size?: number;
  sort?: 'RECENT' | 'REVIEWS' | 'SCRAPS';
}

export interface SavedPlacesResponse {
  timestamp: string;
  data: SavedPlaceItem[];
  isSuccess: boolean;
}
