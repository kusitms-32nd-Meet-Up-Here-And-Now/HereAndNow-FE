import { useState } from 'react';
import AlertIcon from '@assets/icons/alert.svg';
import MypageICon from '@assets/icons/mypage.svg';
import { AlarmModal, dummyAlarms } from '@common/alarm';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [isAlarmOpen, setIsAlarmOpen] = useState(false);
  const navigate = useNavigate();
  const handleAlarmClick = () => {
    setIsAlarmOpen(true);
  };

  const handleMypageNavigation = () => {
    navigate('/mypage');
  };
  const handleHomeNavigation = () => {
    navigate('/');
  };

  return (
    <>
      <header className="p-4">
        <div className="flex items-center justify-between">
          <img src="/LogoIcon.svg" alt="Here&Now 로고" className="h-7 w-auto" onClick={handleHomeNavigation} />

          <div className="flex items-center gap-x-[8px]">
            <button type="button" className="p-2" onClick={handleAlarmClick}>
              <img src={AlertIcon} alt="알림" className="h-[28px] w-[28px]" />
            </button>
            <button type="button" className="p-2" onClick={handleMypageNavigation}>
              <img src={MypageICon} alt="마이페이지" className="h-[28px] w-[28px]" />
            </button>
          </div>
        </div>
      </header>
      <AlarmModal isOpen={isAlarmOpen} onClose={() => setIsAlarmOpen(false)} alarms={dummyAlarms} />
    </>
  );
};

export default Header;
