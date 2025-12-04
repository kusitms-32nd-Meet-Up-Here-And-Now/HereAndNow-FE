import { useState, useRef, useEffect, type FormEvent } from 'react';
import convert from 'heic2any';

interface PhotoUploaderProps {
  maxCount?: number;
  onChange?: (photos: string[]) => void;
  onFilesChange?: (files: File[]) => void;
}

/**
 * HEIC 파일인지 확인
 */
const isHeicFile = (file: File): boolean => {
  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();
  return (
    fileName.endsWith('.heic') || fileName.endsWith('.heif') || fileType === 'image/heic' || fileType === 'image/heif'
  );
};

/**
 * HEIC 파일을 JPEG로 변환
 * 이미 브라우저에서 읽을 수 있는 이미지인 경우 원본 파일 반환
 */
const convertHeicToJpeg = async (file: File): Promise<File> => {
  try {
    const convertedBlob = await convert({
      blob: file,
      toType: 'image/jpeg',
      quality: 0.8,
    });

    // convert는 Blob 또는 Blob[]을 반환할 수 있음
    const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;

    // Blob을 File 객체로 변환
    const jpegFile = new File([blob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), {
      type: 'image/jpeg',
      lastModified: file.lastModified,
    });

    return jpegFile;
  } catch (error) {
    // 이미 브라우저에서 읽을 수 있는 이미지인 경우 원본 파일 반환
    const err = error as { code?: number; message?: string };
    if (err.code === 1 && err.message?.includes('already browser readable')) {
      return file;
    }
    throw error;
  }
};

const PhotoUploader = ({ maxCount = 7, onChange, onFilesChange }: PhotoUploaderProps) => {
  const [photos, setPhotos] = useState<string[]>([]);
  const [fileObjects, setFileObjects] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canAddMorePhotos = photos.length < maxCount;

  // 파일이 변경되면 부모에게 알림 (렌더링 후 실행)
  useEffect(() => {
    if (onFilesChange) {
      // 파일이 없어도 빈 배열로 전달 (부모에서 관리)
      onFilesChange(fileObjects);
    }
  }, [fileObjects, onFilesChange]);

  const handlePhotoUpload = async (event: FormEvent<HTMLInputElement>) => {
    const files = event.currentTarget.files;
    if (!files) return;

    // 이벤트 타겟을 미리 저장 (비동기 작업 후에도 사용하기 위해)
    const inputElement = event.currentTarget;

    const availableSlots = maxCount - photos.length;
    const selectedFiles = Array.from(files).slice(0, availableSlots);

    try {
      // HEIC 파일이면 JPEG로 변환, 아니면 그대로 사용
      const processedFiles = await Promise.all(
        selectedFiles.map(async file => {
          if (isHeicFile(file)) {
            return await convertHeicToJpeg(file);
          }
          return file;
        }),
      );

      // 변환된 파일로 Data URL 생성
      const readers = processedFiles.map(
        file =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => {
              if (typeof e.target?.result === 'string') {
                resolve(e.target.result);
              } else {
                reject(new Error('이미지 데이터를 읽을 수 없습니다.'));
              }
            };
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
          }),
      );

      const imageUrls = await Promise.all(readers);

      setPhotos(prev => {
        const updated = [...prev, ...imageUrls].slice(0, maxCount);
        onChange?.(updated);
        return updated;
      });

      // 변환된 File 객체도 함께 저장 (렌더링 후 useEffect에서 부모에게 전달)
      setFileObjects(prev => {
        const updated = [...prev, ...processedFiles].slice(0, maxCount);
        return updated;
      });
    } catch (error) {
      console.error('[PhotoUploader] 이미지 업로드 실패:', error);
    } finally {
      // ref를 사용하거나 저장된 input 요소를 사용
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      } else if (inputElement) {
        inputElement.value = '';
      }
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(prev => {
      const updated = prev.filter((_, i) => i !== index);
      onChange?.(updated);
      return updated;
    });

    setFileObjects(prev => {
      const updated = prev.filter((_, i) => i !== index);
      return updated;
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        {photos.map((photo, index) => (
          <div
            key={`photo-${index}`}
            className="border-iceblue-3 relative h-[81px] w-[81px] overflow-hidden rounded-[12px] border"
          >
            <img src={photo} alt={`업로드한 사진 ${index + 1}`} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => handleRemovePhoto(index)}
              className="bg-iceblue-8 text-iceblue-1 absolute top-1 right-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full text-[10px] leading-none"
            >
              ×
            </button>
          </div>
        ))}
        {canAddMorePhotos && (
          <label className="border-iceblue-3 bg-iceblue-2 text-iceblue-6 hover:bg-iceblue-3 flex h-[81px] w-[81px] cursor-pointer items-center justify-center rounded-[12px] border border-dashed">
            <span className="text-h4 leading-none">+</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </label>
        )}
      </div>
      <span className="text-d3 text-iceblue-6">
        {photos.length}/{maxCount}장 업로드했어요
      </span>
    </div>
  );
};

export default PhotoUploader;
