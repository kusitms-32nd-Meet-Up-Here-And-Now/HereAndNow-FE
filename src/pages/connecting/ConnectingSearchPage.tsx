import { useState } from 'react';
import StarRatingFilter from '@common/components/StarRatingFilter';
import TagSelector from '@common/components/TagSelector';
import RegionDropdown from '@common/RegionDropdown';
import BottomActionButton from '@common/button/BottomActionButton';
import LabeledTextarea from '@common/components/LabeledTextarea';
import { useNavigate } from 'react-router-dom';

const ConnectingSearchPage = () => {
  const navigate = useNavigate();
  const [rating, setRating] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('');

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region);
  };

  return (
    <div className="bg-neutral-1 flex min-h-screen flex-col">
      <span className="text-h4 text-neutral-10 py-8">찾고 싶은 추억이 있나요?</span>

      <div className="flex w-full flex-col gap-8">
        <StarRatingFilter rating={rating} onRatingChange={setRating} title="별점으로 찾아볼까요?" />
      </div>
      <div className="flex w-full flex-col gap-8">
        {/* 생각나는 키워드가 있나요? */}
        <div className="flex w-full flex-col gap-2">
          <span className="text-d1 text-iceblue-8">생각나는 키워드가 있나요?</span>

          {/* TODO: 퍼블리싱 새로 해야함 (현재는 빠른 개발을 위해 일단 넘어감) */}
          <TagSelector options={['선물', '추억', '기념일', '연인', '친구']} maxSelected={3} />
        </div>

        {/* 언제 다녀오셨나요? */}
        <div className="flex w-full flex-col gap-2">
          <span className="text-d1 text-iceblue-8">언제 다녀오셨나요?</span>
          <input
            id="visit-date"
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="border-neutral-4 text-d1 text-neutral-8 focus:border-pink-6 w-full rounded-lg border bg-white px-4 py-3 outline-none"
          />
        </div>

        {/* 어느 지역 인가요? */}
        <div className="flex w-full flex-col gap-2">
          <span className="text-d1 text-iceblue-8">어느 지역 인가요?</span>
          <RegionDropdown selectedRegion={selectedRegion} onSelect={handleRegionSelect} className="w-full" />
        </div>

        {/* 어디에 다녀오셨나요? */}
        <div className="flex w-full flex-col gap-2">
          <span className="text-d1 text-iceblue-8">어디에 다녀오셨나요?</span>
          <TagSelector
            options={[
              '관광명소',
              '숙박',
              '음식점',
              '카페',
              '문화시설',
              '중개업소',
              '공공기관',
              '병원',
              '약국',
              '편의점',
              '대형마트',
              '어린이집, 유치원',
              '학교',
              '학원',
              '주차장',
              '주유소, 충전소',
              '지하철역',
              '은행',
            ]}
            maxSelected={3}
          />
        </div>

        {/* 분위기는 어떠셨나요? */}
        <div className="flex w-full flex-col gap-2">
          <span className="text-d1 text-iceblue-8">분위기는 어떠셨나요?</span>
          <TagSelector
            options={[
              '사진 찍기 좋아요',
              '분위기 맛집',
              '뷰가 좋아요',
              '특별한 날 오기 좋아요',
              '야경이 예뻐요',
              '이색 데이트',
              '건물이 멋져요',
              '로맨틱해요',
              '기념일에 오기 좋아요',
              '감성 숙소',
            ]}
            maxSelected={3}
          />
        </div>

        {/* 음식/가격은 어떠셨나요? */}
        <div className="flex w-full flex-col gap-2">
          <span className="text-d1 text-iceblue-8">음식/가격은 어떠셨나요?</span>
          <TagSelector options={['음식이 맛있어요', '메뉴가 다양해요', '특별한 메뉴가 있어요']} maxSelected={3} />
        </div>

        {/* 시설은 어떠셨나요? */}
        <div className="flex w-full flex-col gap-2">
          <span className="text-d1 text-iceblue-8">시설은 어떠셨나요?</span>
          <TagSelector
            options={[
              '시설이 깨끗해요',
              '분위기 맛집',
              '뷰가 좋아요',
              '특별한 날 오기 좋아요',
              '야경이 예뻐요',
              '이색 데이트',
              '건물이 멋져요',
              '로맨틱해요',
              '기념일에 오기 좋아요',
              '감성 숙소',
            ]}
            maxSelected={3}
            selectedOptionClassName="bg-blue-6 text-white"
            optionContainerBgClassName="bg-blue-1"
          />
        </div>

        {/* 기타사항 */}
        <div className="flex w-full flex-col gap-2">
          <span className="text-d1 text-iceblue-8">기타사항</span>
          <TagSelector
            options={[
              '친절해요',
              '분위기 맛집',
              '뷰가 좋아요',
              '특별한 날 오기 좋아요',
              '야경이 예뻐요',
              '이색 데이트',
              '건물이 멋져요',
              '로맨틱해요',
              '기념일에 오기 좋아요',
              '감성 숙소',
            ]}
            maxSelected={3}
            selectedOptionClassName="bg-green-6 text-white"
            optionContainerBgClassName="bg-green-1"
          />
        </div>
        <LabeledTextarea label="어떤 점이 좋았나요?" required maxLength={100} />
        <LabeledTextarea label="어떤 점이 아쉬웠나요?" required maxLength={100} />
        <div className="pb-8">
          <BottomActionButton type="button" onClick={() => navigate('/connecting/archive')}>
            검색하기
          </BottomActionButton>
        </div>
      </div>
    </div>
  );
};

export default ConnectingSearchPage;
