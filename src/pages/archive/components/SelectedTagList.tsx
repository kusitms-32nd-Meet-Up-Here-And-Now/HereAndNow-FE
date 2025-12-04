// 태그 색상 매핑 (purple, orange, blue 순환)
const getTagColorClass = (index: number): { bg: string; text: string } => {
  const colors = [
    { bg: 'bg-purple-2', text: 'text-purple-8' },
    { bg: 'bg-orange-2', text: 'text-orange-8' },
    { bg: 'bg-blue-2', text: 'text-blue-8' },
  ];
  return colors[index % colors.length];
};

interface SelectedTagListProps {
  tags: string[];
  onRemove: (tag: string) => void;
}

const SelectedTagList = ({ tags, onRemove }: SelectedTagListProps) => {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex w-full items-center gap-2 overflow-x-visible">
      {tags.map((tag, index) => {
        const colorClass = getTagColorClass(index);
        return (
          <button
            key={index}
            type="button"
            className={`${colorClass.bg} ${colorClass.text} text-d1 flex h-8 items-center justify-center rounded-sm px-2.5 whitespace-nowrap`}
            onClick={() => onRemove(tag)}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
};

export default SelectedTagList;

