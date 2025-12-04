import { useState, useRef, useEffect } from 'react';
import DownArrowIcon from '@assets/icons/bxs_down-arrow.svg';

type TabType = 'course' | 'place';
type SortType = 'latest' | 'liked' | 'reviewed';

interface TabNavigationProps {
  activeTab?: TabType;
  selectedSort?: SortType;
  onTabChange?: (tab: TabType) => void;
  onSortChange?: (sort: SortType) => void;
}

const TabNavigation = ({
  activeTab = 'course',
  selectedSort = 'latest',
  onTabChange,
  onSortChange,
}: TabNavigationProps) => {
  const [selectedTab, setSelectedTab] = useState<TabType>(activeTab);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleTabClick = (tab: TabType) => {
    setSelectedTab(tab);
    onTabChange?.(tab);
  };

  const handleSortClick = (sort: SortType) => {
    setIsDropdownOpen(false);
    onSortChange?.(sort);
  };

  const sortOptions: { value: SortType; label: string }[] = [
    { value: 'latest', label: '최신 순' },
    { value: 'liked', label: '저장 많은 순' },
    { value: 'reviewed', label: '리뷰 많은 순' },
  ];

  useEffect(() => {
    setSelectedTab(activeTab);
  }, [activeTab]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const isCourse = selectedTab === 'course';
  const isPlace = selectedTab === 'place';

  return (
    <div className="flex h-12 w-full items-center justify-between">
      <div className="flex h-full items-center">
        <button
          onClick={() => handleTabClick('course')}
          className={`relative flex h-full w-[72px] cursor-pointer items-center justify-center transition-colors ${isCourse ? 'text-s1 text-neutral-8' : 'text-s2 text-neutral-6'} ${
            isCourse
              ? "after:bg-pink-6 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:content-['']"
              : "after:bg-pink-6 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:opacity-0 after:content-['']"
          } `}
        >
          코스
        </button>

        <button
          onClick={() => handleTabClick('place')}
          className={`relative flex h-full w-[72px] cursor-pointer items-center justify-center transition-colors ${isPlace ? 'text-s1 text-neutral-8' : 'text-s2 text-neutral-6'} ${
            isPlace
              ? "after:bg-pink-6 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:content-['']"
              : "after:bg-pink-6 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:opacity-0 after:content-['']"
          } `}
        >
          장소
        </button>
      </div>

      <div className="relative flex h-full cursor-pointer items-center" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex h-full cursor-pointer items-center gap-1 pr-2 pl-[2px] transition-colors"
        >
          <span className="text-d1 text-neutral-5">{sortOptions.find(opt => opt.value === selectedSort)?.label}</span>
          <img
            src={DownArrowIcon}
            alt="정렬"
            className={`h-[12px] w-[12px] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isDropdownOpen && (
          <div
            className="absolute top-[44px] right-[19px] z-10 w-[107px] overflow-hidden rounded-[4px] bg-white"
            style={{ boxShadow: '0px 4px 10px 0px #0000001A' }}
          >
            {sortOptions.map((option, index) => (
              <div key={option.value} className="flex flex-col items-center">
                {index > 0 && <div className="bg-neutral-2 h-px w-20" />}
                <button
                  onClick={() => handleSortClick(option.value)}
                  className="text-d1 text-neutral-5 flex h-10 w-full cursor-pointer items-center justify-center"
                >
                  {option.label}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TabNavigation;
