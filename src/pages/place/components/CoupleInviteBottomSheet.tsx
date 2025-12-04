import { useState } from 'react';
import BottomSheet from '@common/BottomSheet';
import { usePostCoupleRequest } from '@apis/connecting/usePostCoupleRequest';
import useGetMemberInfo from '@apis/member/useGetMemberInfo';

interface CoupleInviteBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (partnerId: string) => void;
}

const CoupleInviteBottomSheet = ({ isOpen, onClose, onInvite }: CoupleInviteBottomSheetProps) => {
  const [partnerId, setPartnerId] = useState('');
  const { mutate: postCoupleRequest, isPending } = usePostCoupleRequest();
  const { data: memberInfo } = useGetMemberInfo();

  const myId = memberInfo?.data?.username ? `@${memberInfo.data.username}` : '@username';

  const handleInviteClick = () => {
    const trimmedId = partnerId.trim();
    if (!trimmedId) return;

    // 서버에 커플 요청 보내기 (query parameter로 전송)
    // ✅ API 요청이 성공했을 때만 onInvite 호출 및 입력 초기화
    postCoupleRequest(trimmedId, {
      onSuccess: () => {
        onInvite(trimmedId);
        setPartnerId('');
      },
    });
  };

  const handleClose = () => {
    setPartnerId('');
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={handleClose}>
      <div className="flex flex-col gap-6 px-6 pb-8">
        <div className="mt-2 flex flex-col gap-2 text-center">
          <h2 className="text-s4 text-neutral-9 font-semibold">아이디로 연인 초대</h2>
          <p className="text-b3 text-neutral-5">나의 아이디: {myId}</p>
        </div>

        <div className="flex flex-col gap-3">
          <label htmlFor="partner-id" className="sr-only">
            연인 아이디 입력
          </label>
          <input
            id="partner-id"
            type="text"
            value={partnerId}
            onChange={event => setPartnerId(event.target.value)}
            placeholder="@########"
            className="border-neutral-3 text-b3 text-neutral-7 focus:border-pink-5 bg-neutral-1 placeholder:text-neutral-4 w-full rounded-2xl border px-4 py-4 transition-colors outline-none"
          />
        </div>

        <div className="mb-2 flex gap-2">
          <button
            type="button"
            onClick={handleClose}
            className="bg-neutral-2 text-b3 text-neutral-5 flex-1 rounded-2xl py-4"
          >
            나중에 하기
          </button>
          <button
            type="button"
            onClick={handleInviteClick}
            disabled={!partnerId.trim() || isPending}
            className={`text-b3 flex-1 rounded-2xl py-4 text-white transition-colors ${
              !partnerId.trim() || isPending ? 'bg-neutral-3 cursor-not-allowed' : 'bg-pink-6 hover:bg-pink-7'
            }`}
          >
            초대하기
          </button>
        </div>
      </div>
    </BottomSheet>
  );
};

export default CoupleInviteBottomSheet;
