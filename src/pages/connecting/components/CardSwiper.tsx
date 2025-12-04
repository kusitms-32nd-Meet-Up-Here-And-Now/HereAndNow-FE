import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards } from 'swiper/modules';
import LockIcon from '@assets/icons/material-symbols_lock.svg';
// @ts-expect-error - Swiper CSS 파일은 타입 선언이 없지만 런타임에서는 정상 작동
import 'swiper/css';
// @ts-expect-error - Swiper CSS 파일은 타입 선언이 없지만 런타임에서는 정상 작동
import 'swiper/css/effect-cards';

interface CardSwiperProps {
  cards: React.ReactElement[];
  isLocked?: boolean;
  onInviteClick?: () => void;
}

const CardSwiper = ({ cards, isLocked = false, onInviteClick }: CardSwiperProps) => {
  return (
    <div className="relative h-[600px] w-full overflow-hidden">
      <div className="absolute top-[60%] left-1/2 w-full max-w-[360px] -translate-x-1/2 -translate-y-1/2 px-5">
        <Swiper
          key={isLocked ? 'locked' : 'unlocked'}
          effect={'cards'}
          grabCursor={!isLocked}
          modules={[EffectCards]}
          className="h-[350px] w-full"
          allowTouchMove={!isLocked}
          simulateTouch={true}
          touchStartPreventDefault={false}
          touchRatio={1}
          cardsEffect={{
            perSlideOffset: 8,
            perSlideRotate: 2,
            rotate: true,
            slideShadows: false,
          }}
          style={{
            touchAction: isLocked ? 'none' : 'pan-y pinch-zoom',
          }}
        >
          {cards.map((card, index) => {
            // 카드의 key를 추출하거나 index 기반으로 고유 key 생성
            const cardKey = (card as any)?.key || `card-${index}`;
            // 카드의 onClick 핸들러 추출
            const cardOnClick = (card.props as any)?.onClick;

            return (
              <SwiperSlide
                key={cardKey}
                className="flex items-center justify-center overflow-hidden rounded-[20px]"
                onClick={e => {
                  // Swiper의 터치 이벤트와 충돌 방지: 실제 클릭(not swipe)인 경우에만 처리
                  // 잠금 상태가 아니고, 카드에 onClick이 있는 경우에만 실행
                  if (!isLocked && cardOnClick) {
                    e.stopPropagation();
                    cardOnClick();
                  }
                }}
              >
                <div className="relative h-[350px] w-full overflow-hidden rounded-[20px]">
                  {/* 카드 컨텐츠 - isBlurred prop 전달 */}
                  {React.cloneElement(card, {
                    isBlurred: isLocked,
                  } as any)}

                  {/* 잠금 상태일 때 첫 번째 슬라이드에만 오버레이 표시 */}
                  {isLocked && index === 0 && (
                    <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm">
                      <div className="pointer-events-auto flex flex-col items-center gap-4">
                        {/* 자물쇠 아이콘 */}
                        <div className="flex items-center justify-center">
                          <img src={LockIcon} alt="잠금" className="h-[32px] w-[32px]" />
                        </div>

                        {/* 메시지 */}
                        <div className="flex flex-col items-center">
                          <h2 className="text-b3 text-iceblue-8 text-center font-medium">
                            연인을 초대해야 이용할 수 있어요
                          </h2>
                        </div>

                        {/* 초대하기 버튼 */}
                        <button
                          type="button"
                          onClick={onInviteClick}
                          className="bg-pink-6 hover:bg-pink-7 text-s4 flex h-[48px] w-[100px] items-center justify-center rounded-[12px] text-white shadow-lg transition-colors"
                        >
                          초대하기
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
};

export default CardSwiper;
