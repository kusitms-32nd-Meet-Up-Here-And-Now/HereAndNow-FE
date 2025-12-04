import googleIcon from '@assets/icons/googleIcon.svg';

const GoogleButton = () => {
  return (
    <button className="text-s5 border-neutral-4 bg-neutral-1 text-neutral-8 hover:bg-neutral-3 flex h-[54px] w-full items-center justify-between rounded-lg border px-4 py-3 transition-colors">
      <img src={googleIcon} alt="구글 아이콘" className="w-[23px]" />

      <span>구글 로그인</span>

      <div className="h-5 w-5" aria-hidden="true" />
    </button>
  );
};

export default GoogleButton;
