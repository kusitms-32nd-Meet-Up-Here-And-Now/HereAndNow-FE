interface ConnectingCardProps {
  date: string;
  placeCount: number;
  title: string;
  description: string;
  backgroundImage?: string;
  backgroundClassName?: string;
  isBlurred?: boolean; // 블러 처리 여부
  onClick?: () => void; // 클릭 핸들러
}

const ConnectingCard = ({
  date,
  placeCount,
  title,
  description,
  backgroundImage,
  backgroundClassName,
  isBlurred = false,
  onClick,
}: ConnectingCardProps) => {
  return (
    <div
      className={`relative h-full w-full overflow-hidden ${isBlurred ? 'blur-[8px]' : ''} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {/* 배경 이미지 - 사용자가 조절 */}
      {backgroundImage ? (
        <div className="absolute inset-0">
          <img src={backgroundImage} alt={title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/20" />
        </div>
      ) : (
        <div className={`absolute inset-0 ${backgroundClassName || 'bg-gradient-to-br from-blue-400 to-purple-500'}`} />
      )}

      {/* 상단 왼쪽 - 날짜 */}
      <div className="absolute top-6 left-6 z-10">
        <span className="text-s2 font-medium text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">{date}</span>
      </div>

      {/* 상단 오른쪽 - 장소 수 */}
      <div className="absolute top-6 right-6 z-10">
        <span className="text-s2 font-medium text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
          장소 {placeCount}곳
        </span>
      </div>

      {/* 하단 중앙 - 제목과 설명 */}
      <div className="absolute right-6 bottom-6 left-6 z-10 flex flex-col items-center gap-2.5">
        <h3 className="text-h5 text-center font-medium text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">{title}</h3>
        <p className="text-b4 line-clamp-2 max-w-full text-center text-white/95 drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
          {description}
        </p>
      </div>
    </div>
  );
};

export default ConnectingCard;
