import LocationIcon from '@assets/icons/pinpoint.svg';
import MapIcon from '@assets/icons/map.svg';
import placeSaveIcon from '@assets/icons/place_not_save.svg';
import Tag from '@common/Tag';
import CircularImagePoints from '@common/Ccw';

interface CourseCardProps {
  courseId: number;
  profileImageUrl: string;
  authorName: string;
  title: string;
  location: string;
  placeCount: number;
  tags: string[];
  courseImages?: string[];
  onClick?: () => void;
  onSaveClick?: (e: React.MouseEvent) => void;
}

const CourseCard = ({
  courseId,
  profileImageUrl,
  authorName,
  title,
  location,
  placeCount,
  tags,
  courseImages,
  onClick,
  onSaveClick,
}: CourseCardProps) => {
  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSaveClick?.(e);
  };

  return (
    <div className="flex w-full flex-col rounded-lg bg-white px-2.5 pt-2.5 pb-4 shadow-sm">
      <div className="flex w-full flex-col gap-3">
        {/* 코스 정보 */}
        <div className="flex w-full gap-2" onClick={onClick}>
          <div className="flex flex-1 flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <img src={profileImageUrl} alt={authorName} className="h-[20px] w-[20px] rounded-full object-cover" />
              <span className="text-d1 text-neutral-5">{authorName}</span>
            </div>

            <h3 className="text-s4 text-neutral-8">{title}</h3>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <img src={LocationIcon} alt="위치" className="h-4 w-4" />
                <span className="text-d2 text-neutral-5">{location}</span>
              </div>

              <div className="bg-neutral-5 h-3 w-px" />

              <div className="flex items-center gap-1.5">
                <img src={MapIcon} alt="장소" className="h-4 w-4" />
                <span className="text-d2 text-neutral-5">장소 {placeCount}개</span>
              </div>
            </div>

            <div className="flex flex-row flex-wrap gap-1.5">
              {tags.map((tag, index) => {
                const tagColors = [
                  { bgColor: 'bg-orange-2', textColor: 'text-orange-8' },
                  { bgColor: 'bg-purple-1', textColor: 'text-purple-8' },
                ];
                const color = tagColors[index % tagColors.length];

                return <Tag key={index} text={tag} bgColor={color.bgColor} textColor={color.textColor} />;
              })}
            </div>
          </div>

          <div className="bg-iceblue-3 relative h-[128px] w-[128px] flex-shrink-0 overflow-hidden rounded-lg">
            <CircularImagePoints pointCount={placeCount} pointImages={courseImages} className="h-full w-full" />
          </div>
        </div>

        {/* 저장 버튼 */}
        {onSaveClick && (
          <div className="flex w-full justify-end">
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
    </div>
  );
};

export default CourseCard;
