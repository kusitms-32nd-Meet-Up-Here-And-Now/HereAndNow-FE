type ModalSubMessage =
  | { subMessage: string; subMessageLink?: never }
  | { subMessage?: never; subMessageLink: string }
  | { subMessage?: never; subMessageLink?: never };

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  mainMessage: string;
  leftButtonText?: string;
  leftButtonOnClick?: () => void;
  rightButtonText?: string;
  rightButtonOnClick?: () => void;
}

type ModalPropsWithSubMessage = ModalProps & ModalSubMessage;

const Modal = (props: ModalPropsWithSubMessage) => {
  const {
    isOpen,
    onClose,
    mainMessage,
    subMessage,
    subMessageLink,
    leftButtonText,
    leftButtonOnClick,
    rightButtonText,
    rightButtonOnClick,
  } = props;

  // 모달이 열려있지 않으면 렌더링하지 않음
  if (!isOpen) return null;

  // 오버레이 클릭 핸들러
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: '#00000066' }}
      onClick={handleOverlayClick}
    >
      {/* 모달 컨테이너 */}
      <div className="flex w-90 flex-col gap-5 rounded-2xl bg-white p-5">
        {/* 메시지 섹션 */}
        <div className="flex flex-col gap-1 text-center">
          {/* 메인 문장 */}
          <span className="text-s4 text-iceblue-9">{mainMessage}</span>

          {/* 서브 문장 */}
          {(subMessage || subMessageLink) && (
            <div className="text-b4 text-iceblue-7">
              {subMessage && <p>{subMessage}</p>}
              {subMessageLink && (
                <a
                  href={subMessageLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-b4 text-iceblue-7 underline"
                >
                  {subMessageLink}
                </a>
              )}
            </div>
          )}
        </div>

        {/* 버튼 섹션 */}
        <div className="flex gap-2">
          {/* 버튼 2개 버전 */}
          {leftButtonText && rightButtonText ? (
            <>
              {/* 왼쪽 버튼 */}
              <button
                onClick={leftButtonOnClick}
                className="bg-iceblue-2 text-s5 text-iceblue-7 h-13.5 min-h-13.5 flex-1 cursor-pointer rounded-xl"
              >
                {leftButtonText}
              </button>

              {/* 오른쪽 버튼 */}
              <button
                onClick={rightButtonOnClick}
                className="bg-pink-6 text-s4 h-13.5 min-h-13.5 flex-1 cursor-pointer rounded-xl text-white"
              >
                {rightButtonText}
              </button>
            </>
          ) : (
            <>
              {/* 버튼 1개 버전 */}
              {rightButtonText && (
                <button
                  onClick={rightButtonOnClick}
                  className="bg-pink-6 text-s4 h-13.5 min-h-13.5 flex-1 cursor-pointer rounded-xl text-white"
                >
                  {rightButtonText}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
