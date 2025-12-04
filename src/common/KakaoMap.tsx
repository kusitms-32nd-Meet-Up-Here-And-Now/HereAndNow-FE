import { useEffect, useRef, useCallback, useState } from 'react';
import HeartIcon from '@assets/icons/heart.svg';
import UnScrappedIcon from '@assets/icons/place_not_save.svg';
import ScrappedIcon from '@assets/icons/place_save.svg';
import PlacePickerIcon from '@assets/icons/placePicker.svg';

interface MarkerPosition {
  latitude: number;
  longitude: number;
  name?: string;
}

interface KakaoMapProps {
  latitude: number;
  longitude: number;
  level?: number;
  width?: string;
  height?: string;
  className?: string;
  showMarker?: boolean;
  markers?: MarkerPosition[];
  searchBar?: {
    name?: string;
    previewImages?: string[];
  };
  showHeartButton?: boolean;
}

const KakaoMap = ({
  latitude,
  longitude,
  level = 3,
  width = '100%',
  height,
  className,
  showMarker = true,
  markers,
  searchBar,
  showHeartButton = true,
}: KakaoMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [isHeartClicked, setIsHeartClicked] = useState(false);

  const initMap = useCallback(() => {
    if (mapContainer.current) {
      const mapOption = {
        center: new window.kakao.maps.LatLng(latitude, longitude),
        level: level,
      };
      const map = new window.kakao.maps.Map(mapContainer.current, mapOption);

      const positionsToShow = markers || (showMarker ? [{ latitude, longitude }] : []);

      positionsToShow.forEach(position => {
        const markerPosition = new window.kakao.maps.LatLng(position.latitude, position.longitude);
        const imageSrc = PlacePickerIcon;
        const imageSize = new window.kakao.maps.Size(36, 36);
        const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize);
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
          image: markerImage,
        });
        marker.setMap(map);

        if (position.name) {
          const content =
            '<div style="padding: 4px 8px; width: 104px; height: 24px; background: white; border-radius: 4px; box-shadow: 0 4px 8px #0000000F; font-size: 12px; font-weight: 500; line-height: 16px; color: #333536; text-align: center; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; letter-spacing: -0.02px; border: 0.5px solid #FF4573;">' +
            position.name +
            '</div>';

          const customOverlay = new window.kakao.maps.CustomOverlay({
            position: markerPosition,
            content: content,
            yAnchor: 2.5,
          });
          customOverlay.setMap(map);
        }
      });
    }
  }, [latitude, longitude, level, showMarker, markers]);

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(initMap);
    } else {
      const script = document.createElement('script');
      script.src =
        '//dapi.kakao.com/v2/maps/sdk.js?appkey=' +
        import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY +
        '&libraries=services,clusterer,drawing&autoload=false';
      document.head.appendChild(script);
      script.onload = () => {
        window.kakao.maps.load(initMap);
      };
      script.onerror = () => {
        console.error('Kakao Maps 스크립트 로드 실패');
      };
    }
  }, [initMap]);

  return (
    <div className={'relative overflow-hidden rounded-lg ' + (className || '')} style={{ width, height }}>
      <div className="overflow-hidden rounded-lg" ref={mapContainer} style={{ width: '100%', height: '100%' }} />

      <div className="absolute bottom-6 left-1/2 z-10 flex w-[322px] -translate-x-1/2 items-center gap-4">
        {searchBar && (
          <div
            className="flex h-12 w-[258px] items-center gap-4 rounded-[30px] bg-white pr-[8px] pl-[14px]"
            style={{
              boxShadow: '0px 4px 8px 0px #0000000F',
            }}
          >
            {searchBar.name && (
              <div className="text-s5 text-neutral-8 max-w-[146px] flex-auto truncate">{searchBar.name}</div>
            )}

            {searchBar.previewImages && searchBar.previewImages.length > 0 && (
              <div className="flex">
                {searchBar.previewImages.slice(0, 3).map((imageUrl, index) => (
                  <div
                    key={index}
                    className={
                      'h-9 w-9 overflow-hidden rounded-full border-2 border-white ' + (index > 0 ? '-ml-[14px]' : '')
                    }
                    style={{ zIndex: searchBar.previewImages?.length ? searchBar.previewImages.length - index : 0 }}
                  >
                    <img src={imageUrl} alt={'미리보기 ' + (index + 1)} className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {showHeartButton && (
          <button
            onClick={() => setIsHeartClicked(!isHeartClicked)}
            className="relative h-12 w-12 cursor-pointer items-center justify-center rounded-[4px] bg-white p-[10px]"
          >
            <img
              src={isHeartClicked ? UnScrappedIcon : ScrappedIcon}
              alt={isHeartClicked ? '언스크랩' : '스크랩'}
              className="h-[32px] w-[32px]"
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default KakaoMap;
