import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '@common/components/Modal';

const SettingPage = () => {
  const navigate = useNavigate();
  const [isUnpairModalOpen, setIsUnpairModalOpen] = useState(false);
  const [isUnpairCompleteModalOpen, setIsUnpairCompleteModalOpen] = useState(false);

  const handleUnpairClick = () => {
    setIsUnpairModalOpen(true);
  };

  const handleConfirmUnpair = () => {
    setIsUnpairModalOpen(false);
    setIsUnpairCompleteModalOpen(true);
  };

  const handleCompleteConfirm = () => {
    setIsUnpairCompleteModalOpen(false);
    navigate('/');
  };

  return (
    <>
      <div className="flex w-full flex-col pb-24">
        {/* 연인 해제하기 */}
        <div className="px-4 pt-6">
          <button type="button" onClick={handleUnpairClick} className="text-h5 text-neutral-10 w-full py-4 text-left">
            연인 해제하기
          </button>
        </div>
      </div>
      <Modal
        isOpen={isUnpairModalOpen}
        onClose={() => setIsUnpairModalOpen(false)}
        mainMessage="정 연인과의 연결을 해제하시겠어요?"
        subMessage="한 번 해제하면 다시 되돌릴 수 없어요"
        leftButtonText="네, 해제할게요"
        leftButtonOnClick={handleConfirmUnpair}
        rightButtonText="아니요"
        rightButtonOnClick={() => setIsUnpairModalOpen(false)}
      />
      <Modal
        isOpen={isUnpairCompleteModalOpen}
        onClose={handleCompleteConfirm}
        mainMessage="해제가 완료되었어요"
        rightButtonText="확인"
        rightButtonOnClick={handleCompleteConfirm}
      />
    </>
  );
};

export default SettingPage;
