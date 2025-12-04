import { useMutation } from '@tanstack/react-query';
import api from '../../common/api';
import { getPresignedUrls, uploadFile } from '../../common/usePresignedUpload';
import type { CourseSaveRequest, CourseSaveResponse, CourseCommitRequest, CourseCommitResponse } from '../types';

// 1. 코스 저장
const saveCourse = async (data: CourseSaveRequest): Promise<CourseSaveResponse> => {
  try {
    // 전송되는 데이터에서 ID 필드 확인
    const requestData = { ...data };
    console.log('[코스 저장] 요청 시작:', {
      courseTitle: data.courseTitle,
      pinCount: data.pinList.length,
      courseData: data,
      hasId: 'id' in requestData || 'courseId' in requestData,
      allKeys: Object.keys(requestData),
      requestDataStringified: JSON.stringify(requestData, null, 2),
    });
    const response = await api.post<CourseSaveResponse>('/course/save', data);
    console.log('[코스 저장] 응답 성공:', {
      courseKey: response.data.data.courseKey,
      courseKeyLength: response.data.data.courseKey?.length,
      pinDirnameCount: response.data.data.pinDirname.length,
      pinDirname: response.data.data.pinDirname,
      fullResponseData: response.data.data,
      fullResponse: response.data,
      // 전체 응답 구조 확인을 위한 로그
      allKeys: Object.keys(response.data.data || {}),
    });
    return response.data;
  } catch (error) {
    console.error('[코스 저장] 실패:', error);
    throw error;
  }
};

// 2. 코스 커밋
const commitCourse = async (courseUuid: string, data: CourseCommitRequest): Promise<CourseCommitResponse> => {
  try {
    const commitUrl = `/course/${courseUuid}/commit`;
    console.log('[코스 커밋] 요청 시작:', {
      courseUuid,
      courseUuidLength: courseUuid?.length,
      commitUrl,
      fullBaseUrl: import.meta.env.VITE_BASE_URL,
      fullUrl: `${import.meta.env.VITE_BASE_URL}${commitUrl}`,
      pinCount: data.pinImageObjectKeyList.length,
      pinImageObjectKeyList: data.pinImageObjectKeyList,
    });
    const response = await api.post<CourseCommitResponse>(commitUrl, data);
    console.log('[코스 커밋] 응답 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('[코스 커밋] 실패:', {
      courseUuid,
      commitUrl: `/course/${courseUuid}/commit`,
      error,
      errorResponse: (error as any)?.response?.data,
      errorStatus: (error as any)?.response?.status,
    });
    throw error;
  }
};

interface CourseSaveWithFilesParams {
  courseData: CourseSaveRequest;
  pinFiles: File[][]; // 각 핀별 파일 배열
}

