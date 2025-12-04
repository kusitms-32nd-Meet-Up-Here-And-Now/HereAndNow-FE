import bigPinkFolder from '@assets/images/BigPinkFolder.png';
import filterSearchIcon from '@assets/icons/filter_search.svg';
import filterCancelIcon from '@assets/icons/filter_cancel.svg';
import smallPinkFolder from '@assets/images/smallPinkFolder.png';
import { useNavigate } from 'react-router-dom';
import useGetConnectingSearch from '@apis/connecting/useGetConnectingSearch';
import useGetConnectingRecent from '@apis/connecting/useGetConnectingRecent';
import { useEffect } from 'react';

// 날짜 포맷팅 유틸 함수
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}. ${month}. ${day}`;
};

// 날짜 차이 계산 (N일 전)
const getDaysAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return '오늘';
  if (diffDays === 1) return '1일 전';
  return `${diffDays}일 전`;
};

// 요일 계산 (Fri, Nov 등)
const getDateParts = (dateString: string): { day: string; month: string; date: number } => {
  const date = new Date(dateString);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return {
    day: days[date.getDay()],
    month: months[date.getMonth()],
    date: date.getDate(),
  };
};

// 이미지 URL 생성
const getImageUrl = (imagePath: string): string => {
  const baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:8080';
  if (imagePath.startsWith('/')) {
    return `${baseURL}${imagePath}`;
  }
  return `${baseURL}/${imagePath}`;
};

interface FilteredCourse {
  id: number;
  courseTitle: string;
  commentCount: number;
  courseVisitDate: string;
}

interface SearchData {
  selectedFilters: {
    rating: number | null;
    keyword: string[] | null;
    startDate: string | null;
    endDate: string | null;
    region: string | null;
    placeCode: string[] | null;
    tag: string[] | null;
  };
  filteredCourses: FilteredCourse[];
}

const ConnectingArchive = () => {
  const navigate = useNavigate();

  const { data: connectingSearchResponse } = useGetConnectingSearch();
  const { data: connectingRecentResponse } = useGetConnectingRecent();
  const connectingSearchData = connectingSearchResponse?.data as SearchData | null;
  const connectingRecentData = connectingRecentResponse?.data || null;

  // 최근 코스 데이터
  const recentCourse = connectingRecentData || null;
  const recentDateParts = recentCourse?.courseVisitDate ? getDateParts(recentCourse.courseVisitDate) : null;
  const recentDaysAgo = recentCourse?.courseVisitDate ? getDaysAgo(recentCourse.courseVisitDate) : '2일 전';
  const recentFormattedDate = recentCourse?.courseVisitDate ? formatDate(recentCourse.courseVisitDate) : '2025. 11. 05';

  // 검색 데이터
  const searchData = connectingSearchData || null;
  const selectedFilters = searchData?.selectedFilters || null;
  const filteredCourses = searchData?.filteredCourses || [];

  useEffect(() => {
    if (connectingSearchResponse) {
      console.log('getConnectingSearch API 응답:', connectingSearchResponse);
      console.log('connectingSearchData:', connectingSearchData);
    }
    if (connectingRecentResponse) {
      console.log('getConnectingRecent API 응답:', connectingRecentResponse);
      console.log('connectingRecentData:', connectingRecentData);
    }
  }, [connectingSearchResponse, connectingSearchData, connectingRecentResponse, connectingRecentData]);

  console.log('connectingSearchData:', connectingSearchData);

  const handleSearchClick = () => {
    navigate('/connecting/search');
  };

  const handleCourseClick = (courseId: number) => {
    navigate(`/connecting/course/detail/${courseId}`);
  };

  return (
    <div className="min-h-screen overflow-hidden">
      <div className="flex w-full flex-col items-center gap-8">
        {/* 날짜 표시 (최근 코스 기준) */}
        {recentDateParts ? (
          <div className="bg-pink-2 border-pink-2 flex items-center justify-center gap-6 rounded-[50px] border border-solid px-10 py-3">
            <span className="text-s2 text-pink-6">{recentDateParts.day}</span>
            <span className="text-s2 text-pink-6">{recentDateParts.month}</span>
            <span className="text-s2 text-pink-6">{recentDateParts.date}</span>
          </div>
        ) : (
          <div className="bg-pink-2 border-pink-2 flex items-center justify-center gap-6 rounded-[50px] border border-solid px-10 py-3">
            <span className="text-s2 text-pink-6">Fri</span>
            <span className="text-s2 text-pink-6">Nov</span>
            <span className="text-s2 text-pink-6">7</span>
          </div>
        )}

        {/* 상단 큰 폴더 (최근 코스) */}
        <div
          className="relative h-66.75 w-93 cursor-pointer"
          onClick={() => recentCourse?.courseId && handleCourseClick(recentCourse.courseId)}
        >
          <img src={bigPinkFolder} alt="폴더" className="h-full w-full object-cover" />
          <span className="text-s2 text-iceblue-1 absolute top-2.75 left-10">{recentDaysAgo}</span>

          <div className="bg-pink-6 text-s2 absolute top-7 right-5 flex h-9 w-9 items-center justify-center rounded-full text-white">
            {recentCourse?.commentCount ?? 0}
          </div>

          <span className="text-s2 text-neutral-10 absolute top-15.5 left-10">{recentFormattedDate}</span>

          {/* 코스 이미지들 (최대 3개) */}
          <div className="absolute right-13 bottom-7.5 flex items-center">
            {recentCourse?.courseImages && recentCourse.courseImages.length > 0 ? (
              <>
                {recentCourse.courseImages.slice(0, 3).map((imagePath: string, index: number) => {
                  const zIndexClass = index === 0 ? 'z-30' : index === 1 ? 'z-20' : 'z-10';
                  return (
                    <div
                      key={index}
                      className={`border-neutral-10 ${zIndexClass} ${
                        index > 0 ? '-mr-5.25' : ''
                      } flex h-17.5 w-17.5 items-center justify-center overflow-hidden rounded-full border-[1.75px] border-solid`}
                    >
                      <img
                        src={getImageUrl(imagePath)}
                        alt={`코스 이미지 ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  );
                })}
              </>
            ) : (
              <>
                <div className="border-neutral-10 z-30 -mr-5.25 flex h-17.5 w-17.5 items-center justify-center overflow-hidden rounded-full border-[1.75px] border-solid">
                  <img src="/public/dummy_placecard.png" alt="" className="h-full w-full object-cover" />
                </div>
                <div className="border-neutral-10 z-20 -mr-5.25 flex h-17.5 w-17.5 items-center justify-center overflow-hidden rounded-full border-[1.75px] border-solid">
                  <img src="/public/dummy_placecard.png" alt="" className="h-full w-full object-cover" />
                </div>
                <div className="border-neutral-10 z-10 flex h-17.5 w-17.5 items-center justify-center overflow-hidden rounded-full border-[1.75px] border-solid">
                  <img src="/public/dummy_placecard.png" alt="" className="h-full w-full object-cover" />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex w-93 flex-col gap-4 px-6.25 py-4">
          <span className="text-h5 text-neutral-10">
            {recentCourse?.courseTitle ?? '성수동 주말, 오랜만에 만난 친구와 완벽한 하루'}
          </span>

          <span className="text-b4 text-iceblue-8">
            {recentCourse?.courseDescription ??
              '처음 가본 성수동은 신기한 동네다. 한국인데 해외같고, 음식도 다 맛있어서 또 오고 싶어!'}
          </span>

          {/* 태그 표시 */}
          {recentCourse?.courseTags && recentCourse.courseTags.length > 0 ? (
            <div className="flex items-center gap-3 overflow-x-visible">
              {recentCourse.courseTags.map((tag: string, index: number) => {
                const colorClasses = [
                  'bg-purple-2 text-purple-8',
                  'bg-orange-2 text-orange-8',
                  'bg-blue-2 text-blue-8',
                  'bg-green-2 text-green-8',
                ];
                const colorClass = colorClasses[index % colorClasses.length];
                return (
                  <div
                    key={index}
                    className={`${colorClass} text-b4 flex h-9 items-center justify-center rounded-sm px-2.5 whitespace-nowrap`}
                    style={{ boxShadow: '0px 4px 8px 0px #0000000F' }}
                  >
                    {tag}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center gap-3 overflow-x-visible">
              <div
                className="bg-purple-2 text-purple-8 text-b4 flex h-9 items-center justify-center rounded-sm px-2.5 whitespace-nowrap"
                style={{ boxShadow: '0px 4px 8px 0px #0000000F' }}
              >
                사진 찍기 좋아요
              </div>
              <div
                className="bg-orange-2 text-orange-8 text-b4 flex h-9 items-center justify-center rounded-sm px-2.5 whitespace-nowrap"
                style={{ boxShadow: '0px 4px 8px 0px #0000000F' }}
              >
                음식이 맛있어요
              </div>
              <div
                className="bg-blue-2 text-blue-8 text-b4 flex h-9 items-center justify-center rounded-sm px-2.5 whitespace-nowrap"
                style={{ boxShadow: '0px 4px 8px 0px #0000000F' }}
              >
                시설이 깨끗해요
              </div>
            </div>
          )}
        </div>

        <div className="flex w-90.5 flex-col gap-8">
          <div className="flex w-full flex-col gap-4">
            <div
              className="bg-neutral-2 flex h-12 w-full cursor-pointer items-center justify-between rounded-[44px] px-4"
              onClick={handleSearchClick}
            >
              <span className="text-b4 text-neutral-4">찾고 싶은 추억이 있나요?</span>
              <button className="flex h-7 w-7 items-center justify-center">
                <img src={filterSearchIcon} alt="필터 검색" className="h-7 w-7" />
              </button>
            </div>

            {/* 선택된 필터 표시 */}
            <div className="flex w-full items-center gap-1 overflow-x-visible">
              {selectedFilters?.rating && (
                <div className="border-neutral-3 flex h-9 items-center gap-1 rounded-[50px] border-[0.5px] border-solid bg-white pr-3 pl-1.5 whitespace-nowrap">
                  <div className="flex h-6 w-6 items-center justify-center">
                    <img src={filterCancelIcon} alt="삭제" className="h-6 w-6" />
                  </div>
                  <span className="text-d1 text-neutral-4">별점</span>
                  <span className="text-d1 text-neutral-6">{selectedFilters.rating}점</span>
                </div>
              )}
              {(selectedFilters?.startDate || selectedFilters?.endDate) && (
                <div className="border-neutral-3 flex h-9 items-center gap-1 rounded-[50px] border-[0.5px] border-solid bg-white pr-3 pl-1.5 whitespace-nowrap">
                  <div className="flex h-6 w-6 items-center justify-center">
                    <img src={filterCancelIcon} alt="삭제" className="h-6 w-6" />
                  </div>
                  <span className="text-d1 text-neutral-4">언제</span>
                  <span className="text-d1 text-neutral-6">
                    {selectedFilters.startDate ? formatDate(selectedFilters.startDate).replace(/\s/g, '') : ''}{' '}
                    {selectedFilters.endDate ? `~ ${formatDate(selectedFilters.endDate).replace(/\s/g, '')}` : ''}
                  </span>
                </div>
              )}
              {selectedFilters?.keyword &&
                selectedFilters.keyword.map((keyword: string, index: number) => (
                  <div
                    key={`keyword-${index}`}
                    className="border-neutral-3 flex h-9 items-center gap-1 rounded-[50px] border-[0.5px] border-solid bg-white pr-3 pl-1.5 whitespace-nowrap"
                  >
                    <div className="flex h-6 w-6 items-center justify-center">
                      <img src={filterCancelIcon} alt="삭제" className="h-6 w-6" />
                    </div>
                    <span className="text-d1 text-neutral-4">누구와</span>
                    <span className="text-d1 text-neutral-6">{keyword}</span>
                  </div>
                ))}
              {selectedFilters?.region && (
                <div className="border-neutral-3 flex h-9 items-center gap-1 rounded-[50px] border-[0.5px] border-solid bg-white pr-3 pl-1.5 whitespace-nowrap">
                  <div className="flex h-6 w-6 items-center justify-center">
                    <img src={filterCancelIcon} alt="삭제" className="h-6 w-6" />
                  </div>
                  <span className="text-d1 text-neutral-4">지역</span>
                  <span className="text-d1 text-neutral-6">{selectedFilters.region}</span>
                </div>
              )}
              {selectedFilters?.placeCode &&
                selectedFilters.placeCode.map((placeCode: string, index: number) => (
                  <div
                    key={`placeCode-${index}`}
                    className="border-neutral-3 flex h-9 items-center gap-1 rounded-[50px] border-[0.5px] border-solid bg-white pr-3 pl-1.5 whitespace-nowrap"
                  >
                    <div className="flex h-6 w-6 items-center justify-center">
                      <img src={filterCancelIcon} alt="삭제" className="h-6 w-6" />
                    </div>
                    <span className="text-d1 text-neutral-4">업종</span>
                    <span className="text-d1 text-neutral-6">{placeCode}</span>
                  </div>
                ))}
            </div>

            {/* 태그 필터 표시 */}
            {selectedFilters?.tag && selectedFilters.tag.length > 0 ? (
              <div className="flex w-full items-center gap-2 overflow-x-visible">
                {selectedFilters.tag.map((tag: string, index: number) => {
                  const colorClasses = [
                    'bg-purple-2 text-purple-8',
                    'bg-orange-2 text-orange-8',
                    'bg-blue-2 text-blue-8',
                    'bg-green-2 text-green-8',
                  ];
                  const colorClass = colorClasses[index % colorClasses.length];
                  return (
                    <div
                      key={`tag-${index}`}
                      className={`${colorClass} text-d1 flex h-8 items-center justify-center rounded-sm px-2.5 whitespace-nowrap`}
                    >
                      {tag}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex w-full items-center gap-2 overflow-x-visible">
                <div className="bg-purple-2 text-d1 text-purple-8 flex h-8 items-center justify-center rounded-sm px-2.5 whitespace-nowrap">
                  사진 찍기 좋아요
                </div>
                <div className="bg-orange-2 text-d1 text-orange-8 flex h-8 items-center justify-center rounded-sm px-2.5 whitespace-nowrap">
                  음식이 맛있어요
                </div>
                <div className="bg-blue-2 text-d1 text-blue-8 flex h-8 items-center justify-center rounded-sm px-2.5 whitespace-nowrap">
                  시설이 깨끗해요
                </div>
                <div className="bg-green-2 text-d1 text-green-8 flex h-8 items-center justify-center rounded-sm px-2.5 whitespace-nowrap">
                  친절해요
                </div>
              </div>
            )}
          </div>

          <div className="flex w-full flex-wrap gap-x-5 gap-y-8 px-1.75">
            {filteredCourses.length > 0
              ? filteredCourses.map((course: FilteredCourse) => (
                  <div
                    key={course.id}
                    className="flex h-26 w-18 cursor-pointer flex-col"
                    onClick={() => handleCourseClick(course.id)}
                  >
                    <div className="relative flex h-18 w-18 items-center justify-center">
                      <img src={smallPinkFolder} alt="폴더" className="h-full w-full object-cover" />

                      <div className="bg-pink-6 text-d4 absolute top-2.5 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full text-white">
                        {course.commentCount}
                      </div>
                    </div>

                    <div className="flex w-full flex-col gap-0.5">
                      <span className="text-d2 text-neutral-10 line-clamp-1 w-17 text-center">
                        {course.courseTitle}
                      </span>
                      <span className="text-d3 text-neutral-5 line-clamp-1 w-17 text-center">
                        {formatDate(course.courseVisitDate)}
                      </span>
                    </div>
                  </div>
                ))
              : // 더미 데이터 표시 (API 실패 시)
                Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="flex h-26 w-18 flex-col">
                    <div className="relative flex h-18 w-18 items-center justify-center">
                      <img src={smallPinkFolder} alt="폴더" className="h-full w-full object-cover" />

                      <div className="bg-pink-6 text-d4 absolute top-2.5 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full text-white">
                        4
                      </div>
                    </div>

                    <div className="flex w-full flex-col gap-0.5">
                      <span className="text-d2 text-neutral-10 line-clamp-1 w-17 text-center">
                        강남에서 보내던 하루
                      </span>
                      <span className="text-d3 text-neutral-5 line-clamp-1 w-17 text-center">2025. 11. 02</span>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectingArchive;
