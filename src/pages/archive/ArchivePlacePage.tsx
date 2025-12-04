import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import dummyPlaceCardImage from '/dummy_placecard.png';
import Star from '@pages/home/components/Star';
import KakaoMap from '@common/KakaoMap';
import CourseCard from '@pages/home/components/CourseCard';
import useGetPlace from '@apis/common/useGetPlace';
import LoadingIndicator from '@common/LoadingIndicator';
import usePostPlaceScrap from '@apis/place/mutation/usePostPlaceScrap';
import placeSaveIcon from '@assets/icons/place_save.svg';
import placeNotSaveIcon from '@assets/icons/place_not_save.svg';

const ArchivePlacePage = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedTab, setSelectedTab] = useState<'good' | 'bad'>('good');
  const [isSaved, setIsSaved] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());

  // URL 파라미터를 숫자로 변환
  const placeId = id ? parseInt(id, 10) : 0;

  // 장소 상세 정보 조회
  const { data: placeResponse, isLoading, error } = useGetPlace(placeId);
  const placeData = placeResponse?.data;
  const placeInfo = placeData?.placeCardResponseDto;

  // 장소 스크랩 mutation
  const { mutate: scrapPlace } = usePostPlaceScrap();

  const handleSaveClick = () => {
    if (placeId) {
      scrapPlace(placeId, {
        onSuccess: () => {
          setIsSaved(true);
        },
      });
    }
  };

  const handleOpenKakaoMap = () => {
    if (placeInfo?.lat && placeInfo?.lon && placeInfo?.placeName) {
      const kakaoMapUrl = `https://map.kakao.com/link/map/${encodeURIComponent(placeInfo.placeName)},${placeInfo.lat},${placeInfo.lon}`;
      window.open(kakaoMapUrl, '_blank');
    }
  };

  useEffect(() => {
    console.log('[ArchivePlacePage] 위도:', placeInfo?.lat);
    console.log('[ArchivePlacePage] 경도:', placeInfo?.lon);
  }, [placeInfo?.lat, placeInfo?.lon]);

  const renderStars = (rating: number) => {
    const stars = [];

    for (let i = 0; i < 5; i++) {
      const starRating = rating - i;
      let fillPercentage = 0;

      if (starRating >= 1) {
        fillPercentage = 100;
      } else if (starRating > 0) {
        fillPercentage = starRating * 100;
      }

      stars.push(
        <div key={i} className="flex h-[14px] w-[14px] items-center justify-center">
          <Star fillPercentage={fillPercentage} starId={i} />
        </div>,
      );
    }

    return stars;
  };

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingIndicator message="장소 정보를 불러오는 중..." />
      </div>
    );
  }

  // 에러 상태 처리
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="text-s2 text-neutral-6">장소 정보를 불러올 수 없습니다.</span>
          <span className="text-b4 text-neutral-5">잠시 후 다시 시도해주세요.</span>
        </div>
      </div>
    );
  }

  // 데이터 없음 상태 처리
  if (!placeData || !placeInfo) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="text-s2 text-neutral-6">장소 정보를 찾을 수 없습니다.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="flex w-full flex-col">
        {/* 사진 영역 */}
        <div className="flex w-full gap-[10px]">
          <div className="flex h-60 max-h-60 min-h-60 w-60 max-w-60 min-w-60 items-center justify-center overflow-hidden rounded-[9.41px]">
            <img
              src={placeData.bannerImageList[0] || placeInfo.placeImageUrl || dummyPlaceCardImage}
              alt="사진"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex h-[116px] max-h-[116px] min-h-[116px] w-[116px] max-w-[116px] min-w-[116px] items-center justify-center overflow-hidden rounded-[4px]">
              <img
                src={placeData.bannerImageList[1] || placeInfo.placeImageUrl || dummyPlaceCardImage}
                alt="사진"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex h-[116px] max-h-[116px] min-h-[116px] w-[116px] max-w-[116px] min-w-[116px] items-center justify-center overflow-hidden rounded-[4px]">
              <img
                src={placeData.bannerImageList[2] || placeInfo.placeImageUrl || dummyPlaceCardImage}
                alt="사진"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* 장소 정보 */}
        <div className="mt-6 flex w-full flex-col">
          <div className="flex items-center gap-2">
            <span className="text-s1 text-neutral-8">{placeInfo.placeName}</span>
            <span className="text-d2 text-neutral-5">{placeInfo.placeCategory}</span>
          </div>

          <span className="text-b2 text-neutral-5 mt-4">{placeInfo.placeStreetNameAddress}</span>
          {placeInfo.placeNumberAddress && (
            <span className="text-b4 text-neutral-4 mt-[2px]">(지번) {placeInfo.placeNumberAddress}</span>
          )}

          {/* 별점 */}
          <div className="mt-3 flex h-[22px] items-center gap-1">
            <span className="text-b5 text-yellow-5">{placeInfo.placeRating}</span>
            <div className="flex items-center">{renderStars(placeInfo.placeRating)}</div>
            <div className="bg-neutral-3 h-2 w-[0.75px] rounded-full"></div>
            <span className="text-b5 text-neutral-5 whitespace-nowrap">리뷰 {placeInfo.reviewCount}건</span>
          </div>
        </div>

        {/* 태그 */}
        {placeData.placeTagList && placeData.placeTagList.length > 0 && (
          <div className="mt-6 flex items-center gap-3 overflow-x-visible">
            {placeData.placeTagList.map((tag, index) => {
              // 태그별 색상 지정 (간단한 로직)
              const colorClasses = [
                'bg-purple-2 text-purple-8',
                'bg-orange-2 text-orange-8',
                'bg-blue-2 text-blue-8',
                'bg-pink-2 text-pink-8',
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
        )}

        {/* 지도 */}
        <div className="mt-6 h-60 max-h-60 min-h-60 w-[362px]">
          <KakaoMap
            latitude={placeInfo.lat}
            longitude={placeInfo.lon}
            markers={[
              {
                latitude: placeInfo.lat,
                longitude: placeInfo.lon,
                name: placeInfo.placeName,
              },
            ]}
            showHeartButton={false}
            className="h-full w-full"
          />
        </div>

        {/* 사진 리스트 */}
        {placeData.placeInfoImageList && placeData.placeInfoImageList.length > 0 && (
          <div className="-mx-5 mt-6 w-[calc(100%+2.5rem)] overflow-x-visible">
            <div className="flex w-full gap-2 overflow-x-scroll px-5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {placeData.placeInfoImageList.map((photo, index) => (
                <div
                  key={index}
                  className="border-iceblue-4 flex h-20 min-h-20 w-20 min-w-20 items-center justify-center overflow-hidden rounded-[8px] border"
                >
                  <img src={photo} alt="사진" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 좋았던 점 / 아쉬웠던 점 */}
        <div className="mt-10 flex w-full flex-col gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedTab('good')}
              className={`flex h-7 w-16 cursor-pointer items-start justify-center ${
                selectedTab === 'good' ? 'border-iceblue-10 border-b-2' : ''
              }`}
            >
              <span className={`text-d1 ${selectedTab === 'good' ? 'text-iceblue-10' : 'text-iceblue-8'}`}>
                좋았던 점
              </span>
            </button>
            <button
              onClick={() => setSelectedTab('bad')}
              className={`flex h-7 w-[75px] cursor-pointer items-start justify-center ${
                selectedTab === 'bad' ? 'border-iceblue-10 border-b-2' : ''
              }`}
            >
              <span className={`text-d1 ${selectedTab === 'bad' ? 'text-iceblue-10' : 'text-iceblue-8'}`}>
                아쉬웠던 점
              </span>
            </button>
          </div>

          <div className="flex w-full flex-col gap-2">
            {selectedTab === 'good' ? (
              placeData.placePositiveList && placeData.placePositiveList.length > 0 ? (
                placeData.placePositiveList.map((review, index) => {
                  const reviewKey = `good-${index}`;
                  const isExpanded = expandedReviews.has(reviewKey);
                  return (
                    <div
                      key={index}
                      className="border-iceblue-2 h-fit w-full cursor-pointer rounded-[8px] border px-5 py-3"
                      onClick={() => setExpandedReviews(prev => new Set(prev).add(reviewKey))}
                    >
                      <span
                        className={`text-b4 text-iceblue-8 block ${!isExpanded ? 'truncate overflow-hidden text-ellipsis whitespace-nowrap' : ''}`}
                      >
                        {review}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="border-iceblue-2 h-fit w-full rounded-[8px] border px-5 py-3">
                  <span className="text-b4 text-neutral-5">아직 좋았던 점이 없습니다.</span>
                </div>
              )
            ) : placeData.placeNegativeList && placeData.placeNegativeList.length > 0 ? (
              placeData.placeNegativeList.map((review, index) => {
                const reviewKey = `bad-${index}`;
                const isExpanded = expandedReviews.has(reviewKey);
                return (
                  <div
                    key={index}
                    className="border-iceblue-2 h-fit w-full cursor-pointer rounded-[8px] border px-5 py-3"
                    onClick={() => setExpandedReviews(prev => new Set(prev).add(reviewKey))}
                  >
                    <span
                      className={`text-b4 text-iceblue-8 block ${!isExpanded ? 'truncate overflow-hidden text-ellipsis whitespace-nowrap' : ''}`}
                    >
                      {review}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="border-iceblue-2 h-fit w-full rounded-[8px] border px-5 py-3">
                <span className="text-b4 text-neutral-5">아직 아쉬웠던 점이 없습니다.</span>
              </div>
            )}
          </div>
        </div>

        {/* 이 장소가 포함된 코스를 추천해요 */}
        {placeData.courseList && placeData.courseList.length > 0 && (
          <div className="mt-8 flex w-full flex-col gap-4">
            <span className="text-s2 text-neutral-6">이 장소가 포함된 코스를 추천해요</span>
            <div className="-mx-5 mt-6 w-[calc(100%+2.5rem)] overflow-x-visible">
              <div className="flex w-full gap-[10px] overflow-x-scroll px-5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {placeData.courseList.map(course => (
                  <div key={course.courseId} className="w-[362px] max-w-[362px] min-w-[362px]">
                    <CourseCard
                      courseId={course.courseId}
                      profileImageUrl={course.memberProfileImage}
                      authorName={course.memberNickname}
                      title={course.courseTitle}
                      location={course.courseRegion}
                      placeCount={course.pinCount}
                      tags={course.courseTags}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 저장 / 지도에서 보기 */}
        <div className="mt-8 flex w-full gap-3 py-5">
          <button
            type="button"
            onClick={handleSaveClick}
            className="bg-iceblue-2 text-s5 text-iceblue-7 flex h-13.5 w-full flex-1 cursor-pointer items-center justify-center gap-4 rounded-[12px]"
          >
            <img src={isSaved ? placeSaveIcon : placeNotSaveIcon} alt="저장" className="h-8 w-8" />
            <span className="text-s5 text-iceblue-7">{isSaved ? '저장 취소' : '저장'}</span>
          </button>
          <button
            type="button"
            onClick={handleOpenKakaoMap}
            className="bg-iceblue-8 text-s5 flex h-13.5 w-full flex-1 cursor-pointer items-center justify-center rounded-[12px] text-white"
          >
            지도에서 보기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArchivePlacePage;
