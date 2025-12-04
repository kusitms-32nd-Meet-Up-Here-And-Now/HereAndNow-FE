import { useState } from 'react';
import XCircleIcon from '@assets/icons/bxs_x-circle.svg';
import PlusIcon from '@assets/icons/plus.svg';

interface TagSelectorProps {
  placeholder?: string;
  selectedTags?: string[];
  options: string[];
  maxSelected?: number;
  onChange?: (tags: string[]) => void;
  selectedOptionClassName?: string;
  optionContainerBgClassName?: string;
  defaultExpanded?: boolean;
}

const TagSelector = ({
  placeholder = '원하는 태그를 선택해보세요',
  selectedTags: externalSelectedTags,
  options,
  maxSelected,
  onChange,
  selectedOptionClassName = 'bg-purple-6 text-white',
  optionContainerBgClassName = 'bg-purple-1',
  defaultExpanded = true,
}: TagSelectorProps) => {
  const [internalSelectedTags, setInternalSelectedTags] = useState<string[]>([]);
  const [isOptionsOpen, setIsOptionsOpen] = useState(defaultExpanded);

  // 제어 컴포넌트인지 비제어 컴포넌트인지 결정
  const isControlled = externalSelectedTags !== undefined;
  const selectedTags = isControlled ? externalSelectedTags : internalSelectedTags;

  const handleTagToggle = (tag: string) => {
    const alreadySelected = selectedTags.includes(tag);
    let updated: string[];

    if (alreadySelected) {
      updated = selectedTags.filter(item => item !== tag);
    } else {
      if (maxSelected && selectedTags.length >= maxSelected) return;
      updated = [...selectedTags, tag];
    }

    if (!isControlled) {
      setInternalSelectedTags(updated);
    }
    onChange?.(updated);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updated = selectedTags.filter(tag => tag !== tagToRemove);

    if (!isControlled) {
      setInternalSelectedTags(updated);
    }
    onChange?.(updated);
  };

  const handleToggleOptions = () => {
    setIsOptionsOpen(prev => !prev);
  };

  return (
    <div className="rounded-[16px] bg-white">
      <div
        className={`flex min-h-[52px] items-center justify-between gap-3 bg-white px-4 py-3 ${
          isOptionsOpen ? 'rounded-t-[16px]' : 'rounded-[16px]'
        }`}
      >
        <div className="flex flex-wrap items-center gap-[8px]">
          {selectedTags.length === 0 ? (
            <span className="text-b3 text-iceblue-8">{placeholder}</span>
          ) : (
            selectedTags.map(tag => (
              <div key={tag} className="flex items-center gap-2 rounded-[12px] bg-white px-3 py-2">
                <span className="text-b3 text-iceblue-9 font-medium">{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="bg-iceblue-3/70 hover:bg-iceblue-4 flex h-6 w-6 items-center justify-center rounded-full transition-colors"
                  aria-label={`${tag} 삭제`}
                >
                  <img src={XCircleIcon} alt="" className="h-3.5 w-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
        <button
          type="button"
          onClick={handleToggleOptions}
          aria-expanded={isOptionsOpen}
          className="hover:bg-iceblue-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-white px-[8px] transition-all"
          aria-label="태그 추가"
        >
          <img
            src={PlusIcon}
            alt=""
            className={`h-4 w-4 transition-transform ${isOptionsOpen ? 'rotate-45' : 'rotate-0'}`}
          />
        </button>
      </div>
      {isOptionsOpen && (
        <div className={`border-iceblue-3/40 rounded-b-[16px] border-t px-4 pt-3 pb-4 ${optionContainerBgClassName}`}>
          <div className="flex flex-wrap gap-x-[12px] gap-y-[10px]">
            {options.length === 0 && <span className="text-d1 text-iceblue-8">{placeholder}</span>}
            {options.map(option => {
              const isSelected = selectedTags.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleTagToggle(option)}
                  className={`text-b4 rounded-[4px] px-2 py-1 font-medium transition-colors ${
                    isSelected ? selectedOptionClassName : 'text-iceblue-9 bg-white'
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TagSelector;
