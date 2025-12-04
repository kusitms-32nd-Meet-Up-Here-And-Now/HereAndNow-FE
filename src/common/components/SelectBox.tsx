import { useState, useRef, useEffect } from 'react';
import DropdownArrowIcon from '@assets/icons/bottom-arrow.svg';

// props 타입 정의:
// 네이티브 select 속성 대신 value와 onChange를 명시적으로 받습니다.
interface SelectBoxProps {
  options: Array<{ label: string; value: string | number }>;
  value?: string | number;
  onChange?: (value: string | number) => void;
  placeholder?: string;
  className?: string;
}

const SelectBox = ({
  options,
  value,
  onChange,
  placeholder = '선택하세요', // placeholder 추가
  className = '',
}: SelectBoxProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // 1. useRef 생성: 드롭다운의 최상위 DOM을 참조하기 위함
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 2. useEffect와 useRef를 사용해 외부 클릭 감지
  useEffect(() => {
    // 문서 전체에 mousedown 이벤트 리스너 추가
    const handleClickOutside = (event: MouseEvent) => {
      // dropdownRef.current (최상위 div)가 존재하고,
      // 클릭된 대상(event.target)이 최상위 div 내부에 포함되지 않는다면
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false); // 드롭다운을 닫습니다.
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []); // 빈 의존성 배열로 마운트 시 한 번만 실행

  // 현재 선택된 값의 라벨을 찾습니다.
  const selectedLabel = options.find(option => option.value === value)?.label || placeholder;

  // 옵션 클릭 시 처리
  const handleOptionClick = (optionValue: string | number) => {
    onChange?.(optionValue); // 부모 컴포넌트로 값 변경 알림
    setIsOpen(false); // 드롭다운 닫기
  };

  return (
    // 3. 생성한 ref를 최상위 div에 연결
    <div ref={dropdownRef} className={`relative w-full ${className}`}>
      {/* 네이티브 select 대신 button 사용 */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`text-b4 text-iceblue-9 bg-iceblue-2 h-[48px] w-full appearance-none rounded-[8px] px-5 pr-12 text-left shadow-inner transition outline-none`}
      >
        <span className={value === undefined ? 'text-iceblue-7' : 'text-iceblue-9'}>{selectedLabel}</span>
      </button>

      {/* 화살표 아이콘 (열렸을 때 회전) */}
      <img
        src={DropdownArrowIcon}
        alt="드롭다운 열기"
        className={`pointer-events-none absolute top-1/2 right-5 h-4 w-4 -translate-y-1/2 transition-transform select-none ${
          isOpen ? 'rotate-180' : ''
        }`}
      />

      {/* 옵션 목록 (ul 사용) */}
      {isOpen && (
        <ul className="border-iceblue-2 absolute top-full z-10 mt-2 max-h-60 w-full overflow-y-auto rounded-[20px] border bg-white py-2 shadow-lg">
          {options.map(option => (
            <li
              key={option.value}
              onClick={() => handleOptionClick(option.value)}
              className={`text-b4 cursor-pointer px-5 py-3 transition-colors ${
                option.value === value
                  ? 'bg-iceblue-1 text-iceblue-9 font-semibold' // 선택된 항목 스타일
                  : 'text-iceblue-9 hover:bg-iceblue-2' // 기본 항목 스타일
              }`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SelectBox;
