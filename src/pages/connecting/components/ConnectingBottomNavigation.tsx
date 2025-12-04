import { useNavigate } from 'react-router-dom';
import HomeIcon from '@assets/icons/home.svg';
import SearchIcon from '@assets/icons/search.svg';

interface ConnectingBottomNavigationProps {
  onHomeClick?: () => void;
}

const ConnectingBottomNavigation = ({ onHomeClick }: ConnectingBottomNavigationProps) => {
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate('/connecting/search');
  };

  const handleInputClick = () => {
    navigate('/connecting/search');
  };

  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 flex justify-center px-5 pb-8">
      <div className="flex h-[48px] w-full max-w-[402px] items-center gap-2">
        {/* 홈 아이콘 */}
        <div className="relative flex h-[48px] w-[48px] flex-shrink-0 items-center justify-center">
          <button
            type="button"
            onClick={onHomeClick}
            className="border-iceblue-3 relative flex h-[48px] w-[48px] items-center justify-center rounded-full border bg-white"
          >
            <img src={HomeIcon} alt="홈" className="h-6 w-6" />
          </button>
        </div>

        {/* 검색 입력 필드 */}
        <div className="border-iceblue-3/60 relative flex h-[48px] min-w-0 flex-1 items-center rounded-[18px] border bg-white px-4">
          <input
            type="text"
            readOnly
            onClick={handleInputClick}
            placeholder="찾고 싶은 추억이 있나요?"
            className="text-b3 placeholder:text-iceblue-6 text-iceblue-8 min-w-0 flex-1 cursor-pointer truncate bg-transparent outline-none"
          />
          <button
            type="button"
            onClick={handleSearch}
            className="ml-2 flex h-6 w-6 flex-shrink-0 items-center justify-center"
            aria-label="검색"
          >
            <img src={SearchIcon} alt="검색" className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectingBottomNavigation;
