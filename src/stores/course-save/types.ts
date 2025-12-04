export interface Place {
  placeName: string;
  placeStreetNameAddress: string;
  placeNumberAddress: string;
  placeLatitude: number;
  placeLongitude: number;
  placeGroupCode: string;
  placeCategory: string;
  placeUrl: string;
}

export interface Pin {
  pinRating: number;
  pinPositiveDescription: string;
  pinNegativeDescription: string;
  pinTagNames: string[];
  place: Place;
}

export interface CourseSaveData {
  courseTitle: string;
  courseDescription: string;
  coursePositive: string;
  courseNegative: string;
  isPublic: boolean;
  courseVisitDate: string;
  courseWith: string;
  courseRegion: string;
  courseRating: number;
  pinList: Pin[];
}