export const useCourseSave = () => {
  return useMutation({
    mutationFn: async ({ courseData, pinFiles }: CourseSaveWithFilesParams) => {
      console.log('=== 코스 저장 프로세스 시작 ===');

      try {
        // 1. 코스 저장
        console.log('[1단계] 코스 저장 시작...');
        const saveResponse = await saveCourse(courseData);
        const { courseKey, pinDirname } = saveResponse.data;

        if (!courseKey) {
          throw new Error('서버 응답에 courseKey가 없습니다.');
        }

        // pinDirname에서 전체 UUID 추출 시도
        // pinDirname 형식: 'course/{courseId}/pins/{pinId}/images'
        // courseId가 8자리일 수도 있고 전체 UUID일 수도 있음
        let actualCourseId = courseKey;

        if (pinDirname && pinDirname.length > 0) {
          // 첫 번째 pinDirname에서 courseId 추출
          const firstPinDir = pinDirname[0].pinDirname;
          const courseIdMatch = firstPinDir.match(/course\/([^/]+)\/pins/);

          if (courseIdMatch && courseIdMatch[1]) {
            const extractedId = courseIdMatch[1];
            console.log('[1단계] pinDirname에서 ID 추출:', {
              originalCourseKey: courseKey,
              extractedId,
              originalLength: courseKey.length,
              extractedLength: extractedId.length,
              pinDirname: firstPinDir,
            });

            // 추출된 ID가 더 길면 사용 (전체 UUID일 가능성)
            // 또는 UUID 형식인지 확인 (하이픈 포함)
            if (extractedId.length > courseKey.length || extractedId.includes('-')) {
              actualCourseId = extractedId;
              console.log('[1단계] 추출된 ID 사용:', actualCourseId);
            }
          }
        }

        console.log('[1단계] 코스 저장 완료:', {
          courseKey,
          actualCourseId,
          willUse: actualCourseId,
        });

        // 2. 파일 업로드
        console.log('[2단계] 파일 업로드 시작...');
        console.log('[2단계] 입력 데이터 확인:', {
          pinDirnameCount: pinDirname.length,
          pinDirname: pinDirname,
          pinFilesCount: pinFiles.length,
          pinFiles: pinFiles.map((files, idx) => ({
            pinIdx: idx,
            fileCount: files.length,
            fileNames: files.map(f => f.name),
          })),
        });

        const sortedPinDirname = [...pinDirname].sort((a, b) => a.pinIdx - b.pinIdx);
        const pinImageObjectKeyList: CourseCommitRequest['pinImageObjectKeyList'] = [];

        console.log('[2단계] 정렬된 pinDirname:', sortedPinDirname);

        for (const pinDir of sortedPinDirname) {
          const files = pinFiles[pinDir.pinIdx] || [];

          console.log(`[핀 ${pinDir.pinIdx}] 처리 시작:`, {
            pinDirname: pinDir.pinDirname,
            pinFilesArrayLength: pinFiles.length,
            accessingIndex: pinDir.pinIdx,
            fileCount: files.length,
            files: files.map(f => ({ name: f.name, size: f.size, type: f.type })),
          });

          if (files.length === 0) {
            console.log(`[핀 ${pinDir.pinIdx}] 파일 없음 - 빈 배열로 추가`);
            pinImageObjectKeyList.push({
              pinIdx: pinDir.pinIdx,
              objectKeyList: [],
            });
            continue;
          }

          try {
            // Presigned URL 발급
            // HEIC 파일은 JPEG로 변환되므로 확장자를 .jpg로 변경
            const filenames = files.map((file, idx) => {
              let ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
              // HEIC 파일인 경우 jpg로 변경
              const fileName = file.name.toLowerCase();
              const fileType = file.type.toLowerCase();
              if (
                fileName.endsWith('.heic') ||
                fileName.endsWith('.heif') ||
                fileType === 'image/heic' ||
                fileType === 'image/heif'
              ) {
                ext = 'jpg';
              }
              return `${Date.now()}_${idx}.${ext}`;
            });

            console.log(`[핀 ${pinDir.pinIdx}] Presigned URL 요청:`, {
              dirname: pinDir.pinDirname,
              filenameCount: filenames.length,
              filenames,
            });

            const presignedResponse = await getPresignedUrls({
              dirname: pinDir.pinDirname,
              filename: filenames,
            });

            console.log(`[핀 ${pinDir.pinIdx}] Presigned URL 응답:`, {
              urlCount: presignedResponse.data.length,
              objectKeys: presignedResponse.data.map(item => item.objectKey),
            });

            // 병렬 업로드
            console.log(`[핀 ${pinDir.pinIdx}] 파일 업로드 시작 (${files.length}개)`);
            const uploadPromises = presignedResponse.data.map((item, i) => {
              console.log(`[핀 ${pinDir.pinIdx}-${i}] 업로드 준비:`, {
                fileName: files[i].name,
                objectKey: item.objectKey,
              });
              return uploadFile(item.presignedUrl, files[i], item.objectKey).then(() => {
                console.log(`[핀 ${pinDir.pinIdx}-${i}] 업로드 완료:`, item.objectKey);
                return item.objectKey;
              });
            });

            const objectKeyList = await Promise.all(uploadPromises);

            console.log(`[핀 ${pinDir.pinIdx}] 모든 파일 업로드 완료:`, {
              objectKeyCount: objectKeyList.length,
              objectKeys: objectKeyList,
            });

            pinImageObjectKeyList.push({
              pinIdx: pinDir.pinIdx,
              objectKeyList,
            });
          } catch (error) {
            console.error(`[핀 ${pinDir.pinIdx}] 파일 업로드 중 에러:`, error);
            throw error;
          }
        }

        console.log('[2단계] 모든 핀 파일 업로드 완료:', {
          totalPins: pinImageObjectKeyList.length,
          pinImageObjectKeyList,
        });

        // 3. 코스 커밋
        console.log('[3단계] 코스 커밋 시작...');
        const commitResponse = await commitCourse(actualCourseId, {
          pinImageObjectKeyList,
        });

        console.log('=== 코스 저장 완료 ===');
        return { courseKey: actualCourseId, commitResponse };
      } catch (error) {
        console.error('=== 코스 저장 실패 ===', error);
        throw error;
      }
    },
  });
};
