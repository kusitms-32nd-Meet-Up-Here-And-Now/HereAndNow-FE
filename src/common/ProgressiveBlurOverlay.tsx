import type { CSSProperties } from 'react';

export default function ProgressiveBlurOverlay() {
  const overlayStyle: CSSProperties = {
    // 1) 배경 흐림 (Figma End blur = 2)
    backdropFilter: 'blur(2px)',
    WebkitBackdropFilter: 'blur(2px)', // Safari

    // 2) 세로 마스크 (Figma Y start 69.52% → Y end 100%)
    maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 69.52%, rgba(0,0,0,1) 100%)',
    WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 69.52%, rgba(0,0,0,1) 100%)',

    // 3) 오버레이 배치(필요 시 조정)
    position: 'absolute',
    inset: 0,

    // 선택(사용자 인터랙션 통과)
    pointerEvents: 'none',

    width: '100%',
    height: '100%',

    zIndex: 1,

    background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 69.52%, rgba(0, 0, 0, 0.5) 95.43%, rgba(0, 0, 0, 0.6) 100%)',
  };

  return <div style={overlayStyle} />;
}
