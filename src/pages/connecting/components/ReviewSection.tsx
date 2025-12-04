interface ReviewSectionProps {
  title: string;
  content: string;
}

const ReviewSection = ({ title, content }: ReviewSectionProps) => {
  return (
    <div>
      <h3 className="text-d1 text-iceblue-8">{title}</h3>
      <div className="mt-2 rounded-lg border border-gray-200 bg-white p-4">
        <p className="text-b4 text-iceblue-8">{content}</p>
      </div>
    </div>
  );
};

export default ReviewSection;
