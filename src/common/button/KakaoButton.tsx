import kakaoIcon from '@assets/icons/kakaoIcon.svg';

interface KakaoButtonProps {
  handleLogin: () => void;
}

const KakaoButton = ({ handleLogin }: KakaoButtonProps) => {
  return (
    <button
      className="text-s5 flex h-[54px] w-full items-center justify-between rounded-[8px] bg-[#FFEB00] px-4 py-3 text-black transition-colors hover:bg-yellow-400"
      onClick={handleLogin}
    >
      <img src={kakaoIcon} alt="카카오 아이콘" className="w-[23px]" />

      <span>카카오 로그인</span>

      <div className="h-5 w-5" aria-hidden="true" />
    </button>
  );
};

export default KakaoButton;
