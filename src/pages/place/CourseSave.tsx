import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RegionDropdown from '@common/RegionDropdown';
import BottomActionButton from '@common/button/BottomActionButton';
import Modal from '@common/components/Modal';
import CoupleInviteBottomSheet from '@pages/place/components/CoupleInviteBottomSheet';
import { useCourseSaveStore } from '@stores/course-save';
import useGetMemberInfo from '@apis/member/useGetMemberInfo';

type CompanionType = '연인' | '친구' | '혼자' | '가족' | '지인';

const CourseSave = () => {
  const navigate = useNavigate();
  const { courseData, updateCourseData } = useCourseSaveStore();
  const [isFormValid, setIsFormValid] = useState(false);
  const [isCoupleModalOpen, setIsCoupleModalOpen] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isInviteCompleteModalOpen, setIsInviteCompleteModalOpen] = useState(false);

  // 멤버 정보 조회 (연인 연결 상태 확인용)
  const { data: memberInfo } = useGetMemberInfo();
  const isCouple = memberInfo?.data?.isCouple ?? false;

  const companionOptions: CompanionType[] = ['연인', '친구', '혼자', '가족', '지인'];

  // 스토어에서 값 가져오기
  const selectedDate = courseData?.courseVisitDate || '';
  const selectedCompanion = (courseData?.courseWith as CompanionType) || '연인';
  const selectedRegion = courseData?.courseRegion || '';

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateCourseData({ courseVisitDate: e.target.value });
  };

  const handleRegionSelect = (region: string) => {
    updateCourseData({ courseRegion: region });
  };

  const handleCompanionClick = (option: CompanionType) => {
    updateCourseData({ courseWith: option });
    // 연인 버튼을 클릭했을 때, 연인과 연결되어 있지 않은 경우에만 모달 표시
    if (option === '연인' && !isCouple) {
      setIsCoupleModalOpen(true);
    }
  };

  // 폼 유효성 검사
  useEffect(() => {
    const isValid = selectedDate !== '' && selectedCompanion !== null && selectedRegion !== '';
    setIsFormValid(isValid);
  }, [selectedDate, selectedCompanion, selectedRegion]);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-[32px] pt-[32px] pb-[32px]">
        {/* 날짜 입력 섹션 */}

        <div className="flex flex-col gap-2">
          <h1 className="text-h4 pb-[32px] text-black">
            <span>
              저장하려는 코스에 대해 <br />
            </span>
            <span>알려주세요.</span>
          </h1>
          <label htmlFor="visit-date" className="text-d1 text-iceblue-8">
            언제 다녀오셨나요?
            <span className="text-red-6 ml-1">•</span>
          </label>
          <input
            id="visit-date"
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="border-neutral-4 text-d1 text-neutral-8 focus:border-pink-6 w-full rounded-lg border bg-white px-4 py-3 outline-none"
          />
        </div>

        {/* 동행 선택 섹션 */}
        <div className="flex flex-col gap-[8px]">
          <label className="text-d1 text-iceblue-8">
            누구와 함께하셨나요?
            <span className="text-red-6 ml-1">•</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {companionOptions.map(option => (
              <button
                key={option}
                type="button"
                onClick={() => handleCompanionClick(option)}
                className={`text-d1 rounded-lg px-4 py-2 transition-colors ${
                  selectedCompanion === option
                    ? 'bg-neutral-6 text-white'
                    : 'border-neutral-4 bg-neutral-2 text-neutral-6 border'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-[8px]">
          <label className="text-d1 text-iceblue-8">
            어느 지역 인가요?
            <span className="text-red-6 ml-1">•</span>
          </label>
          <RegionDropdown selectedRegion={selectedRegion} onSelect={handleRegionSelect} className="w-full" />
        </div>
      </main>

      <div className="pb-6">
        <BottomActionButton type="button" disabled={!isFormValid} onClick={() => navigate('/place/add-place')}>
          장소 추가하기
        </BottomActionButton>
      </div>

      <Modal
        isOpen={isCoupleModalOpen}
        onClose={() => setIsCoupleModalOpen(false)}
        mainMessage="연인을 초대해주세요"
        subMessage="커넥팅 화면에서 연인을 초대 후 이용 가능해요"
        leftButtonText="홈으로"
        leftButtonOnClick={() => {
          setIsCoupleModalOpen(false);
          navigate('/');
        }}
        rightButtonText="연인 초대하기"
        rightButtonOnClick={() => {
          setIsCoupleModalOpen(false);
          setIsBottomSheetOpen(true);
        }}
      />

      <CoupleInviteBottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        onInvite={_partnerId => {
          setIsBottomSheetOpen(false);
          setIsInviteCompleteModalOpen(true);
        }}
      />

      <Modal
        isOpen={isInviteCompleteModalOpen}
        onClose={() => setIsInviteCompleteModalOpen(false)}
        mainMessage="초대를 완료했어요"
        subMessage="연인이 수락한 후 다시 이용해주세요"
        rightButtonText="확인"
        rightButtonOnClick={() => setIsInviteCompleteModalOpen(false)}
      />
    </div>
  );
};

export default CourseSave;
