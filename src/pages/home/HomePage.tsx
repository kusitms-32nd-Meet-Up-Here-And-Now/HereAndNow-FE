import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import KakaoMap from '@common/KakaoMap';
import AddCourse from './components/AddCourse';
import TabNavigation from './components/TabNavigation';
import PlaceCard from './components/PlaceCard';
import CourseCard from './components/CourseCard';
import { getAdsPlaces, getRecommendedPlaces, getRecommendedCourses } from '@apis/home/home';
import ProgressiveBlurOverlay from '@common/ProgressiveBlurOverlay';

type TabType = 'course' | 'place';
type SortType = 'latest' | 'liked' | 'reviewed';

// 정렬 타입 매핑 함수
const mapSortTypeToApi = (sort: SortType): 'RECENT' | 'REVIEWS' | 'SCRAPS' => {
  switch (sort) {
    case 'latest':
      return 'RECENT';
    case 'reviewed':
      return 'REVIEWS';
    case 'liked':
      return 'SCRAPS';
    default:
      return 'SCRAPS';
  }
};

const HomePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('course');
  const [sort, setSort] = useState<SortType>('latest'); // 기본값: 최신 순

  // 현재 위치 (임시로 하드코딩, 추후 실제 위치로 변경)
  const latitude = 37.5473222653849;
  const longitude = 127.043698279196;

  // 탭 변경 시 정렬을 최신순으로 초기화
  useEffect(() => {
    setSort('latest');
  }, [activeTab]);

  // 정렬 타입을 API 형식으로 변환
  const apiSort = mapSortTypeToApi(sort);

  // 광고 추천 장소 리스트 조회 (항상 호출)
  const { data: adsPlacesResponse } = useQuery({
    queryKey: ['adsPlaces', latitude, longitude],
    queryFn: () => getAdsPlaces({ lat: latitude.toString(), lon: longitude.toString() }),
  });

  // 추천 장소 리스트 조회 (place 탭일 때만 호출)
  const { data: recommendedPlacesResponse } = useQuery({
    queryKey: ['recommendedPlaces', latitude, longitude, apiSort],
    queryFn: () =>
      getRecommendedPlaces({
        lat: latitude.toString(),
        lon: longitude.toString(),
        page: 0,
        size: 20,
        sort: apiSort,
      }),
    enabled: activeTab === 'place',
  });

  // 추천 코스 리스트 조회 (course 탭일 때만 호출)
  const { data: recommendedCoursesResponse } = useQuery({
    queryKey: ['recommendedCourses', latitude, longitude, apiSort],
    queryFn: () =>
      getRecommendedCourses({
        lat: latitude.toString(),
        lon: longitude.toString(),
        page: 0,
        size: 20,
        sort: apiSort,
      }),
    enabled: activeTab === 'course',
  });

  // API 응답 데이터 로깅
  useEffect(() => {
    if (adsPlacesResponse?.data) {
      console.log('getAdsPlaces:', adsPlacesResponse.data);
    }
  }, [adsPlacesResponse]);

  useEffect(() => {
    if (recommendedPlacesResponse?.data) {
      console.log('getRecommendedPlaces:', recommendedPlacesResponse.data);
    }
  }, [recommendedPlacesResponse]);

  useEffect(() => {
    if (recommendedCoursesResponse?.data) {
      console.log('getRecommendedCourses:', recommendedCoursesResponse.data);
    }
  }, [recommendedCoursesResponse]);

  // TODO: adsPlaces 데이터를 지도 마커나 UI에 활용
  const adsPlaces = adsPlacesResponse?.data || [];

  const recommendedPlaces = recommendedPlacesResponse?.data ?? [];
  const recommendedCourses = recommendedCoursesResponse?.data ?? [];

  const mapMarkers =
    adsPlaces.length > 0
      ? adsPlaces.map(place => ({
          latitude: place.placeMarker.latitude,
          longitude: place.placeMarker.longitude,
          name: place.placeName,
        }))
      : [];

  const searchBarData =
    adsPlaces.length > 0
      ? {
          name: adsPlaces[0].placeName,
          previewImages: adsPlaces[0].imageUrl.slice(0, 3),
        }
      : undefined;

  const mapCenter = mapMarkers[0] ?? {
    latitude,
    longitude,
  };

  return (
    <div className="min-h-screen">
      <div className="flex flex-col gap-[28px]">
        <AddCourse />

        <div
          className="relative h-[292px] w-full overflow-hidden rounded-lg"
          style={{ boxShadow: '0px 4px 10px rgba(0,0,0,0.1)' }}
        >
          <KakaoMap
            latitude={mapCenter.latitude}
            longitude={mapCenter.longitude}
            className="h-[292px]"
            markers={mapMarkers}
            searchBar={searchBarData}
          />
          <ProgressiveBlurOverlay />
        </div>

        <TabNavigation activeTab={activeTab} selectedSort={sort} onTabChange={setActiveTab} onSortChange={setSort} />

        {activeTab === 'course' && recommendedCourses.length > 0 && (
          <div className="flex flex-col gap-4">
            {recommendedCourses.map(course => (
              <CourseCard
                key={course.courseId}
                courseId={course.courseId}
                profileImageUrl={course.memberProfileImage}
                authorName={course.memberNickname}
                title={course.courseTitle}
                location={course.courseRegion}
                placeCount={course.pinCount}
                tags={course.courseTags}
                courseImages={course.courseImages}
                onClick={() => navigate(`/archive/${course.courseId}`)}
              />
            ))}
          </div>
        )}

        {activeTab === 'place' && recommendedPlaces.length > 0 && (
          <div className="flex flex-col gap-4">
            {recommendedPlaces.map(place => (
              <PlaceCard
                key={place.placeId}
                imageUrl={place.placeImageUrl || '/dummy_placecard.png'}
                name={place.placeName}
                category={place.placeCategory}
                address={place.placeStreetNameAddress}
                addressDetail={place.placeNumberAddress}
                rating={place.placeRating}
                reviewCount={place.reviewCount}
                onClick={() => navigate(`/archive/place/${place.placeId}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
