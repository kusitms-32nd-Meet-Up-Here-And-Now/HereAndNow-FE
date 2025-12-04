import CloseIcon from '@assets/icons/bxs_x-circle.svg';

export interface AlarmItem {
  id: string;
  message: string;
  subMessage?: string;
  isRead: boolean;
  onClick?: () => void;
}

interface AlarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  alarms: AlarmItem[];
}

const AlarmModal = ({ isOpen, onClose, alarms }: AlarmModalProps) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50" style={{ backgroundColor: '#00000066' }} onClick={handleOverlayClick}>
      {/* 알림 컨테이너 */}
      <div className="absolute top-16 right-4 flex w-[260px] flex-col rounded-2xl bg-white p-5 shadow-lg">
        {/* 헤더 */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-s3 text-neutral-10">알림</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center"
            aria-label="닫기"
          >
            <img src={CloseIcon} alt="닫기" className="h-6 w-6" />
          </button>
        </div>

        {/* 알림 리스트 */}
        <div className="flex flex-col gap-4">
          {alarms.length === 0 ? (
            <div className="text-b4 text-neutral-5 py-8 text-center">알림이 없습니다</div>
          ) : (
            alarms.map(alarm => (
              <button key={alarm.id} type="button" onClick={alarm.onClick} className="flex flex-col gap-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-b4 text-neutral-10">{alarm.message}</span>
                  {!alarm.isRead && <div className="bg-red-6 h-2 w-2 rounded-full" aria-label="읽지 않음" />}
                </div>
                {alarm.subMessage && <span className="text-b5 text-neutral-5">{alarm.subMessage}</span>}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AlarmModal;
