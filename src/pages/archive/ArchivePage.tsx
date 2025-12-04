import bigFolder from '@assets/images/bigFolder.png';
import filterSearchIcon from '@assets/icons/filter_search.svg';
import { useNavigate, useLocation } from 'react-router-dom';
import useGetRecentArchive from '@apis/archive/query/useGetRecentArchive';
import useSearchArchive from '@apis/archive/query/useSearchArchive';
import type { ArchiveSearchParams, ArchiveSearchResponse } from '@apis/archive/archive';
import { useEffect, useState } from 'react';
import api from '@apis/common/api';
import SelectedFiltersChips from './components/SelectedFilters';
import SelectedTagList from './components/SelectedTagList';
import ArchiveFolderList from './components/ArchiveFolderList';

// 날짜 포맷팅 함수: "2025-11-05" -> "2025. 11. 05"
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}. ${month}. ${day}`;
};

// 며칠 전 계산 함수
const getDaysAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return '오늘';
  if (diffDays === 1) return '1일 전';
  return `${diffDays}일 전`;
};

// 태그 색상 매핑 (purple, orange, blue 순환)
const getTagColorClass = (index: number): { bg: string; text: string } => {
  const colors = [
    { bg: 'bg-purple-2', text: 'text-purple-8' },
    { bg: 'bg-orange-2', text: 'text-orange-8' },
    { bg: 'bg-blue-2', text: 'text-blue-8' },
  ];
  return colors[index % colors.length];
};

type ArchiveLocationState = {
  searchParams: ArchiveSearchParams;
  searchResult: ArchiveSearchResponse;
};

const ArchivePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchState, setSearchState] = useState<ArchiveLocationState | null>(() => {
    const initialState = location.state as ArchiveLocationState | null | undefined;
    return initialState ?? null;
  });

  useEffect(() => {
    if (location.state) {
      setSearchState(location.state as ArchiveLocationState);
    }
  }, [location.state]);

  const updateSearchState = (nextState: ArchiveLocationState | null) => {
    setSearchState(nextState);
    if (nextState) {
      navigate('/archive', { state: nextState, replace: true });
    } else {
      navigate('/archive', { replace: true });
    }
  };

  // 검색 파라미터가 있으면 검색 결과 사용, 없으면 기본 데이터 사용
  const searchParams = searchState?.searchParams;
  const { data: searchResponse } = useSearchArchive(searchParams || {}, !!searchParams);

  // 검색 결과 또는 기본 데이터 결정
  const searchResult = searchResponse || searchState?.searchResult;

  const isSearchMode = !!searchParams;

  // React Query로 최신 아카이빙 폴더 데이터 가져오기 (항상 호출)
  const { data: recentArchiveResponse } = useGetRecentArchive();
  const recentArchiveData = recentArchiveResponse?.data || null;

  // React Query로 생성한 코스 폴더 리스트 가져오기 (검색 API 재사용)
  const { data: defaultArchiveResponse } = useSearchArchive({ page: 0, size: 32 });
  const defaultArchives = defaultArchiveResponse?.data?.filteredCourses || [];

  // 표시할 폴더 리스트 결정
  const displayedArchives = isSearchMode ? searchResult?.data?.filteredCourses || [] : defaultArchives;

  // 검색 필터 정보 (검색 모드일 때만 표시)
  const selectedFilters = isSearchMode ? searchResult?.data?.selectedFilters : undefined;

  // 필터 삭제 핸들러
  const handleFilterRemove = async (filterType: keyof ArchiveSearchParams) => {
    if (!searchState?.searchParams) return;

    // 필터 제거한 새로운 파라미터 생성
    const newParams: ArchiveSearchParams = { ...searchState.searchParams };
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
      const { data } = await api.get<ArchiveSearchResponse>('/archive/search', { params: newParams });
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
    const newParams: ArchiveSearchParams = { ...searchState.searchParams };
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
      const { data } = await api.get<ArchiveSearchResponse>('/archive/search', { params: newParams });
      if (data.isSuccess) {
        updateSearchState({ searchParams: newParams, searchResult: data });
      }
    } catch (error) {
      console.error('태그 삭제 후 재검색 실패:', error);
    }
  };

  // API 응답 콘솔 출력
  useEffect(() => {
    if (recentArchiveResponse) {
      console.log('getRecentArchive API 응답:', recentArchiveResponse);
      console.log('recentArchiveData:', recentArchiveData);
    }
    if (defaultArchiveResponse) {
      console.log('searchArchive API 응답 (default):', defaultArchiveResponse);
      console.log('defaultArchives:', defaultArchives);
    }
    if (searchResponse) {
      console.log('searchArchive API 응답:', searchResponse);
    }
  }, [recentArchiveResponse, recentArchiveData, defaultArchiveResponse, defaultArchives, searchResponse]);

  // 검색바 클릭 핸들러
  const handleSearchClick = () => {
    navigate('/archive/search');
  };

  // 폴더 클릭 핸들러
  const handleFolderClick = (courseId: number) => {
    navigate(`/archive/${courseId}`);
  };

  // 오늘 날짜 포맷팅
  const today = new Date();
  const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'short' });
  const month = today.toLocaleDateString('en-US', { month: 'short' });
  const day = today.getDate();

  return (
    <div className="min-h-screen">
      <div className="flex w-full flex-col items-center gap-8">
        {/* 날짜 */}
        <div className="bg-iceblue-2 border-iceblue-2 flex items-center justify-center gap-6 rounded-[50px] border border-solid px-10 py-3">
          <span className="text-s2 text-iceblue-8">{dayOfWeek}</span>
          <span className="text-s2 text-iceblue-8">{month}</span>
          <span className="text-s2 text-iceblue-8">{day}</span>
        </div>

        {/* 폴더 */}
        {recentArchiveData && (
          <>
            <div className="relative h-66.75 w-93">
              <img src={bigFolder} alt="폴더" className="h-full w-full object-cover" />
              {/* 며칠 전 */}
              <span className="text-s2 text-iceblue-1 absolute top-2.75 left-10">
                {getDaysAgo(recentArchiveData.courseVisitDate)}
              </span>

              {/* 개수 */}
              <div className="bg-pink-6 text-s2 absolute top-8 right-6 flex h-9 w-9 items-center justify-center rounded-full text-white">
                {recentArchiveData.commentCount}
              </div>

              {/* 날짜 */}
              <span className="text-s2 text-neutral-10 absolute top-15.5 left-10">
                {formatDate(recentArchiveData.courseVisitDate)}
              </span>

              {/* 사진 */}
              <div className="absolute right-13 bottom-7.5 flex items-center">
                {recentArchiveData.courseImages.slice(0, 3).map((imageUrl, index) => {
                  const zIndexClass = index === 0 ? 'z-30' : index === 1 ? 'z-20' : 'z-10';
                  return (
                    <div
                      key={index}
                      className={`border-neutral-10 ${zIndexClass} ${
                        index < 2 ? '-mr-5.25' : ''
                      } flex h-17.5 w-17.5 items-center justify-center overflow-hidden rounded-full border-[1.75px] border-solid`}
                    >
                      <img src={imageUrl} alt="" className="h-full w-full object-cover" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 타이틀 / 설명 / 태그 */}
            <div className="flex w-93 flex-col gap-4 px-6.25 py-4">
              {/* 타이틀 */}
              <span className="text-h5 text-neutral-10">{recentArchiveData.courseTitle}</span>

              {/* 설명 */}
              <span className="text-b4 text-iceblue-8">{recentArchiveData.courseDescription}</span>

              {/* 태그 */}
              {/* TODO: 컴포넌트로 분리 */}
              <div className="flex items-center gap-3 overflow-x-visible">
                {recentArchiveData.courseTags.map((tag, index) => {
                  const colorClass = getTagColorClass(index);
                  return (
                    <div
                      key={index}
                      className={`${colorClass.bg} ${colorClass.text} text-b4 flex h-9 items-center justify-center rounded-sm px-2.5 whitespace-nowrap`}
                      style={{ boxShadow: '0px 4px 8px 0px #0000000F' }}
                    >
                      {tag}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* 필터 검색 / 폴더 리스트 */}
        <div className="flex w-90.5 flex-col gap-8">
          {/* 필터 검색 */}
          <div className="flex w-full flex-col gap-4">
            {/* 검색 바 */}
            <div
              className="bg-neutral-2 flex h-12 w-full cursor-pointer items-center justify-between rounded-[44px] px-4"
              onClick={handleSearchClick}
            >
              <span className="text-b4 text-neutral-4">찾고 싶은 추억이 있나요?</span>
              <button className="flex h-7 w-7 items-center justify-center">
                <img src={filterSearchIcon} alt="필터 검색" className="h-7 w-7" />
              </button>
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

          {/* 폴더 리스트 */}
          <ArchiveFolderList
            archives={displayedArchives}
            onFolderClick={handleFolderClick}
            formatDate={formatDate}
            showEmptyMessage={isSearchMode}
          />
        </div>
      </div>
    </div>
  );
};

export default ArchivePage;
