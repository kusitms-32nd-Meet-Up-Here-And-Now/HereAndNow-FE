const useKakaoLogin = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8080';
  const kakaoURL = `${BASE_URL}/oauth2/authorization/kakao`;

  const handleKakaoLogin = () => {
    window.location.href = kakaoURL;
  };

  return { handleKakaoLogin };
};

export default useKakaoLogin;
