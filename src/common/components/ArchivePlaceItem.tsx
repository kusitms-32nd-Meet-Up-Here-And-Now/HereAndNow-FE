import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Star from '@pages/home/components/Star';
import moreArrowIcon from '@assets/icons/more_arrow.svg';
import usePostPlaceScrap from '@apis/place/mutation/usePostPlaceScrap';
import placeSaveIcon from '@assets/icons/place_not_save.svg';

interface ArchivePlaceItemProps {
  title: number;
  thumbnail: string;
  placeName: string;
  category: string;
  roadAddress: string;
  jibunAddress?: string;
  rating: number;
  reviewCount: number;
  photos: string[];
  goodPoints?: string;
  badPoints?: string;
  placeId?: number;
  scrapped?: boolean;
  onDetailClick?: () => void;
  onScrapChange?: (placeId: number, newScrapStatus: boolean) => void;
}

const ArchivePlaceItem = ({
  title,
  thumbnail,
  placeName,
  category,
  roadAddress,
  jibunAddress,
  rating,
  reviewCount,
  photos,
  goodPoints,
  badPoints,
  placeId,
  scrapped = false,
  onDetailClick,
  onScrapChange,
}: ArchivePlaceItemProps) => {
  const navigate = useNavigate();
  const [isScrapped, setIsScrapped] = useState(scrapped);
  const { mutate: postPlaceScrap, isPending } = usePostPlaceScrap();

  const handleScrapClick = () => {
    if (!placeId || isPending) return;

    // 낙관적 업데이트
    const previousScrapStatus = isScrapped;
    setIsScrapped(!isScrapped);

    postPlaceScrap(placeId, {
      onSuccess: response => {
        const newScrapStatus = !response.data.deleted;
        setIsScrapped(newScrapStatus);
        onScrapChange?.(placeId, newScrapStatus);

        // 스크랩 성공 시 저장 페이지로 이동 (장소 탭)
        if (newScrapStatus) {
          navigate('/archive/save', { state: { activeTab: 'place' } });
        }
      },
      onError: error => {
        // 실패 시 롤백
        setIsScrapped(previousScrapStatus);
        console.error('[장소 스크랩] 실패:', error);
      },
    });
  };

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

  return (
    <div className="flex w-full flex-col gap-3">
      {/* 타이틀 */}
      <div className="flex items-start gap-1">
        <div className="bg-pink-6 text-d2 flex h-[19px] w-[19px] items-center justify-center rounded-full text-white">
          {title}
        </div>

        <span className="text-d1 text-iceblue-8">{placeName}</span>
      </div>

      {/* 정보 */}
      <div className="flex w-full items-start gap-3">
        {/* 썸네일 */}
        <div className="border-iceblue-4 flex h-[173px] min-h-[173px] w-[173px] min-w-[173px] flex-shrink-0 items-center justify-center overflow-hidden rounded-[8px] border-2">
          <img src={thumbnail} alt="썸네일" className="h-full w-full object-cover" />
        </div>

        {/* 설명 */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* 장소명 */}
          <span className="text-b3 text-neutral-8 line-clamp-1">{placeName}</span>

          {/* 장소 카테고리 */}
          <span className="text-d2 text-neutral-5 mt-1 line-clamp-1">{category}</span>

          {/* 장소 주소 */}
          <div className="mt-3 flex flex-col gap-0.5">
            <span className="text-d1 text-neutral-5 line-clamp-1">{roadAddress}</span>
            {jibunAddress && <span className="text-d1 text-neutral-5 line-clamp-1">(지번) {jibunAddress}</span>}
          </div>

          {/* 별점 */}
          <div className="mt-3 flex h-[22px] items-center gap-1">
            <span className="text-b5 text-yellow-5 whitespace-nowrap">{rating}</span>
            <div className="flex flex-shrink-0 items-center">{renderStars(rating)}</div>
            <div className="bg-neutral-3 h-2 w-[0.75px] flex-shrink-0 rounded-full"></div>
            <span className="text-b5 text-neutral-5 whitespace-nowrap">리뷰 {reviewCount}건</span>
          </div>

          {/* 버튼 */}
          <div className="mt-3 flex gap-2.5">
            {/* 자세히 버튼 */}
            <button
              className="bg-iceblue-2 flex h-12 min-h-12 flex-shrink-0 cursor-pointer items-center justify-between rounded-[8px] px-4"
              onClick={onDetailClick}
            >
              <span className="text-b4 text-iceblue-8 whitespace-nowrap">자세히</span>
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center">
                <img src={moreArrowIcon} alt="자세히" className="h-6 w-6" />
              </div>
            </button>

            {/* 스크랩 버튼 */}
            <button
              className="border-iceblue-2 flex h-12 w-12 flex-shrink-0 cursor-pointer items-center justify-center rounded-[4px] border bg-transparent disabled:cursor-not-allowed disabled:opacity-50"
              onClick={handleScrapClick}
              disabled={!placeId}
            >
              <img src={placeSaveIcon} alt="스크랩" className="h-8 w-8" />
            </button>
          </div>
        </div>
      </div>

      {/* 사진 리스트 */}
      <div className="flex gap-2 overflow-x-scroll [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {photos.map((photo, index) => (
          <div
            key={index}
            className="border-iceblue-4 flex h-20 min-h-20 w-20 min-w-20 items-center justify-center overflow-hidden rounded-[8px] border"
          >
            <img src={photo} alt="사진" className="h-full w-full object-cover" />
          </div>
        ))}
      </div>

      {/* 좋았던 점 / 아쉬웠던 점 */}
      <div className="flex w-full flex-col gap-5 pt-2">
        {/* 좋았던 점 */}
        {goodPoints && (
          <div className="flex w-full flex-col gap-2">
            <span className="text-d1 text-iceblue-8">좋았던 점</span>
            <div className="border-iceblue-2 h-fit w-full rounded-[8px] border px-5 py-3">
              <span className="text-b4 text-iceblue-8">{goodPoints}</span>
            </div>
          </div>
        )}

        {/* 아쉬웠던 점 */}
        {badPoints && (
          <div className="flex w-full flex-col gap-2">
            <span className="text-d1 text-iceblue-8">아쉬웠던 점</span>
            <div className="border-iceblue-2 h-fit w-full rounded-[8px] border px-5 py-3">
              <span className="text-b4 text-iceblue-8">{badPoints}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchivePlaceItem;
