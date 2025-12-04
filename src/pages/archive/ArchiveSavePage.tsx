import Modal from '@common/components/Modal';
import PlaceCard from '@pages/home/components/PlaceCard';
import CourseCard from '@pages/bookmark/components/CourseCard';
import TabNavigation from '@pages/home/components/TabNavigation';
import LoadingIndicator from '@common/LoadingIndicator';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useGetSavedCourses from '@apis/archive/query/useGetSavedCourses';
import useGetSavedPlaces from '@apis/archive/query/useGetSavedPlaces';
import usePostCourseScrap from '@apis/course/mutation/usePostCourseScrap';
import usePostPlaceScrap from '@apis/place/mutation/usePostPlaceScrap';
import { useQueryClient } from '@tanstack/react-query';

type TabType = 'course' | 'place';

interface LocationState {
  activeTab?: TabType;
}

const ArchiveSavePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const locationState = location.state as LocationState;

  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>(locationState?.activeTab || 'course');
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [selectedItemType, setSelectedItemType] = useState<'course' | 'place'>('course');

  // API 호출
  const { data: coursesData, isLoading: isCoursesLoading } = useGetSavedCourses({
    page: 0,
    size: 20,
    sort: 'RECENT',
  });

  const { data: placesData, isLoading: isPlacesLoading } = useGetSavedPlaces({
    page: 0,
    size: 20,
    sort: 'RECENT',
  });

  // 스크랩 mutation
  const { mutate: scrapCourse } = usePostCourseScrap();
  const { mutate: scrapPlace } = usePostPlaceScrap();

  const savedCourses = coursesData?.data || [];
  const savedPlaces = placesData?.data || [];

  // 저장 삭제 핸들러
  const handleDeleteSave = () => {
    if (selectedItemId === null) return;

    if (selectedItemType === 'course') {
      scrapCourse(selectedItemId, {
        onSuccess: response => {
          console.log('[코스 스크랩 취소] 성공:', response);
          setIsSaveModalOpen(false);
          // 저장 목록 새로고침
          queryClient.invalidateQueries({ queryKey: ['scrap', 'course'] });
        },
        onError: error => {
          console.error('[코스 스크랩 취소] 실패:', error);
          alert('저장 삭제에 실패했습니다.');
        },
      });
    } else {
      scrapPlace(selectedItemId, {
        onSuccess: response => {
          console.log('[장소 스크랩 취소] 성공:', response);
          setIsSaveModalOpen(false);
          // 저장 목록 새로고침
          queryClient.invalidateQueries({ queryKey: ['scrap', 'place'] });
        },
        onError: error => {
          console.error('[장소 스크랩 취소] 실패:', error);
          alert('저장 삭제에 실패했습니다.');
        },
      });
    }
  };

  // 저장 버튼 클릭 핸들러
  const handleSaveButtonClick = (id: number, type: 'course' | 'place') => {
    setSelectedItemId(id);
    setSelectedItemType(type);
    setIsSaveModalOpen(true);
  };

  // 로딩 상태
  if ((activeTab === 'course' && isCoursesLoading) || (activeTab === 'place' && isPlacesLoading)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen">
        <div className="flex w-full flex-col items-center gap-6">
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="flex w-full flex-col gap-6">
            {activeTab === 'course' && savedCourses.length === 0 && (
              <div className="flex w-full items-center justify-center py-20">
                <p className="text-neutral-5 text-b3">저장한 코스가 없습니다</p>
              </div>
            )}

            {activeTab === 'course' &&
              savedCourses.map(course => (
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
                  onSaveClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    handleSaveButtonClick(course.courseId, 'course');
                  }}
                />
              ))}

            {activeTab === 'place' && savedPlaces.length === 0 && (
              <div className="flex w-full items-center justify-center py-20">
                <p className="text-neutral-5 text-b3">저장한 장소가 없습니다</p>
              </div>
            )}

            {activeTab === 'place' &&
              savedPlaces.map(place => (
                <PlaceCard
                  key={place.placeId}
                  imageUrl={place.placeImageUrl}
                  name={place.placeName}
                  category={place.placeCategory}
                  address={place.placeStreetNameAddress}
                  addressDetail={`(지번) ${place.placeNumberAddress}`}
                  rating={place.placeRating}
                  reviewCount={place.reviewCount}
                  hasSaveButton
                  onSaveButtonClick={() => handleSaveButtonClick(place.placeId, 'place')}
                  onClick={() => navigate(`/archive/place/${place.placeId}`)}
                />
              ))}
          </div>
        </div>
      </div>

      {/* 저장 삭제 모달 */}
      <Modal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        mainMessage="저장을 삭제하시겠어요?"
        subMessage="한 번 삭제하면 다시 되돌릴 수 없어요"
        leftButtonText="아니요"
        leftButtonOnClick={() => setIsSaveModalOpen(false)}
        rightButtonText="네, 삭제할게요"
        rightButtonOnClick={handleDeleteSave}
      />
    </>
  );
};

export default ArchiveSavePage;
