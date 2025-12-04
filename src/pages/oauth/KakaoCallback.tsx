import { useEffect } from 'react';
import { useKakaoToken } from 'src/apis/home/mutation/useKakaoToken';

const KakaoCallback = () => {
  const { mutate, isPending } = useKakaoToken();

  useEffect(() => {
    const params = new URL(window.location.href).searchParams;
    const code = params.get('code');

    if (code) {
      mutate({ authKey: code });
    }
  }, []);

  if (isPending) {
    return <div>로그인 처리 중입니다. 잠시만 기다려주세요...</div>;
  }

  return null;
};

export default KakaoCallback;
