import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@common/layout/PageHeader';
import CourseCard from './components/CourseCard';
import PlaceCard from '@pages/home/components/PlaceCard';
import Tab from './components/Tab';

type TabType = 'course' | 'place';
type SortType = 'latest' | 'name' | 'date';

// 더미 코스 데이터
const dummyCourses = [
  {
    courseId: 1,
    profileImageUrl: '/dummy_profile.png',
    authorName: '여행러버',
    title: '서울 핫플레이스 탐방 코스',
    location: '서울 강남구',
    placeCount: 5,
    tags: ['카페', '맛집'],
    courseImages: ['/dummy_placecard.png', '/dummy_placecard.png', '/dummy_placecard.png'],
    hasComments: false,
  },
  {
    courseId: 2,
    profileImageUrl: '/dummy_profile.png',
    authorName: '도시탐험가',
    title: '홍대 데이트 코스',
    location: '서울 마포구',
    placeCount: 4,
    tags: ['데이트', '카페'],
    courseImages: ['/dummy_placecard.png', '/dummy_placecard.png'],
    hasComments: true,
  },
  {
    courseId: 3,
    profileImageUrl: '/dummy_profile.png',
    authorName: '맛집러버',
    title: '부산 해운대 맛집 투어',
    location: '부산 해운대구',
    placeCount: 6,
    tags: ['맛집', '해변'],
    courseImages: ['/dummy_placecard.png', '/dummy_placecard.png', '/dummy_placecard.png', '/dummy_placecard.png'],
    hasComments: false,
  },
];

// 더미 장소 데이터
const dummyPlaces = [
  {
    placeId: 1,
    imageUrl: '/dummy_placecard.png',
    name: '스타벅스 강남점',
    category: '카페',
    address: '서울특별시 강남구 테헤란로 123',
    addressDetail: '강남빌딩 1층',
    rating: 4.5,
    reviewCount: 128,
  },
  {
    placeId: 2,
    imageUrl: '/dummy_placecard.png',
    name: '맛있는 파스타집',
    category: '양식',
    address: '서울특별시 마포구 홍대입구로 456',
    rating: 4.8,
    reviewCount: 256,
  },
  {
    placeId: 3,
    imageUrl: '/dummy_placecard.png',
    name: '해운대 해수욕장',
    category: '관광지',
    address: '부산광역시 해운대구 해운대해변로 264',
    rating: 4.7,
    reviewCount: 512,
  },
  {
    placeId: 4,
    imageUrl: '/dummy_placecard.png',
    name: '전통 한옥 카페',
    category: '카페',
    address: '서울특별시 종로구 인사동길 12',
    rating: 4.6,
    reviewCount: 89,
  },
];

const BookMarkPage = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<TabType>('course');
  const [selectedSort, setSelectedSort] = useState<SortType>('latest');

  const handleTabClick = (tab: TabType) => {
    setSelectedTab(tab);
  };

  const handleSortClick = (sort: SortType) => {
    setSelectedSort(sort);
  };

  const handleCourseSave = (courseId: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: 코스 저장 API 호출
    console.log('코스 저장:', courseId);
    // 저장 성공 시 알림 또는 상태 업데이트
  };

  const handlePlaceSave = (placeId: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: 장소 저장 API 호출
    console.log('장소 저장:', placeId);
    // 저장 성공 시 알림 또는 상태 업데이트
  };

  const sortOptions: { value: SortType; label: string }[] = [
    { value: 'latest', label: '최신 순' },
    { value: 'name', label: '이름 순' },
    { value: 'date', label: '날짜 순' },
  ];

  // 정렬된 데이터
  const sortedCourses = useMemo(() => {
    const courses = [...dummyCourses];
    switch (selectedSort) {
      case 'name':
        return courses.sort((a, b) => a.title.localeCompare(b.title));
      case 'date':
        return courses.sort((a, b) => b.courseId - a.courseId);
      case 'latest':
      default:
        return courses.sort((a, b) => b.courseId - a.courseId);
    }
  }, [selectedSort]);

  const sortedPlaces = useMemo(() => {
    const places = [...dummyPlaces];
    switch (selectedSort) {
      case 'name':
        return places.sort((a, b) => a.name.localeCompare(b.name));
      case 'date':
        return places.sort((a, b) => b.placeId - a.placeId);
      case 'latest':
      default:
        return places.sort((a, b) => b.placeId - a.placeId);
    }
  }, [selectedSort]);

  const isCourse = selectedTab === 'course';
  const isPlace = selectedTab === 'place';

  return (
    <div>
      <PageHeader title="저장" />
      <div className="px-4 py-4">
        <Tab
          activeTab={selectedTab}
          selectedSort={selectedSort}
          onTabChange={handleTabClick}
          onSortChange={handleSortClick}
          sortOptions={sortOptions}
        />

        {/* 코스 카드 리스트 */}
        {isCourse && (
          <div className="flex w-full flex-col gap-3">
            {sortedCourses.map(course => (
              <CourseCard
                key={course.courseId}
                courseId={course.courseId}
                profileImageUrl={course.profileImageUrl}
                authorName={course.authorName}
                title={course.title}
                location={course.location}
                placeCount={course.placeCount}
                tags={course.tags}
                courseImages={course.courseImages}
                onClick={() => navigate(`/archive/${course.courseId}`)}
                onSaveClick={handleCourseSave(course.courseId)}
              />
            ))}
          </div>
        )}

        {/* 장소 카드 리스트 */}
        {isPlace && (
          <div className="flex w-full flex-col gap-3">
            {sortedPlaces.map(place => (
              <PlaceCard
                key={place.placeId}
                imageUrl={place.imageUrl}
                name={place.name}
                category={place.category}
                address={place.address}
                addressDetail={place.addressDetail}
                rating={place.rating}
                reviewCount={place.reviewCount}
                hasSaveButton={true}
                onSaveButtonClick={handlePlaceSave(place.placeId)}
                onClick={() => navigate(`/archive/place/${place.placeId}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookMarkPage;
