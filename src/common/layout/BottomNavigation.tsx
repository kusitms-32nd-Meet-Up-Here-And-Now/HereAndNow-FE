import { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import HomeIcon from '@assets/icons/home.svg';
import ArchiveIcon from '@assets/icons/archive.svg';
import ConnectingIcon from '@assets/icons/conecting.svg';
import PlaceIcon from '@assets/icons/place.svg';

const navItems = [
  { path: '/', icon: HomeIcon, alt: '홈' },
  { path: '/explore', icon: PlaceIcon, alt: '둘러보기' },
  { path: '/archive', icon: ArchiveIcon, alt: '아카이브' },
  { path: '/connecting', icon: ConnectingIcon, alt: '연결' },
];

const BottomNavigation = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);

  const lastScrollY = useRef(0);

  // 스크롤 방향 누적 추적 (bouncing 무시용)
  const scrollDeltaRef = useRef(0);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const prevScrollY = lastScrollY.current;
      const delta = currentScrollY - prevScrollY;

      // 스크롤이 실제로 발생했는지 확인
      if (Math.abs(delta) < 1) {
        return;
      }

      // [핵심] 델타를 누적해서 전체적인 스크롤 방향 파악
      scrollDeltaRef.current += delta;

      // 기존 숨김 타이머 취소
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }

      // 누적 델타가 충분히 크면 (확실한 방향 전환) - 임계값을 낮춤
      if (Math.abs(scrollDeltaRef.current) > 20) {
        if (scrollDeltaRef.current > 0 && currentScrollY > 50) {
          // 확실하게 아래로 스크롤 중
          setIsVisible(false);
        } else if (scrollDeltaRef.current < 0 || currentScrollY < 50) {
          // 확실하게 위로 스크롤 중 또는 상단 근처
          setIsVisible(true);
        }

        // 델타 리셋
        scrollDeltaRef.current = 0;
      }

      // 스크롤이 멈춘 후 상태 재확인 (bounce 후 정리)
      hideTimeoutRef.current = setTimeout(() => {
        const finalScrollY = window.scrollY;

        // 스크롤이 멈췄을 때 최종 위치 기준으로 판단
        if (finalScrollY < 50) {
          setIsVisible(true);
        }

        // 델타 완전 리셋
        scrollDeltaRef.current = 0;
      }, 150);

      lastScrollY.current = currentScrollY;
    };

    // scroll 이벤트와 wheel 이벤트 모두 감지
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleScroll);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className={`pointer-events-none fixed right-0 bottom-0 left-0 z-[500000] flex h-[110px] items-end justify-center bg-gradient-to-b from-transparent to-[rgba(0,0,0,0.4)] pb-8 backdrop-blur-[2px] transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="border-neutral-4 pointer-events-auto flex w-auto items-center gap-x-6 rounded-[8px] border bg-white px-[8px] py-[6px] shadow-lg">
        {navItems.map(item => (
          <Link
            to={item.path}
            key={item.path}
            className={`rounded-lg p-[16px] transition-colors ${
              location.pathname === item.path ? 'bg-pink-1' : 'bg-transparent'
            }`}
          >
            <img src={item.icon} alt={item.alt} className="h-7 w-7" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;
