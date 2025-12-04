import { useState, useRef, useEffect } from 'react';
import DownArrowIcon from '@assets/icons/bxs_down-arrow.svg';

type TabType = 'course' | 'place';
type SortType = 'latest' | 'name' | 'date';

interface TabProps {
  activeTab: TabType;
  selectedSort: SortType;
  onTabChange: (tab: TabType) => void;
  onSortChange: (sort: SortType) => void;
  sortOptions: { value: SortType; label: string }[];
}

const Tab = ({ activeTab, selectedSort, onTabChange, onSortChange, sortOptions }: TabProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSortClick = (sort: SortType) => {
    setIsDropdownOpen(false);
    onSortChange(sort);
  };

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

  const isCourse = activeTab === 'course';
  const isPlace = activeTab === 'place';

  return (
    <div className="mb-4 flex w-full items-center justify-between">
      <div className="flex items-center">
        <button
          onClick={() => onTabChange('course')}
          className={`relative p-[10px] transition-colors ${isCourse ? 'text-s1 text-neutral-8' : 'text-s2 text-neutral-6'}`}
        >
          코스
          {isCourse && <span className="bg-pink-6 absolute right-0 bottom-[-8px] left-0 h-[3px]" />}
        </button>

        <button
          onClick={() => onTabChange('place')}
          className={`relative p-[10px] transition-colors ${isPlace ? 'text-s1 text-neutral-8' : 'text-s2 text-neutral-6'}`}
        >
          장소
          {isPlace && <span className="bg-pink-6 absolute right-0 bottom-[-8px] left-0 h-[3px]" />}
        </button>
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="text-d1 text-neutral-6 flex items-center gap-1 pr-[20px] transition-colors"
        >
          <span>{sortOptions.find(opt => opt.value === selectedSort)?.label}</span>
          <img
            src={DownArrowIcon}
            alt="정렬"
            className={`h-[12px] w-[12px] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isDropdownOpen && (
          <div className="border-neutral-4 absolute top-full right-0 z-10 mt-2 w-[140px] overflow-hidden rounded-lg border bg-white shadow-lg">
            {sortOptions.map((option, index) => (
              <div key={option.value}>
                {index > 0 && <div className="bg-neutral-4 h-px" />}
                <button
                  onClick={() => handleSortClick(option.value)}
                  className="text-d1 text-neutral-6 hover:bg-neutral-2 w-full px-4 py-3 text-left transition-colors"
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

export default Tab;
