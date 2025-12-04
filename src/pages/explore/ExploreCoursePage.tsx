import exploreSearchIcon from '@assets/icons/explore_search.svg';
import exploreBackIcon from '@assets/icons/explore_back.svg';
import { useNavigate, useLocation } from 'react-router-dom';
import CourseCard from '@pages/home/components/CourseCard';
import { useGetCourseList, useSearchCourseList } from '@apis/explore/explore';
import type { CourseSearchParams, CourseSearchResponse } from '@apis/explore/explore';
import { useEffect, useState } from 'react';
import api from '@apis/common/api';
import SelectedFiltersChips from '@pages/archive/components/SelectedFilters';
import SelectedTagList from '@pages/archive/components/SelectedTagList';

// 날짜 포맷팅 함수: "2025-11-05" -> "2025. 11. 05"
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}. ${month}. ${day}`;
};

type CourseLocationState = {
  searchParams: CourseSearchParams;
  searchResult: CourseSearchResponse;
};

const ExploreCoursePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchState, setSearchState] = useState<CourseLocationState | null>(() => {
    const initialState = location.state as CourseLocationState | null | undefined;
    return initialState ?? null;
  });

  useEffect(() => {
    if (location.state) {
      setSearchState(location.state as CourseLocationState);
    }
  }, [location.state]);

  const updateSearchState = (nextState: CourseLocationState | null) => {
    setSearchState(nextState);
    if (nextState) {
      navigate('/explore/course', { state: nextState, replace: true });
    } else {
      navigate('/explore/course', { replace: true });
    }
  };

  // 검색 파라미터가 있으면 검색 결과 사용, 없으면 기본 데이터 사용
  const searchParams = searchState?.searchParams;
  const { data: searchResponse } = useSearchCourseList(searchParams || {}, !!searchParams);

  // 검색 결과 또는 기본 데이터 결정
  const searchResult = searchResponse || searchState?.searchResult;

  const isSearchMode = !!searchParams;

  // 기본 코스 리스트 데이터 가져오기 (항상 호출)
  const { data: defaultCourseResponse } = useGetCourseList({ page: 0, size: 20 });
  const defaultCourses = defaultCourseResponse?.data || [];

  // 표시할 코스 리스트 결정
  const displayedCourses = isSearchMode ? searchResult?.data?.filteredCourses || [] : defaultCourses;

  // 검색 필터 정보 (검색 모드일 때만 표시)
  const selectedFilters = isSearchMode ? searchResult?.data?.selectedFilters : undefined;

  // 필터 삭제 핸들러
  const handleFilterRemove = async (filterType: keyof CourseSearchParams) => {
    if (!searchState?.searchParams) return;

    // 필터 제거한 새로운 파라미터 생성
    const newParams: CourseSearchParams = { ...searchState.searchParams };
    delete newParams[filterType];

    // 모든 필터가 제거되었는지 확인
    const hasAnyFilter = Object.keys(newParams).length > 0;

    if (!hasAnyFilter) {
      // 모든 필터가 제거되면 기본 모드로 전환
      updateSearchState(null);
      return;
    }

    // 새로운 파라미터로 재검색
    try {
      const { data } = await api.get<CourseSearchResponse>('/discover/course/search', { params: newParams });
      if (data.isSuccess) {
        updateSearchState({ searchParams: newParams, searchResult: data });
      }
    } catch (error) {
      console.error('필터 삭제 후 재검색 실패:', error);
    }
  };

  // 태그 삭제 핸들러
  const handleTagRemove = async (tagToRemove: string) => {
    if (!searchState?.searchParams || !selectedFilters?.tag) return;

    // 태그 배열에서 제거
    const newTags = selectedFilters.tag.filter(tag => tag !== tagToRemove);

    // 새로운 파라미터 생성
    const newParams: CourseSearchParams = { ...searchState.searchParams };
    if (newTags.length > 0) {
      newParams.tag = newTags.join(',');
    } else {
      delete newParams.tag;
    }

    // 모든 필터가 제거되었는지 확인
    const hasAnyFilter = Object.keys(newParams).length > 0;

    if (!hasAnyFilter) {
      // 모든 필터가 제거되면 기본 모드로 전환
      updateSearchState(null);
      return;
    }

    // 새로운 파라미터로 재검색
    try {
      const { data } = await api.get<CourseSearchResponse>('/discover/course/search', { params: newParams });
      if (data.isSuccess) {
        updateSearchState({ searchParams: newParams, searchResult: data });
      }
    } catch (error) {
      console.error('태그 삭제 후 재검색 실패:', error);
    }
  };

  // API 응답 콘솔 출력
  useEffect(() => {
    if (defaultCourseResponse) {
      console.log('getCourseList API 응답 (default):', defaultCourseResponse);
    }
    if (searchResponse) {
      console.log('searchCourseList API 응답:', searchResponse);
    }
  }, [defaultCourseResponse, searchResponse]);

  return (
    <div className="min-h-screen">
      <div className="flex w-full flex-col py-[54px]">
        {/* 필터링 */}
        <div className="flex w-full flex-col gap-4">
          {/* 검색 바 */}
          <div className="flex h-12 max-h-12 min-h-12 w-full items-center gap-4">
            {/* 뒤로가기 버튼 */}
            <button
              className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white"
              style={{ boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.1)' }}
              onClick={() => navigate(-1)}
            >
              <img src={exploreBackIcon} alt="뒤로가기" className="h-6 w-6" />
            </button>

            {/* 검색 바 */}
            <div
              className="flex h-full flex-1 cursor-pointer items-center justify-between rounded-[44px] bg-white px-4"
              style={{ boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.1)' }}
              onClick={() => navigate('/explore/search')}
            >
              <input
                type="text"
                placeholder="찾고 싶은 장소가 있나요?"
                className="text-b4 placeholder:text-neutral-4 h-full w-full focus:outline-none"
              />
              <button className="flex h-7 w-7 cursor-pointer items-center justify-center">
                <img src={exploreSearchIcon} alt="검색" className="h-7 w-7" />
              </button>
            </div>
          </div>

          {/* 필터 리스트 */}
          {selectedFilters && (
            <SelectedFiltersChips
              selectedFilters={selectedFilters}
              onRemove={handleFilterRemove}
              formatDate={formatDate}
            />
          )}

          {/* 태그 리스트 */}
          {selectedFilters?.tag && selectedFilters.tag.length > 0 && (
            <SelectedTagList tags={selectedFilters.tag} onRemove={handleTagRemove} />
          )}
        </div>

        {/* 코스 리스트 */}
        <div className="mt-8 flex w-full flex-col gap-3">
          {displayedCourses.length > 0
            ? displayedCourses.map((item, index) => (
                <CourseCard
                  key={item.courseCard.courseId || index}
                  courseId={item.courseCard.courseId}
                  profileImageUrl={item.courseCard.memberProfileImage}
                  authorName={item.courseCard.memberNickname}
                  title={item.courseCard.courseTitle}
                  location={item.courseCard.courseRegion}
                  placeCount={item.courseCard.pinCount}
                  tags={item.courseCard.courseTags}
                  hasComments={item.comment.count > 0}
                  onClick={() => navigate(`/archive/${item.courseCard.courseId}`)}
                />
              ))
            : // 검색 모드에서 결과가 없을 때
              isSearchMode && (
                <div className="flex w-full items-center justify-center py-20">
                  <span className="text-b3 text-neutral-6">검색 결과가 없습니다.</span>
                </div>
              )}
        </div>
      </div>
    </div>
  );
};

export default ExploreCoursePage;
