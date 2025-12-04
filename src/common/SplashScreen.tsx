const SplashScreen = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
      <div className="w-full max-w-[402px]">
        <img src="/hereandnow-splash.gif" alt="Here and Now 로딩 중" className="w-full" />
      </div>
    </div>
  );
};

export default SplashScreen;
