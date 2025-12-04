import backIcon from '@assets/icons/back.svg';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
}

const PageHeader = (props: PageHeaderProps) => {
  const { title } = props;
  const navigate = useNavigate();

  // 뒤로가기 버튼 클릭 핸들러
  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="relative flex items-center p-5">
      <button
        type="button"
        className="flex h-6 w-6 cursor-pointer items-center justify-center"
        onClick={handleBackClick}
      >
        <img src={backIcon} alt="뒤로가기" className="h-6 w-6" />
      </button>
      <span className="text-s1 text-neutral-8 absolute left-1/2 -translate-x-1/2">{title}</span>
    </div>
  );
};

export default PageHeader;
