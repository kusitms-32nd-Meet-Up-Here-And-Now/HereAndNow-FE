import type { CourseSaveData } from '@stores/course-save';

export interface CourseSaveRequest extends CourseSaveData {}

export interface PinDirname {
  pinIdx: number;
  pinDirname: string;
}

export interface CourseSaveResponse {
  timestamp: string;
  data: {
    courseKey: string;
    pinDirname: PinDirname[];
  };
  isSuccess: boolean;
}

export interface PresignedUrlRequest {
  dirname: string;
  filename: string[];
}

export interface PresignedUrlItem {
  objectKey: string;
  presignedUrl: string;
}

export interface PresignedUrlResponse {
  data: PresignedUrlItem[];
  isSuccess: boolean;
  timestamp: string;
}

export interface PinImageObjectKey {
  pinIdx: number;
  objectKeyList: string[];
}

export interface CourseCommitRequest {
  pinImageObjectKeyList: PinImageObjectKey[];
}

export interface CourseCommitResponse {
  timestamp: string;
  data: unknown;
  isSuccess: boolean;
}

// GET /course/{courseId} 응답 타입
export interface CourseDetailResponse {
  timestamp: string;
  data: {
    courseId: number;
    courseWriter: boolean;
    courseVisitDate: string;
    courseTitle: string;
    courseDescription: string;
    courseTags: string[];
    pins: Array<{
      pinIndex: number;
      placeDetails: {
        placeId: number;
        placeName: string;
        placeCategory: string;
        placeStreetNameAddress: string;
        placeLatitude: number;
        placeLongitude: number;
        placeRating: number;
        reviewCount: number;
        placeUrl: string;
        scrapped: boolean;
      };
      pinImages: string[];
      pinPositive: string;
      pinNegative: string;
    }>;
  };
  isSuccess: boolean;
}
