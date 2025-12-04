import React, { useState } from 'react';

interface Point {
  id: number;
  angle: number;
}

interface CircularImagePointsProps {
  pointCount: number;
  pointImages?: string[];
  onImageUpload?: (pointId: number, imageUrl: string) => void;
  className?: string;
}

const CircularImagePoints: React.FC<CircularImagePointsProps> = ({
  pointCount,
  pointImages: externalPointImages,
  onImageUpload,
  className,
}) => {
  const [internalPointImages, setInternalPointImages] = useState<{ [key: number]: string }>({});

  // 외부에서 전달된 이미지가 있으면 사용, 없으면 내부 state 사용
  const pointImages = externalPointImages
    ? externalPointImages.reduce(
        (acc, img, idx) => {
          if (img) acc[idx] = img;
          return acc;
        },
        {} as { [key: number]: string },
      )
    : internalPointImages;

  // 원형으로 점들의 위치 계산 (CCW - 반시계방향)
  const calculatePoints = (count: number): Point[] => {
    const points: Point[] = [];
    const startAngle = -90; // 12시 방향에서 시작

    for (let i = 0; i < count; i++) {
      // 반시계방향으로 각도 계산
      const angle = startAngle - (360 / count) * i;
      points.push({ id: i, angle });
    }

    return points;
  };

  // 각도를 라디안으로 변환
  const degToRad = (deg: number): number => {
    return (deg * Math.PI) / 180;
  };

  // 점의 x, y 좌표 계산
  const getPointPosition = (angle: number, radius: number) => {
    const rad = degToRad(angle);
    return {
      x: Math.cos(rad) * radius,
      y: Math.sin(rad) * radius,
    };
  };

  const points = calculatePoints(pointCount);
  const radius = 240; // 중심에서 점까지의 거리 (180 → 240으로 증가)
  const centerX = 400; // SVG 중심 X
  const centerY = 400; // SVG 중심 Y

  //   // 포인트 이미지 업로드 핸들러
  //   const handlePointImageUpload = (pointId: number, e: React.ChangeEvent<HTMLInputElement>) => {
  //     const file = e.target.files?.[0];
  //     if (file) {
  //       const reader = new FileReader();
  //       reader.onload = event => {
  //         const imageUrl = event.target?.result as string;
  //         setInternalPointImages(prev => ({
  //           ...prev,
  //           [pointId]: imageUrl,
  //         }));
  //         onImageUpload?.(pointId, imageUrl);
  //       };
  //       reader.readAsDataURL(file);
  //     }
  //   };

  // 선 경로 생성 (마지막 점은 연결하지 않음)
  const generatePath = () => {
    if (points.length === 0) return '';

    const pathPoints = points.map(point => {
      const pos = getPointPosition(point.angle, radius);
      return `${centerX + pos.x},${centerY + pos.y}`;
    });

    if (points.length > 1) {
      // 마지막 점을 제외하고 연결 (Z 제거하여 닫지 않음)
      return `M ${pathPoints.join(' L ')}`;
    } else {
      return `M ${centerX},${centerY} L ${pathPoints[0]}`;
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className || ''}`}>
      {/* SVG 캔버스 */}
      <div className="h-full w-full overflow-hidden rounded-lg">
        <svg width="800" height="800" viewBox="0 0 800 800" className="h-full w-full">
          {/* 배경 패턴 */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="0.5" />
            </pattern>
            <filter id="shadow">
              <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.15" />
            </filter>
          </defs>

          <rect width="800" height="800" fill="transparent" />

          {/* 연결 선 */}
          {points.length > 1 && (
            <path
              d={generatePath()}
              fill="none"
              stroke="#ec4899"
              strokeWidth="16"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.6"
            />
          )}

          {/* 포인트들 */}
          {points.map(point => {
            const pos = getPointPosition(point.angle, radius);
            const x = centerX + pos.x;
            const y = centerY + pos.y;

            return (
              <g key={point.id}>
                {/* 포인트 이미지 컨테이너 */}
                <rect x={x - 50} y={y - 50 - 90} width="100" height="100" rx="20" fill="white" filter="url(#shadow)" />

                {/* 핑크색 원 */}
                <circle cx={x} cy={y} r="12" fill="#ec4899" />

                {pointImages[point.id] && (
                  <image
                    href={pointImages[point.id]}
                    x={x - 45}
                    y={y - 45 - 90}
                    width="90"
                    height="90"
                    clipPath="inset(0 round 15px)"
                  />
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default CircularImagePoints;
