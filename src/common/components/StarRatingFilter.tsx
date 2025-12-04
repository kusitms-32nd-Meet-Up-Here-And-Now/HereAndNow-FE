import FilterStar from '@pages/archive/components/FilterStar';

interface StarRatingFilterProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  title: string;
}

const StarRatingFilter = ({ rating, onRatingChange, title }: StarRatingFilterProps) => {
  const handleStarClick = (starIndex: number) => {
    // 같은 별을 다시 클릭하면 0으로 리셋, 아니면 해당 별점으로 설정
    onRatingChange(starIndex === rating ? 0 : starIndex);
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-d1 text-iceblue-8">{title}</span>

      {/* 별 */}
      <div className="flex items-center gap-1">
        <div className="flex w-full items-center justify-center">
          {[1, 2, 3, 4, 5].map(starIndex => (
            <button
              key={starIndex}
              type="button"
              onClick={() => handleStarClick(starIndex)}
              className="flex h-10 w-10 cursor-pointer items-center justify-center"
              aria-label={`${starIndex}점`}
            >
              <FilterStar filled={starIndex <= rating} />
            </button>
          ))}
        </div>
      </div>

      {/* 점수 */}
      <span className="text-s2 text-iceblue-8 text-center">{rating}/5점</span>

      {/* 점수 설명 */}
      <span className="text-b4 text-iceblue-8 text-center">완전 추천해요!</span>
    </div>
  );
};

export default StarRatingFilter;
