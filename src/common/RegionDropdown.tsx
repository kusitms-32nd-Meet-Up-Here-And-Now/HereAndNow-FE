import { useState, useRef, useEffect } from 'react';
import { REGION_GROUPS } from '../utils/stationMapping';
import DownArrowIcon from '@assets/icons/bxs_down-arrow.svg';

interface RegionDropdownProps {
  selectedRegion?: string;
  onSelect?: (region: string) => void;
  className?: string;
}

const RegionDropdown = ({ selectedRegion, onSelect, className }: RegionDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (region: string) => {
    if (onSelect) {
      onSelect(region);
    }
    setIsOpen(false);
  };

  const displayValue = selectedRegion || '지역을 선택하세요';

  return (
    <div
      ref={dropdownRef}
      className={`relative w-full rounded-[16px] bg-white shadow-[0px_12px_30px_rgba(0,0,0,0.08)] ${className || ''}`}
    >
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className={`bg-iceblue-2 flex h-12 w-full items-center justify-between px-5 py-3 transition-colors ${
          isOpen ? 'rounded-t-[16px]' : 'rounded-[16px]'
        }`}
      >
        <span className="text-b4 text-iceblue-9">{displayValue}</span>
        <img
          src={DownArrowIcon}
          alt="드롭다운"
          className={`h-[12px] w-[12px] opacity-50 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 left-0 z-10 rounded-b-[16px] bg-white shadow-[0px_12px_30px_rgba(0,0,0,0.08)]">
          <div className="max-h-[140px] overflow-y-auto">
            {REGION_GROUPS.map((region, index) => (
              <div key={region}>
                {index > 0 && <div className="bg-iceblue-2 h-px" />}
                <button
                  type="button"
                  onClick={() => handleSelect(region)}
                  className={`text-b4 w-full px-5 py-3 text-left transition-colors ${
                    selectedRegion === region ? 'bg-iceblue-1 text-iceblue-9' : 'text-iceblue-7 hover:bg-iceblue-2'
                  }`}
                >
                  {region}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RegionDropdown;
