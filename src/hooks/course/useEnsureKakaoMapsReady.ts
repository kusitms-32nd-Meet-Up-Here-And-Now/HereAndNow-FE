import { useCallback } from 'react';

const KAKAO_MAP_SCRIPT_ID = 'kakao-map-sdk';

const useEnsureKakaoMapsReady = () => {
  const ensureKakaoMapsReady = useCallback(async () => {
    if (window.kakao?.maps?.services) {
      return;
    }

    await new Promise<void>((resolve, reject) => {
      const existingScript = document.getElementById(KAKAO_MAP_SCRIPT_ID);

      const handleLoad = () => {
        if (window.kakao?.maps) {
          window.kakao.maps.load(resolve);
        } else {
          reject(new Error('Kakao 지도 SDK load callback 호출 실패'));
        }
      };

      const handleError = () => {
        reject(new Error('Kakao 지도 SDK 로드 실패'));
      };

      if (existingScript) {
        if (window.kakao?.maps?.services) {
          resolve();
        } else {
          existingScript.addEventListener('load', handleLoad, { once: true });
          existingScript.addEventListener('error', handleError, { once: true });
        }
        return;
      }

      const script = document.createElement('script');
      script.id = KAKAO_MAP_SCRIPT_ID;
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${
        import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY
      }&libraries=services&autoload=false`;
      script.onload = handleLoad;
      script.onerror = handleError;
      document.head.appendChild(script);
    });
  }, []);

  return ensureKakaoMapsReady;
};

export default useEnsureKakaoMapsReady;
