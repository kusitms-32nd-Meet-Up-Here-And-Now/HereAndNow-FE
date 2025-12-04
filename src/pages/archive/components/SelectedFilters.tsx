import filterCancelIcon from '@assets/icons/filter_cancel.svg';
import type { SelectedFilters } from '@apis/archive/archive';
import type { ArchiveSearchParams } from '@apis/archive/archive';

interface SelectedFiltersProps {
  selectedFilters: SelectedFilters;
  onRemove: (filterType: keyof ArchiveSearchParams) => void;
  formatDate: (dateString: string) => string;
}

const SelectedFiltersChips = ({ selectedFilters, onRemove, formatDate }: SelectedFiltersProps) => {
  return (
    <div className="flex w-full items-center gap-1 overflow-x-visible">
      {/* 별점 필터 */}
      {selectedFilters.rating !== undefined && selectedFilters.rating > 0 && (
        <div className="border-neutral-3 flex h-9 items-center gap-1 rounded-[50px] border-[0.5px] border-solid bg-white pr-3 pl-1.5 whitespace-nowrap">
          {/* 삭제 버튼 */}
          <button
            type="button"
            className="flex h-6 w-6 items-center justify-center"
            onClick={() => onRemove('rating')}
          >
            <img src={filterCancelIcon} alt="삭제" className="h-6 w-6" />
          </button>

          {/* 필터 이름 */}
          <span className="text-d1 text-neutral-4">별점</span>

          {/* 필터 값 */}
          <span className="text-d1 text-neutral-6">{selectedFilters.rating}점</span>
        </div>
      )}

      {/* 날짜 필터 */}
      {selectedFilters.startDate && (
        <div className="border-neutral-3 flex h-9 items-center gap-1 rounded-[50px] border-[0.5px] border-solid bg-white pr-3 pl-1.5 whitespace-nowrap">
          {/* 삭제 버튼 */}
          <button
            type="button"
            className="flex h-6 w-6 items-center justify-center"
            onClick={() => onRemove('startDate')}
          >
            <img src={filterCancelIcon} alt="삭제" className="h-6 w-6" />
          </button>

          {/* 필터 이름 */}
          <span className="text-d1 text-neutral-4">언제</span>

          {/* 필터 값 */}
          <span className="text-d1 text-neutral-6">
            {selectedFilters.startDate === selectedFilters.endDate
              ? formatDate(selectedFilters.startDate)
              : `${formatDate(selectedFilters.startDate)} ~ ${selectedFilters.endDate ? formatDate(selectedFilters.endDate) : ''}`}
          </span>
        </div>
      )}

      {/* 누구와 필터 */}
      {selectedFilters.with && (
        <div className="border-neutral-3 flex h-9 items-center gap-1 rounded-[50px] border-[0.5px] border-solid bg-white pr-3 pl-1.5 whitespace-nowrap">
          {/* 삭제 버튼 */}
          <button
            type="button"
            className="flex h-6 w-6 items-center justify-center"
            onClick={() => onRemove('with')}
          >
            <img src={filterCancelIcon} alt="삭제" className="h-6 w-6" />
          </button>

          {/* 필터 이름 */}
          <span className="text-d1 text-neutral-4">누구와</span>

          {/* 필터 값 */}
          <span className="text-d1 text-neutral-6">{selectedFilters.with}</span>
        </div>
      )}

      {/* 지역 필터 */}
      {selectedFilters.region && (
        <div className="border-neutral-3 flex h-9 items-center gap-1 rounded-[50px] border-[0.5px] border-solid bg-white pr-3 pl-1.5 whitespace-nowrap">
          {/* 삭제 버튼 */}
          <button
            type="button"
            className="flex h-6 w-6 items-center justify-center"
            onClick={() => onRemove('region')}
          >
            <img src={filterCancelIcon} alt="삭제" className="h-6 w-6" />
          </button>

          {/* 필터 이름 */}
          <span className="text-d1 text-neutral-4">지역</span>

          {/* 필터 값 */}
          <span className="text-d1 text-neutral-6">{selectedFilters.region}</span>
        </div>
      )}

      {/* 키워드 필터 */}
      {selectedFilters.keyword && selectedFilters.keyword.length > 0 && (
        <div className="border-neutral-3 flex h-9 items-center gap-1 rounded-[50px] border-[0.5px] border-solid bg-white pr-3 pl-1.5 whitespace-nowrap">
          {/* 삭제 버튼 */}
          <button
            type="button"
            className="flex h-6 w-6 items-center justify-center"
            onClick={() => onRemove('keyword')}
          >
            <img src={filterCancelIcon} alt="삭제" className="h-6 w-6" />
          </button>

          {/* 필터 이름 */}
          <span className="text-d1 text-neutral-4">키워드</span>

          {/* 필터 값 */}
          <span className="text-d1 text-neutral-6">{selectedFilters.keyword[0]}</span>
        </div>
      )}

      {/* 업종 필터 */}
      {selectedFilters.placeCode && selectedFilters.placeCode.length > 0 && (
        <div className="border-neutral-3 flex h-9 items-center gap-1 rounded-[50px] border-[0.5px] border-solid bg-white pr-3 pl-1.5 whitespace-nowrap">
          {/* 삭제 버튼 */}
          <button
            type="button"
            className="flex h-6 w-6 items-center justify-center"
            onClick={() => onRemove('placeCode')}
          >
            <img src={filterCancelIcon} alt="삭제" className="h-6 w-6" />
          </button>

          {/* 필터 이름 */}
          <span className="text-d1 text-neutral-4">업종</span>

          {/* 필터 값 */}
          <span className="text-d1 text-neutral-6">{selectedFilters.placeCode[0]}</span>
        </div>
      )}
    </div>
  );
};

export default SelectedFiltersChips;

