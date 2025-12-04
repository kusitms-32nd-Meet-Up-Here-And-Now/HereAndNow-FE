import { useEffect } from 'react';
import KakaoMap from '@common/KakaoMap';
import exploreSearchIcon from '@assets/icons/explore_search.svg';
import exploreFlagIcon from '@assets/icons/explore_flag.svg';
import PlaceCard from '@pages/home/components/PlaceCard';
import { useNavigate } from 'react-router-dom';
import { useGetPlaceAds } from '@apis/explore/explore';

const ExplorePage = () => {
  const navigate = useNavigate();

  // 지도 위치 (현재 하드코딩된 값)
  const latitude = 37.5489244653904;
  const longitude = 127.051211006716;

  // API 호출
  const { data } = useGetPlaceAds({
    lat: latitude,
    lon: longitude,
  });

  // 데이터 콘솔 출력
  useEffect(() => {
    console.log('[ExplorePage] API 응답 데이터:', data);
  }, [data]);

  // API 데이터가 없으면 빈 배열
  const displayData = data?.data && data.data.length > 0 ? data.data : [];

  // 마커 데이터 생성
  const mapMarkers = displayData.map(item => ({
    latitude: item.placeMarker.latitude,
    longitude: item.placeMarker.longitude,
    name: item.placeCard.placeName,
  }));

  return (
    <div className="relative h-screen w-full">
      {/* 지도 */}
      <div className="absolute inset-0 z-0">
        <KakaoMap
          latitude={latitude}
          longitude={longitude}
          markers={mapMarkers}
          showHeartButton={false}
          className="h-full w-full"
        />
      </div>

      {/* 검색 바 */}
      <div className="absolute top-[54px] left-1/2 z-20 flex h-12 max-h-12 min-h-12 w-[362px] -translate-x-1/2 items-center gap-4">
        <div
          className="flex h-full flex-1 cursor-pointer items-center justify-between rounded-[44px] bg-white px-4"
          style={{ boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.1)' }}
          onClick={() => navigate('/explore/search')}
        >
          <input
            type="text"
            placeholder="찾고 싶은 장소가 있나요?"
            className="text-b4 placeholder:text-neutral-4 h-full w-full cursor-pointer focus:outline-none"
          />
          <button className="flex h-7 w-7 cursor-pointer items-center justify-center">
            <img src={exploreSearchIcon} alt="검색" className="h-7 w-7" />
          </button>
        </div>

        <button
          className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white"
          style={{ boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.1)' }}
          onClick={() => navigate('/explore/course')}
        >
          <img src={exploreFlagIcon} alt="플래그" className="h-6 w-6" />
        </button>
      </div>

      {/* 장소 리스트 */}
      {displayData.length > 0 && (
        <div className="absolute right-0 bottom-[127px] left-[20px] z-20 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex items-center gap-4 pr-[20px]">
            {displayData.map((item, index) => (
              <div
                key={item.placeCard.placeId || index}
                className="border-neutral-3 w-[312px] max-w-[312px] min-w-[312px] overflow-hidden rounded-[8px] border whitespace-nowrap"
                onClick={() => navigate(`/archive/place/${item.placeCard.placeId}`)}
              >
                <PlaceCard
                  imageUrl={item.placeCard.placeImageUrl}
                  name={item.placeCard.placeName}
                  category={item.placeCard.placeCategory}
                  address={item.placeCard.placeStreetNameAddress}
                  addressDetail={item.placeCard.placeNumberAddress}
                  rating={item.placeCard.placeRating}
                  reviewCount={item.placeCard.reviewCount}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExplorePage;
