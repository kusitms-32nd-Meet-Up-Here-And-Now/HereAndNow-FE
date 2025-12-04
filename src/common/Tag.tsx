interface TagProps {
  text: string;
  bgColor?: string;
  textColor?: string;
}

const Tag = ({ text, bgColor, textColor }: TagProps) => {
  return <span className={`${bgColor} ${textColor} text-d3 rounded-lg px-2 py-1`}>{text}</span>;
};

export default Tag;
