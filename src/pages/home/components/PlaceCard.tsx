import Star from './Star';
import placeSaveIcon from '@assets/icons/place_not_save.svg';

interface PlaceCardProps {
  imageUrl?: string;
  name: string;
  category: string;
  address: string;
  addressDetail?: string;
  rating: number;
  reviewCount: number;
  hasSaveButton?: boolean;
  onSaveButtonClick?: (e: React.MouseEvent) => void;
  onClick?: () => void;
}

const PlaceCard = ({
  imageUrl,
  name,
  category,
  address,
  addressDetail,
  rating,
  reviewCount,
  hasSaveButton = false,
  onSaveButtonClick,
  onClick,
}: PlaceCardProps) => {
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

      stars.push(<Star key={i} fillPercentage={fillPercentage} starId={i} />);
    }

    return stars;
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSaveButtonClick?.(e);
  };

  return (
    <div className="flex w-full flex-col gap-1 overflow-hidden rounded-lg bg-white p-2.5 shadow-sm">
      <div className={`flex w-full bg-transparent ${onClick ? 'cursor-pointer' : ''}`} onClick={onClick}>
        <div className="flex min-w-0 flex-1 flex-col justify-between p-2">
          <div className="flex min-w-0 flex-col gap-1.5">
            <div className="flex min-w-0 items-center gap-2 overflow-hidden">
              <h3 className="text-b3 text-neutral-8 min-w-0 flex-1 truncate">{name}</h3>
              <span className="text-d3 text-neutral-5 flex-shrink-0 whitespace-nowrap">{category}</span>
            </div>

            <div className="flex flex-col gap-0.5">
              <p className="text-d1 text-neutral-5 line-clamp-1 truncate overflow-hidden break-all text-ellipsis whitespace-nowrap">
                {address}
              </p>
              {addressDetail && (
                <p className="text-d1 text-neutral-4 line-clamp-1 truncate overflow-hidden break-all text-ellipsis whitespace-nowrap">
                  {addressDetail}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-b5 text-yellow-5">{rating}</span>
            <div className="flex items-center gap-0.5">{renderStars(rating)}</div>
            <span className="text-b5 text-neutral-5">리뷰 {reviewCount}건</span>
          </div>
        </div>
      </div>

      {hasSaveButton && (
        <div className="flex w-full justify-end pb-4">
          <button
            onClick={handleSaveClick}
            className="bg-pink-2 text-pink-7 hover:bg-pink-3 flex h-10 w-[98px] items-center justify-center gap-[6.4px] rounded-lg transition-colors"
          >
            <img src={placeSaveIcon} alt="저장" className="h-5 w-5" />
            <span className="text-s5">저장</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default PlaceCard;
