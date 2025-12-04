import { useNavigate } from 'react-router-dom';
import ReviewSection from './ReviewSection';
import CoupleComment from './CoupleComment';
import type { CourseDetailResponse } from '@apis/course/types';
import useGetCourseComment from '@apis/course/query/useGetCourseComment';

const RightArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

// 별점 렌더링 함수
const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex text-yellow-400">
      {Array.from({ length: fullStars }).map((_, i) => (
        <span key={i}>★</span>
      ))}
      {hasHalfStar && <span className="opacity-50">★</span>}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <span key={i} className="text-gray-300">
          ★
        </span>
      ))}
    </div>
  );
};

interface DetailSectionProps {
  pins?: CourseDetailResponse['data']['pins'];
  courseId?: number;
}

const DetailSection = ({ pins = [], courseId }: DetailSectionProps) => {
  const navigate = useNavigate();
  const { data: commentData, isLoading: isCommentLoading } = useGetCourseComment(courseId || 0);

  const handleNavigateToArchive = () => {
    // TODO: 추후 제공 - courseId를 사용하여 아카이브 상세 페이지로 이동
    // navigate(`/archive/${courseId}`);

    // 현재는 아카이브 메인 페이지로 이동
    navigate('/archive');
  };

  if (pins.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <span className="text-iceblue-8">장소 정보가 없습니다.</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {pins.map((pin, index) => {
        const place = pin.placeDetails;
        const mainImage = pin.pinImages && pin.pinImages.length > 0 ? pin.pinImages[0] : '/dummy_course_detail.png';

        return (
          <div key={pin.pinIndex} className="flex flex-col gap-4">
            {/* --- 헤더 --- */}
            <div className="mb-4 flex items-center gap-2">
              <span className="text-d2 flex h-[20px] w-[20px] items-center justify-center rounded-full bg-pink-500 text-white">
                {pin.pinIndex}
              </span>
              <span className="text-d1 text-neutral-8 font-bold">{place.placeName}</span>
            </div>

            <div className="flex flex-row gap-[12px]">
              {/* --- 1. 메인 이미지 --- */}
              <div className="border-iceblue-4 h-[173px] w-[173px] flex-shrink-0 rounded-[8px] border-2">
                <img src={mainImage} alt={place.placeName} className="h-full w-full rounded-[6px] object-cover" />
              </div>

              {/* --- 2. 정보 --- */}
              <div className="flex flex-1 flex-col">
                <div className="flex flex-col gap-1">
                  <span className="text-b3 text-neutral-10">{place.placeName}</span>
                  <span className="text-d2 text-iceblue-8">{place.placeCategory}</span>
                  <span className="text-d1 text-iceblue-8">{place.placeStreetNameAddress}</span>

                  {/* 평점 및 리뷰 */}
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span className="text-b5 font-bold text-yellow-500">{place.placeRating.toFixed(1)}</span>
                    {renderStars(place.placeRating)}
                    <span className="text-b5 text-iceblue-8">리뷰 {place.reviewCount}건</span>
                  </div>
                </div>

                <div className="mt-auto">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-lg bg-gray-100 p-4 transition-colors hover:bg-gray-200"
                  >
                    <span className="font-medium text-gray-800">자세히</span>
                    <RightArrowIcon />
                  </button>
                </div>
              </div>
            </div>

            {/* --- 포토 슬라이드 영역 --- */}
            {pin.pinImages && pin.pinImages.length > 0 && (
              <div
                className="hide-scrollbar mt-3 mb-3 overflow-x-auto whitespace-nowrap"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
                <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
                <div className="flex flex-row gap-2">
                  {pin.pinImages.map((src, imgIndex) => (
                    <img
                      key={imgIndex}
                      src={src}
                      alt={`${place.placeName} 이미지 ${imgIndex + 1}`}
                      className="border-iceblue-4 h-[80px] w-[80px] flex-shrink-0 rounded-lg border-2 object-cover"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* --- 리뷰 섹션 --- */}
            <div className="flex flex-col gap-[20px]">
              {pin.pinPositive && <ReviewSection title="좋았던 점" content={pin.pinPositive} />}
              {pin.pinNegative && <ReviewSection title="아쉬웠던 점" content={pin.pinNegative} />}
            </div>

            {/* 마지막 pin이 아니면 구분선 추가 */}
            {index < pins.length - 1 && <div className="border-t border-gray-200 pt-6"></div>}
          </div>
        );
      })}

      {/* 댓글 섹션 (마지막에 한 번만 표시) */}
      <div className="mt-6 border-t border-gray-200 pt-6">
        {/* 댓글 헤더 */}
        <h3 className="text-lg font-semibold text-gray-900">댓글 {commentData?.data?.count || 0}개</h3>

        {/* 댓글 입력창 */}
        <div className="mt-4">
          <div className="bg-iceblue-2 relative flex items-center rounded-lg p-4">
            <input
              type="text"
              placeholder="아카이빙에서 댓글을 달 수 있어요"
              readOnly
              className="text-iceblue-8 placeholder-iceblue-7 text-b4 flex-1 bg-transparent focus:outline-none"
            />
            <button
              type="button"
              onClick={handleNavigateToArchive}
              className="text-d1 text-neutral-8 hover:text-neutral-10 underline"
            >
              바로가기
            </button>
          </div>
        </div>

        {/* 댓글 목록 */}
        {isCommentLoading ? (
          <div className="mt-6 flex items-center justify-center p-4">
            <span className="text-iceblue-8">댓글을 불러오는 중...</span>
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-4">
            {commentData?.data?.comments && commentData.data.comments.length > 0 ? (
              commentData.data.comments.map(comment => (
                <div key={comment.commentId} className="flex flex-row items-start gap-3">
                  <img
                    src={comment.profileImage || '/dummy_profile.png'}
                    alt={`${comment.nickName} profile`}
                    className="h-8 w-8 flex-shrink-0 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-800">{comment.nickName}</span>
                    <p className="text-base text-gray-700">{comment.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center p-4">
                <span className="text-iceblue-8">댓글이 없습니다.</span>
              </div>
            )}
          </div>
        )}
      </div>

      <CoupleComment />
    </div>
  );
};

export default DetailSection;
