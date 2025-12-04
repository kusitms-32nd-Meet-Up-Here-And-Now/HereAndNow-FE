import { useState } from 'react';
import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import LockIcon from '@assets/icons/material-symbols_lock.svg';

interface CardSliderProps {
  cards: React.ReactElement[];
  isLocked?: boolean; // 잠금 상태 (커플 연결 전)
  onInviteClick?: () => void; // 초대하기 버튼 클릭 핸들러
}

const CardSlider = ({ cards, isLocked = false, onInviteClick }: CardSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);

  const getVisibleCards = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % cards.length;
      visible.push({ index, position: i });
    }
    return visible;
  };

  const handleDragStart = () => {
    if (isLocked) return; // 잠금 상태면 드래그 불가
    setIsDragging(true);
  };

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (isLocked) return; // 잠금 상태면 드래그 불가
    setIsDragging(false);
    const threshold = 80;

    if (info.offset.x > threshold) {
      setCurrentIndex(prev => (prev - 1 + cards.length) % cards.length);
    } else if (info.offset.x < -threshold) {
      setCurrentIndex(prev => (prev + 1) % cards.length);
    }
    x.set(0);
  };

  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);
  const opacityWhileDrag = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5]);

  const visibleCards = getVisibleCards();

  return (
    <div className="relative h-[600px] w-full overflow-hidden">
      {visibleCards.map(({ index, position }) => {
        const scale = 1 - position * 0.05;
        const y = -position * 40;
        const baseX = 0;
        const zIndex = 3 - position;
        const opacity = position === 0 ? 1 : position === 1 ? 0.85 : 0.7;
        // 잠금 상태가 아닐 때만 뒤 카드에 블러 적용
        const blur = isLocked ? 0 : position * 2;
        const isDraggable = !isLocked && position === 0;

        // 카드에 isBlurred prop 추가
        const cardWithBlur = React.cloneElement(cards[index], {
          isBlurred: isLocked,
        } as any);

        return (
          <motion.div
            key={`card-${index}-${position}`}
            layoutId={`card-${index}`}
            className="absolute top-[60%] left-1/2 h-[350px] w-[360px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[20px]"
            style={{
              scale,
              y,
              x: isDraggable ? x : baseX,
              zIndex,
              opacity: isDraggable && isDragging ? opacityWhileDrag : opacity,
              rotate: isDraggable ? rotate : 0,
              filter: `blur(${blur}px)`,
            }}
            drag={isDraggable ? 'x' : false}
            dragConstraints={{ left: -200, right: 200 }}
            dragElastic={0.3}
            onDragStart={isDraggable ? handleDragStart : undefined}
            onDragEnd={isDraggable ? handleDragEnd : undefined}
            animate={
              !isDragging
                ? {
                    scale,
                    y,
                    x: baseX,
                    opacity,
                    rotate: 0,
                  }
                : {}
            }
            transition={{
              type: 'spring',
              stiffness: 60,
              damping: 20,
              mass: 2,
            }}
          >
            {/* 카드 컨텐츠 - isBlurred prop 전달 */}
            {cardWithBlur}

            {/* 잠금 상태일 때 맨 앞 카드에만 오버레이 표시 */}
            {isLocked && position === 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/30">
                <div className="flex flex-col items-center gap-4">
                  {/* 자물쇠 아이콘 */}
                  <div className="flex items-center justify-center">
                    <img src={LockIcon} alt="잠금" className="h-[32px] w-[32px]" />
                  </div>

                  {/* 메시지 */}
                  <div className="flex flex-col items-center">
                    <h2 className="text-b3 text-iceblue-8 text-center font-medium">연인을 초대해야 이용할 수 있어요</h2>
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
          </motion.div>
        );
      })}
    </div>
  );
};

export default CardSlider;
