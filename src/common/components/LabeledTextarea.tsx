import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';

interface LabeledTextareaProps {
  label: string;
  placeholder?: string;
  maxLength?: number;
  required?: boolean;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const LabeledTextarea = ({
  label,
  placeholder = '자유롭게 작성해주세요',
  maxLength = 100,
  required,
  defaultValue = '',
  value: controlledValue,
  onChange,
}: LabeledTextareaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = isControlled ? controlledValue : internalValue;
  const [charCount, setCharCount] = useState(isControlled ? controlledValue?.length || 0 : defaultValue.length);
  const MIN_HEIGHT = 24;
  const MAX_HEIGHT = 200;

  const updateTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = `${MIN_HEIGHT}px`;
    const nextHeight = Math.min(textarea.scrollHeight, MAX_HEIGHT);
    textarea.style.height = `${nextHeight}px`;
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const nextValue = event.target.value.slice(0, maxLength);
    if (!isControlled) {
      setInternalValue(nextValue);
    }
    setCharCount(nextValue.length);
    onChange?.(nextValue);
  };

  useEffect(() => {
    if (isControlled && controlledValue !== undefined) {
      setCharCount(controlledValue.length);
    }
  }, [controlledValue, isControlled]);

  useEffect(() => {
    updateTextareaHeight();
  }, [value]);

  useEffect(() => {
    updateTextareaHeight();
  }, []);

  const handleInput = () => {
    updateTextareaHeight();
  };

  return (
    <div className="flex flex-col gap-[8px]">
      <label className="text-d1 text-iceblue-8">
        {label}
        {required && <span className="text-red-6 ml-1">•</span>}
      </label>
      <div className="border-iceblue-3/60 rounded-[18px] border bg-white px-[20px] py-3">
        <textarea
          ref={textareaRef}
          value={value}
          rows={1}
          onChange={handleChange}
          onInput={handleInput}
          placeholder={placeholder}
          maxLength={maxLength}
          className="text-b3 text-iceblue-8 placeholder:text-iceblue-6 w-full resize-none bg-transparent p-0 leading-[24px] outline-none"
          style={{ minHeight: MIN_HEIGHT, maxHeight: MAX_HEIGHT }}
        />
      </div>
      <div className="text-b4 text-iceblue-6 text-right">
        {charCount}/{maxLength}
      </div>
    </div>
  );
};

export default LabeledTextarea;
