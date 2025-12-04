interface LoadingIndicatorProps {
  /** 전체 화면을 덮는 로딩 오버레이 여부 */
  fullscreen?: boolean;

  className?: string;

  message?: string;
}

const LoadingIndicator = ({ fullscreen = false, className = '', message }: LoadingIndicatorProps) => {
  const containerClassName = [
    'flex flex-col items-center justify-center gap-3',
    fullscreen ? 'fixed inset-0 z-[9998] bg-white/90' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClassName}>
      <img src="/loading.gif" alt="로딩 중" className="h-20 w-20" />
      {message && <span className="text-d1 text-neutral-6">{message}</span>}
    </div>
  );
};

export default LoadingIndicator;
