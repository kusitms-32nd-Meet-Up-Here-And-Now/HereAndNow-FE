import { useMemo, useState, useRef } from 'react';
import PlusCircleIcon from '@assets/icons/bx_plus-circle.svg';
import SelectBox from '@common/components/SelectBox';
import BottomActionButton from '@common/button/BottomActionButton';
import { useNavigate } from 'react-router-dom';
import { getPresignedUrls, uploadFile } from '@apis/common/usePresignedUpload';
import usePostCoupleConnect from '@apis/connecting/usePostCoupleConnect';
import useGetCoupleInfo from '@apis/connecting/useGetCoupleInfo';

const years = Array.from({ length: 60 }, (_, idx) => new Date().getFullYear() - idx);
const months = Array.from({ length: 12 }, (_, idx) => idx + 1);
const days = Array.from({ length: 31 }, (_, idx) => idx + 1);

const ProfileModifyPage = () => {
  const [selectedYear, setSelectedYear] = useState(years[0]);
  const [selectedMonth, setSelectedMonth] = useState(months[0]);
  const [selectedDay, setSelectedDay] = useState(days[0]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { mutate: updateCoupleInfo, isPending } = usePostCoupleConnect();
  const { data: coupleInfo, refetch: refetchCoupleInfo } = useGetCoupleInfo();

  const dayOptions = useMemo(() => {
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, idx) => idx + 1);
  }, [selectedYear, selectedMonth]);

  // coupleId 가져오기 (coupleInfo에서 추출)
  const coupleId = (coupleInfo?.data as any)?.coupleId;

  // 이미지 선택 핸들러
  const handleImageSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 이미지 파일만 허용
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    setSelectedImage(file);

    // 미리보기 생성
    const reader = new FileReader();
    reader.onload = e => {
      if (typeof e.target?.result === 'string') {
        setImagePreview(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex w-full flex-col pb-24">
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <span className="text-d1 text-neutral-6">처음 만난 날</span>
          <div className="flex gap-3">
            <SelectBox
              value={selectedYear}
              onChange={value => setSelectedYear(Number(value))}
              options={years.map(year => ({ label: String(year), value: year }))}
            />
            <SelectBox
              value={selectedMonth}
              onChange={value => setSelectedMonth(Number(value))}
              options={months.map(month => ({
                label: month.toString().padStart(2, '0'),
                value: month,
              }))}
            />
            <SelectBox
              value={selectedDay}
              onChange={value => setSelectedDay(Number(value))}
              options={dayOptions.map(day => ({
                label: day.toString().padStart(2, '0'),
                value: day,
              }))}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-d1 text-neutral-6">커버 이미지</span>
          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="커버 이미지 미리보기"
                className="h-[200px] w-full rounded-[8px] object-cover"
              />
              <button
                type="button"
                onClick={handleImageSelect}
                className="absolute right-3 bottom-3 rounded-[8px] bg-black/60 px-4 py-2 text-white transition hover:bg-black/80"
              >
                변경
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleImageSelect}
              className="border-iceblue-6 flex w-full items-center justify-center rounded-[8px] border border-dashed bg-white/60 px-5 py-6 transition hover:border-purple-200 hover:bg-purple-50"
            >
              <div className="flex flex-col items-center gap-3 rounded-[20px] px-[20px] py-4">
                <div className="flex h-[44px] w-[44px] items-center justify-center rounded-full">
                  <img src={PlusCircleIcon} alt="커버 이미지 추가" className="h-[32px] w-[32px]" />
                </div>
                <span className="text-d1 text-iceblue-5">커버 이미지 추가하기</span>
              </div>
            </button>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </div>
        <BottomActionButton
          type="button"
          disabled={isUploading || isPending}
          onClick={async () => {
            if (isUploading || isPending) return;

            try {
              setIsUploading(true);

              // 날짜 형식 변환 (YYYY-MM-DD)
              const formattedDate = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;

              let imageObjectKey: string | null = null;

              // 이미지가 선택된 경우 프리사인드 URL로 업로드
              if (selectedImage && coupleId) {
                console.log('[ProfileModifyPage] 이미지 업로드 시작:', {
                  fileName: selectedImage.name,
                  coupleId,
                });

                // 파일명 생성 (HEIC 파일은 자동으로 jpg로 변환됨)
                let ext = selectedImage.name.split('.').pop()?.toLowerCase() || 'jpg';
                const fileName = selectedImage.name.toLowerCase();
                const fileType = selectedImage.type.toLowerCase();
                if (
                  fileName.endsWith('.heic') ||
                  fileName.endsWith('.heif') ||
                  fileType === 'image/heic' ||
                  fileType === 'image/heif'
                ) {
                  ext = 'jpg';
                }
                const filename = `${Date.now()}.${ext}`;
                const dirname = `couple/${coupleId}/banner`;

                // Presigned URL 발급
                const presignedResponse = await getPresignedUrls({
                  dirname,
                  filename: [filename],
                });

                if (presignedResponse.data.length === 0) {
                  throw new Error('Presigned URL 발급 실패');
                }

                const { presignedUrl, objectKey } = presignedResponse.data[0];

                // 파일 업로드
                await uploadFile(presignedUrl, selectedImage, objectKey);

                imageObjectKey = objectKey;
                console.log('[ProfileModifyPage] 이미지 업로드 완료:', objectKey);
              }

              // 커플 정보 변경 API 호출
              updateCoupleInfo(
                {
                  coupleStartDate: formattedDate,
                  imageObjectKey: imageObjectKey,
                },
                {
                  onSuccess: async () => {
                    console.log('[ProfileModifyPage] 커플 정보 변경 성공');
                    // 커플 정보 다시 불러오기
                    await refetchCoupleInfo();
                    navigate('/connecting');
                  },
                  onError: error => {
                    console.error('[ProfileModifyPage] 커플 정보 변경 실패:', error);
                    alert('커플 정보 변경에 실패했습니다. 다시 시도해주세요.');
                  },
                  onSettled: () => {
                    setIsUploading(false);
                  },
                },
              );
            } catch (error) {
              console.error('[ProfileModifyPage] 저장 중 에러:', error);
              alert('저장 중 오류가 발생했습니다. 다시 시도해주세요.');
              setIsUploading(false);
            }
          }}
        >
          {isUploading || isPending ? '저장 중...' : '저장'}
        </BottomActionButton>
      </section>
    </div>
  );
};

export default ProfileModifyPage;
