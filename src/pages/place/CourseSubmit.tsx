import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import StarRatingFilter from '@common/components/StarRatingFilter';
import BottomActionButton from '@common/button/BottomActionButton';
import LabeledTextarea from '@common/components/LabeledTextarea';
import { useCourseSaveStore } from '@stores/course-save';
import { useCourseSave } from '../../apis/course/mutation/useCourseSave';

const CourseSubmit = () => {
  const navigate = useNavigate();
  const { courseData, updateCourseData, resetCourseData } = useCourseSaveStore();
  const courseSaveMutation = useCourseSave();

  const TITLE_MAX = 50;
  const DESCRIPTION_MAX = 100;

  // 스토어에서 값 가져오기
  const rating = courseData?.courseRating || 0;
  const courseTitle = courseData?.courseTitle || '';
  const courseDescription = courseData?.courseDescription || '';
  const highlight = courseData?.coursePositive || '';
  const downside = courseData?.courseNegative || '';

  const isFormValid = useMemo(() => {
    return (
      rating > 0 &&
      courseTitle.trim().length > 0 &&
      courseDescription.trim().length > 0 &&
      highlight.trim().length > 0 &&
      downside.trim().length > 0
    );
  }, [courseTitle, courseDescription, highlight, downside, rating]);

  const handleRatingChange = (newRating: number) => {
    updateCourseData({ courseRating: newRating });
  };

  const handleTitleChange = (value: string) => {
    updateCourseData({ courseTitle: value.slice(0, TITLE_MAX) });
  };

  const handleDescriptionChange = (value: string) => {
    updateCourseData({ courseDescription: value.slice(0, DESCRIPTION_MAX) });
  };

  const handleHighlightChange = (value: string) => {
    updateCourseData({ coursePositive: value });
  };

  const handleDownsideChange = (value: string) => {
    updateCourseData({ courseNegative: value });
  };

  const handleCourseSave = async () => {
    if (!isFormValid || !courseData) {
      console.warn('[CourseSubmit] 저장 불가:', {
        isFormValid,
        hasCourseData: !!courseData,
        courseData,
      });
      return;
    }

    console.log('[CourseSubmit] 코스 저장 시작');
    console.log('[CourseSubmit] 스토어 데이터:', {
      courseTitle: courseData.courseTitle,
      courseDescription: courseData.courseDescription,
      courseRating: courseData.courseRating,
      pinCount: courseData.pinList.length,
      courseData,
    });

    try {
      // 스토어에서 파일 가져오기
      const { pinFiles } = useCourseSaveStore.getState();

      console.log('[CourseSubmit] 스토어에서 가져온 pinFiles:', {
        pinFilesLength: pinFiles.length,
        pinFiles: pinFiles.map((files, idx) => ({
          pinIdx: idx,
          fileCount: files?.length || 0,
          fileNames: files?.map(f => f.name) || [],
        })),
        courseDataPinListLength: courseData.pinList.length,
      });

      // pinList 길이에 맞춰 pinFiles 배열 확장 (없으면 빈 배열)
      const pinFilesArray: File[][] = courseData.pinList.map((_, idx) => pinFiles[idx] || []);

      console.log('[CourseSubmit] 최종 파일 정보:', {
        pinFilesCount: pinFilesArray.length,
        pinFiles: pinFilesArray.map((files, idx) => ({
          pinIdx: idx,
          fileCount: files.length,
          fileNames: files.map(f => f.name),
        })),
      });

      const result = await courseSaveMutation.mutateAsync({
        courseData,
        pinFiles: pinFilesArray,
      });

      console.log('[CourseSubmit] 코스 저장 성공:', result);

      // 저장 성공 후 스토어 초기화 및 결과 페이지로 이동
      resetCourseData();
      console.log('[CourseSubmit] 스토어 초기화 완료');
      navigate('/place/course/result');
    } catch (error) {
      console.error('[CourseSubmit] 코스 저장 실패:', {
        error,
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
        courseData,
      });
      alert('코스 저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleSubmit = () => {
    if (!isFormValid) return;
    handleCourseSave();
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-white pb-32">
      <main className="flex flex-1 flex-col gap-8 px-5 pt-6 pb-16">
        <section className="flex flex-col gap-3">
          <h1 className="text-h4 text-neutral-10 leading-snug">
            코스를 완성하기 위한
            <br />
            마지막 단계예요
          </h1>
          <StarRatingFilter rating={rating} onRatingChange={handleRatingChange} title="별점을 매겨본다면?" />
        </section>

        <section className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <label className="text-d1 text-iceblue-8">
              코스의 제목을 알려주세요
              <span className="text-red-6 ml-1">•</span>
            </label>
            <div className="border-iceblue-3/60 rounded-[18px] border bg-white px-[20px] py-3 shadow-[0_8px_18px_rgba(24,44,70,0.04)]">
              <input
                type="text"
                value={courseTitle}
                onChange={event => handleTitleChange(event.target.value)}
                placeholder="자유롭게 작성해주세요"
                className="text-b3 text-iceblue-8 placeholder:text-iceblue-6 w-full border-none bg-transparent p-0 leading-[24px] outline-none"
              />
            </div>
            <div className="text-b4 text-iceblue-6 text-right">
              {courseTitle.length}/{TITLE_MAX}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-d1 text-iceblue-8">
              코스의 설명을 알려주세요
              <span className="text-red-6 ml-1">•</span>
            </label>
            <div className="border-iceblue-3/60 rounded-[18px] border bg-white px-[20px] py-3 shadow-[0_8px_18px_rgba(24,44,70,0.04)]">
              <textarea
                value={courseDescription}
                onChange={event => handleDescriptionChange(event.target.value)}
                placeholder="자유롭게 작성해주세요"
                className="text-b3 text-iceblue-8 placeholder:text-iceblue-6 h-[96px] w-full resize-none bg-transparent p-0 leading-[24px] outline-none"
              />
            </div>
            <div className="text-b4 text-iceblue-6 text-right">
              {courseDescription.length}/{DESCRIPTION_MAX}
            </div>
          </div>

          <LabeledTextarea
            label="어떤 점이 좋았나요?"
            required
            maxLength={100}
            value={highlight}
            onChange={handleHighlightChange}
          />
          <LabeledTextarea
            label="어떤 점이 아쉬웠나요?"
            required
            maxLength={100}
            value={downside}
            onChange={handleDownsideChange}
          />
        </section>
      </main>

      <BottomActionButton type="button" disabled={!isFormValid || courseSaveMutation.isPending} onClick={handleSubmit}>
        {courseSaveMutation.isPending ? '저장 중...' : '코스 등록하기'}
      </BottomActionButton>
    </div>
  );
};

export default CourseSubmit;
