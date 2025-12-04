import { useState, useEffect } from 'react';
import Router from './routes/Router';
import SplashScreen from '@common/SplashScreen';

interface AppProps {
  enableAuthCheck?: boolean; // 디버깅용: 인증 체크 활성화/비활성화 (기본값: true)
}

function App({ enableAuthCheck = true }: AppProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem('hasVisited');

    if (hasVisited) {
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
      sessionStorage.setItem('hasVisited', 'true');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return isLoading ? <SplashScreen /> : <Router enableAuthCheck={enableAuthCheck} />;
}

export default App;
