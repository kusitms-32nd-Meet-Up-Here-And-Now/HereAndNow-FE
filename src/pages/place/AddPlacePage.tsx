import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ConfirmAddressBottomSheet from './components/ConfirmAddressBottomSheet';
import type { AddressData } from './types';

interface KakaoPlace {
  id: string;
  place_name: string;
  category_name: string;
  category_group_code: string;
  category_group_name: string;
  phone: string;
  address_name: string;
  road_address_name: string;
  place_url: string;
  x: string; // 경도
  y: string; // 위도
  distance: string;
}

const AddPlacePage = () => {
  const navigate = useNavigate();
  const [selectedAddress, setSelectedAddress] = useState<AddressData | null>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [placeName, setPlaceName] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number }>({
    latitude: 37.566826,
    longitude: 126.9786567,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<KakaoPlace[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // 카카오 로컬 검색 API 호출
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      alert('검색어를 입력해주세요');
      return;
    }

    setIsSearching(true);
    try {
      const response = await axios.get('https://dapi.kakao.com/v2/local/search/keyword.json', {
        params: {
          query: searchQuery,
          size: 15, // 최대 15개
        },
        headers: {
          Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_RESTAPI_KEY}`,
        },
      });

      console.log('[AddPlacePage] 검색 결과:', response.data);
      setSearchResults(response.data.documents || []);
    } catch (error) {
      console.error('[AddPlacePage] 검색 실패:', error);
      alert('장소 검색에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSearching(false);
    }
  };

  // 장소 선택
  const handlePlaceSelect = (place: KakaoPlace) => {
    console.log('[AddPlacePage] 선택된 장소:', place);

    // AddressData 형식으로 변환
    const formattedData: AddressData = {
      zonecode: '', // 카카오 검색에서는 우편번호 정보 없음
      address: place.address_name,
      addressType: 'R',
      bname: place.address_name.split(' ')[2] || '', // 대략적인 동네 이름
      buildingName: place.place_name,
      fullAddress: place.road_address_name || place.address_name,
    };

    setSelectedAddress(formattedData);
    setPlaceName(place.place_name);
    setCoordinates({
      latitude: Number(place.y),
      longitude: Number(place.x),
    });
    setIsBottomSheetOpen(true);
  };

  const handleCloseBottomSheet = () => {
    setIsBottomSheetOpen(false);
  };

  const handleReregister = () => {
    setIsBottomSheetOpen(false);
    setSelectedAddress(null);
    setPlaceName('');
    setDetailAddress('');
    setSearchQuery('');
    setSearchResults([]);
    setCoordinates({ latitude: 37.566826, longitude: 126.9786567 });
  };

  const handleConfirm = (pinIndex: number) => {
    if (!selectedAddress) {
      return;
    }

    const statePayload = {
      address: selectedAddress,
      placeName,
      detailAddress,
      coordinates,
      pinIndex, // 새로 추가된 핀의 인덱스
    };

    console.log('[AddPlacePage] PlaceDetail로 이동:', {
      pinIndex,
      placeName,
      statePayload,
    });

    setIsBottomSheetOpen(false);
    navigate('/place/detail', {
      state: statePayload,
    });
  };

  return (
    <div className="flex w-full flex-col">
      <main className="flex flex-col gap-6 py-6">
        <section className="flex flex-col gap-3">
          <h2 className="text-h4 text-neutral-10">주소 검색</h2>
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              placeholder="상호명, 주소로 장소를 검색하세요"
              className="text-b3 placeholder:text-iceblue-6 text-iceblue-8 border-iceblue-3/60 focus:border-pink-6 h-[52px] w-full rounded-[18px] border bg-white px-5 pr-12 shadow-[0_8px_18px_rgba(24,44,70,0.04)] transition-colors outline-none"
            />
            <button
              type="button"
              onClick={handleSearch}
              disabled={isSearching}
              className="absolute right-4 flex h-8 w-8 items-center justify-center"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-iceblue-6">
                <path
                  d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </section>

        {/* 검색 결과 */}
        {isSearching && <div className="text-iceblue-6 text-b3 flex items-center justify-center py-8">검색 중...</div>}

        {!isSearching && searchResults.length > 0 && (
          <section className="flex flex-col gap-4">
            <h3 className="text-d1 text-iceblue-8">
              연관 검색 주소 <span className="text-pink-6">{searchResults.length}</span>
            </h3>
            <div className="flex flex-col gap-3">
              {searchResults.map((place, index) => (
                <button
                  key={place.id}
                  type="button"
                  onClick={() => handlePlaceSelect(place)}
                  className="border-iceblue-2 hover:bg-iceblue-1/30 flex flex-col gap-2 border-b pb-4 text-left transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-d1 text-iceblue-8 mb-1 font-semibold">연관 검색 주소 신주소 {index + 1}</div>
                      <div className="text-b3 text-iceblue-7 mb-1">{place.place_name}</div>
                      <div className="text-b4 text-iceblue-6">{place.road_address_name || place.address_name}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {selectedAddress && !isBottomSheetOpen && (
          <section className="border-iceblue-3 mt-4 rounded-[18px] border bg-white p-5 shadow-[0_8px_18px_rgba(24,44,70,0.04)]">
            <h3 className="text-d1 text-iceblue-8 mb-3">선택된 장소</h3>
            <div className="flex flex-col gap-2">
              <div className="text-b3 text-iceblue-8">
                <span className="text-iceblue-6">장소명: </span>
                {placeName}
              </div>
              <div className="text-b3 text-iceblue-8">
                <span className="text-iceblue-6">주소: </span>
                {selectedAddress.fullAddress}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsBottomSheetOpen(true)}
              className="bg-pink-6 hover:bg-pink-7 text-d1 mt-4 w-full rounded-[12px] py-3 text-white transition-colors"
            >
              이 장소로 등록하기
            </button>
          </section>
        )}
      </main>

      <ConfirmAddressBottomSheet
        isOpen={isBottomSheetOpen}
        onClose={handleCloseBottomSheet}
        onReregister={handleReregister}
        onConfirm={handleConfirm}
        coordinates={coordinates}
        placeName={placeName}
        address={selectedAddress}
        detailAddress={detailAddress}
        onDetailAddressChange={setDetailAddress}
      />
    </div>
  );
};

export default AddPlacePage;
