import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlarmModal, dummyAlarms } from '@common/alarm';
import Modal from '@common/components/Modal';
import useGetMemberInfo from '@apis/member/useGetMemberInfo';

const Mypage = () => {
  const navigate = useNavigate();
  const [isAlarmOpen, setIsAlarmOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const { data: memberInfo } = useGetMemberInfo();

  console.log('[Mypage] memberInfo:', memberInfo);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  const handleMenuClick = (menu: string) => {
    switch (menu) {
      case '알림':
        setIsAlarmOpen(true);
        break;
      case '설정':
        // 설정 페이지로 이동 (추후 구현)
        navigate('/setting');
        break;
      case '서비스 약관':
        // 서비스 약관 페이지로 이동 (추후 구현)
        break;
      case '개인정보 처리방침':
        // 개인정보 처리방침 페이지로 이동 (추후 구현)
        break;
      case '로그아웃':
        setIsLogoutModalOpen(true);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div className="flex w-full flex-col gap-[24px] pb-24">
        {/* 프로필 섹션 */}
        <div className="flex items-center gap-4 px-5">
          <div className="h-20 w-20 overflow-hidden rounded-full">
            <img
              src={memberInfo?.data?.profileImageUrl || '/dummy_profile.png'}
              alt="프로필"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-s1 text-neutral-8">
              {memberInfo?.data?.nickname ? `${memberInfo.data.nickname} 님` : '사용자 님'}
            </span>
            <span className="text-b5 text-pink-6">
              {memberInfo?.data?.username ? `@${memberInfo.data.username}` : '@username'}
            </span>
          </div>
        </div>

        {/* 메뉴 리스트 */}
        <div className="flex flex-col px-5 pt-[60px]">
          <button
            type="button"
            onClick={() => handleMenuClick('알림')}
            className="text-h5 text-neutral-8 py-4 text-left"
          >
            알림
          </button>
          <button
            type="button"
            onClick={() => handleMenuClick('설정')}
            className="text-h5 text-neutral-8 py-4 text-left"
          >
            설정
          </button>
          <button
            type="button"
            onClick={() => handleMenuClick('서비스 약관')}
            className="text-h5 text-neutral-8 py-4 text-left"
          >
            서비스 약관
          </button>
          <button
            type="button"
            onClick={() => handleMenuClick('개인정보 처리방침')}
            className="text-h5 text-neutral-8 py-4 text-left"
          >
            개인정보 처리방침
          </button>
        </div>

        {/* 로그아웃 */}
        <div className="px-5 pt-40">
          <button
            type="button"
            onClick={() => handleMenuClick('로그아웃')}
            className="text-s6 text-iceblue-8 py-4 text-left"
          >
            로그아웃
          </button>
        </div>
      </div>
      <AlarmModal isOpen={isAlarmOpen} onClose={() => setIsAlarmOpen(false)} alarms={dummyAlarms} />
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        mainMessage="로그아웃 하시겠어요?"
        leftButtonText="아니요"
        leftButtonOnClick={() => setIsLogoutModalOpen(false)}
        rightButtonText="네"
        rightButtonOnClick={handleLogout}
      />
    </>
  );
};

export default Mypage;
