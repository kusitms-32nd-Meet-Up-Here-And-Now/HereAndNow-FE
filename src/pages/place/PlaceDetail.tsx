import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import StarRatingFilter from '@common/components/StarRatingFilter';
import PhotoUploader from '@common/components/PhotoUploader';
import TagSelector from '@common/components/TagSelector';
import LabeledTextarea from '@common/components/LabeledTextarea';
import PlaceCard from '@pages/home/components/PlaceCard';
import BottomActionButton from '@common/button/BottomActionButton';
import { useCourseSaveStore } from '@stores/course-save';
import { getCategoryTags } from '@utils/categoryTags';

const PlaceDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setPinFiles, pinFiles, courseData, updatePin } = useCourseSaveStore();

  // location.state에서 pinIndex 가져오기 (없으면 새 핀 추가 시 -1)
  const pinIndex = (location.state as { pinIndex?: number })?.pinIndex ?? -1;

  // store에서 현재 pin 정보 가져오기
  const currentPin = pinIndex >= 0 && courseData?.pinList?.[pinIndex] ? courseData.pinList[pinIndex] : null;
  const currentPlace = currentPin?.place;

  // 별점 상태 관리 (store의 pinRating 또는 기본값 0)
  const [rating, setRating] = useState<number>(currentPin?.pinRating || 0);

  // pin 정보가 변경되면 별점 업데이트
  useEffect(() => {
    if (currentPin?.pinRating !== undefined) {
      setRating(currentPin.pinRating);
    }
  }, [currentPin?.pinRating]);

  // 핀의 좋았던 점, 아쉬웠던 점 상태 관리
  const [positiveDescription, setPositiveDescription] = useState<string>(currentPin?.pinPositiveDescription || '');
  const [negativeDescription, setNegativeDescription] = useState<string>(currentPin?.pinNegativeDescription || '');

  // pin 정보가 변경되면 설명 업데이트
  useEffect(() => {
    if (currentPin) {
      setPositiveDescription(currentPin.pinPositiveDescription || '');
      setNegativeDescription(currentPin.pinNegativeDescription || '');
    }
  }, [currentPin?.pinPositiveDescription, currentPin?.pinNegativeDescription]);

  // 태그 상태 관리
  const [selectedTags, setSelectedTags] = useState<string[]>(currentPin?.pinTagNames || []);

  // pin 정보가 변경되면 태그 업데이트
  useEffect(() => {
    if (currentPin?.pinTagNames) {
      setSelectedTags(currentPin.pinTagNames);
    }
  }, [currentPin?.pinTagNames]);

  // 현재 핀의 파일 목록 관리
  const [currentFiles, setCurrentFiles] = useState<File[]>(() => {
    if (pinIndex >= 0) {
      return pinFiles[pinIndex] || [];
    }
    return [];
  });

  // 파일이 변경되면 스토어에 저장
  useEffect(() => {
    if (pinIndex >= 0) {
      setPinFiles(pinIndex, currentFiles);
    }
  }, [currentFiles, pinIndex, setPinFiles]);

  // 별점 변경 핸들러
  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    if (pinIndex >= 0) {
      updatePin(pinIndex, { pinRating: newRating });
    }
  };

  // 카테고리 코드에 따른 태그 옵션 가져오기
  const categoryTags = useMemo(() => {
    const categoryCode = currentPlace?.placeGroupCode;
    const tags = getCategoryTags(categoryCode);
    return tags;
  }, [currentPlace?.placeGroupCode]);

  return (
    <div className="flex w-full flex-col gap-[32px] pb-16">
      <PlaceCard
        name={currentPlace?.placeName || '장소 이름'}
        category={currentPlace?.placeCategory?.split(' > ')[0] || '장소'}
        address={currentPlace?.placeStreetNameAddress || ''}
        addressDetail={currentPlace?.placeNumberAddress || ''}
        rating={rating}
        reviewCount={0}
      />
      <div className="flex flex-col gap-[8px]">
        <label className="text-d1 text-iceblue-8">
          다녀오신 곳의 사진을 올려주세요
          <span className="text-red-6 ml-1">•</span>
        </label>
        <PhotoUploader
          onFilesChange={allFiles => {
            // PhotoUploader가 전체 파일 목록을 전달하므로 그대로 사용
            setCurrentFiles(allFiles);
          }}
        />
      </div>
      <div className="flex flex-col gap-[8px]">
        <StarRatingFilter rating={rating} onRatingChange={handleRatingChange} title="별점을 매겨본다면?" />
      </div>
      {categoryTags.atmosphere.length > 0 && (
        <div className="flex flex-col gap-[8px]">
          <label className="text-d1 text-iceblue-8">
            분위기는 어땠나요?
            <span className="text-red-6 ml-1">•</span>
          </label>
          <TagSelector
            options={categoryTags.atmosphere}
            maxSelected={5}
            selectedTags={selectedTags.filter(tag => categoryTags.atmosphere.includes(tag))}
            onChange={tags => {
              // 기존 태그에서 atmosphere 태그를 제거하고 새로운 태그 추가
              const otherTags = selectedTags.filter(tag => !categoryTags.atmosphere.includes(tag));
              const newTags = [...otherTags, ...tags];
              setSelectedTags(newTags);
              if (pinIndex >= 0) {
                updatePin(pinIndex, { pinTagNames: newTags });
              }
            }}
          />
        </div>
      )}
      {categoryTags.facility.length > 0 && (
        <div className="flex flex-col gap-[8px]">
          <label className="text-d1 text-iceblue-8">
            시설은 어떠셨나요?
            <span className="text-red-6 ml-1">•</span>
          </label>
          <TagSelector
            options={categoryTags.facility}
            maxSelected={5}
            selectedTags={selectedTags.filter(tag => categoryTags.facility.includes(tag))}
            onChange={tags => {
              // 기존 태그에서 facility 태그를 제거하고 새로운 태그 추가
              const otherTags = selectedTags.filter(tag => !categoryTags.facility.includes(tag));
              const newTags = [...otherTags, ...tags];
              setSelectedTags(newTags);
              if (pinIndex >= 0) {
                updatePin(pinIndex, { pinTagNames: newTags });
              }
            }}
            selectedOptionClassName="bg-blue-6 text-white"
            optionContainerBgClassName="bg-blue-1"
          />
        </div>
      )}
      {categoryTags.etc.length > 0 && (
        <div className="flex flex-col gap-[8px]">
          <label className="text-d1 text-iceblue-8">
            기타 사항
            <span className="text-red-6 ml-1">•</span>
          </label>
          <TagSelector
            options={categoryTags.etc}
            maxSelected={5}
            selectedTags={selectedTags.filter(tag => categoryTags.etc.includes(tag))}
            onChange={tags => {
              // 기존 태그에서 etc 태그를 제거하고 새로운 태그 추가
              const otherTags = selectedTags.filter(tag => !categoryTags.etc.includes(tag));
              const newTags = [...otherTags, ...tags];
              setSelectedTags(newTags);
              if (pinIndex >= 0) {
                updatePin(pinIndex, { pinTagNames: newTags });
              }
            }}
            selectedOptionClassName="bg-green-6 text-white"
            optionContainerBgClassName="bg-green-1"
          />
        </div>
      )}
      <LabeledTextarea
        label="어떤 점이 좋았나요?"
        required
        maxLength={100}
        value={positiveDescription}
        onChange={value => {
          setPositiveDescription(value);
          if (pinIndex >= 0) {
            updatePin(pinIndex, { pinPositiveDescription: value });
          }
        }}
      />
      <LabeledTextarea
        label="어떤 점이 아쉬웠나요?"
        required
        maxLength={100}
        value={negativeDescription}
        onChange={value => {
          setNegativeDescription(value);
          if (pinIndex >= 0) {
            updatePin(pinIndex, { pinNegativeDescription: value });
          }
        }}
      />
      <div className="pt-[80px]">
        <BottomActionButton type="button" onClick={() => navigate('/place/register')}>
          세부설명 저장
        </BottomActionButton>
      </div>
    </div>
  );
};

export default PlaceDetail;
