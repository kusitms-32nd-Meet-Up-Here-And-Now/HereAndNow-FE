import axios from 'axios';
import convert from 'heic2any';

const PRESIGNED_URL_API = 'https://6a63xopag3.apigw.ntruss.com/hereandnow-ncp/api/presigned?blocking=true&result=true';

export interface PresignedUrlRequest {
  dirname: string;
  filename: string[];
}

export interface PresignedUrlResponse {
  data: {
    objectKey: string;
    presignedUrl: string;
  }[];
  isSuccess: boolean;
  timestamp: string;
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
 */
const convertHeicToJpeg = async (file: File): Promise<File> => {
  try {
    console.log('[HEIC 변환] 시작:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    });

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

    console.log('[HEIC 변환] 완료:', {
      originalFileName: file.name,
      convertedFileName: jpegFile.name,
      originalSize: file.size,
      convertedSize: jpegFile.size,
    });

    return jpegFile;
  } catch (error) {
    console.error('[HEIC 변환] 실패:', error);
    throw new Error('HEIC 파일 변환에 실패했습니다.');
  }
};

/**
 * Presigned URL 발급
 */
export const getPresignedUrls = async (request: PresignedUrlRequest): Promise<PresignedUrlResponse> => {
  try {
    console.log('[Presigned URL] 요청 시작:', {
      dirname: request.dirname,
      filenameCount: request.filename.length,
      filenames: request.filename,
    });
    const response = await axios.post<PresignedUrlResponse>(PRESIGNED_URL_API, request);
    console.log('[Presigned URL] 응답 성공:', {
      urlCount: response.data.data.length,
      objectKeys: response.data.data.map(item => item.objectKey),
      response: response.data,
    });
    return response.data;
  } catch (error) {
    console.error('[Presigned URL] 실패:', error);
    throw error;
  }
};

/**
 * 파일 업로드 (PUT 요청) - XMLHttpRequest 사용
 * HEIC 파일은 자동으로 JPEG로 변환하여 업로드
 */
export const uploadFile = async (presignedUrl: string, file: File, objectKey: string): Promise<void> => {
  // HEIC 파일인 경우 JPEG로 변환
  let fileToUpload = file;
  if (isHeicFile(file)) {
    fileToUpload = await convertHeicToJpeg(file);
  }

  return new Promise((resolve, reject) => {
    console.log('[파일 업로드] 시작:', {
      fileName: file.name,
      convertedFileName: fileToUpload.name,
      fileSize: file.size,
      convertedFileSize: fileToUpload.size,
      fileType: file.type,
      convertedFileType: fileToUpload.type,
      objectKey,
      presignedUrlLength: presignedUrl.length,
      wasConverted: file !== fileToUpload,
    });

    const xhr = new XMLHttpRequest();

    xhr.open('PUT', presignedUrl, true);

    // presigned URL에 필요한 헤더만 설정
    // Content-Type은 file.type으로 자동 설정됨

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        console.log('[파일 업로드] 성공:', {
          fileName: file.name,
          objectKey,
          status: xhr.status,
          statusText: xhr.statusText,
        });
        resolve();
      } else {
        console.error('[파일 업로드] 실패 (HTTP 에러):', {
          fileName: file.name,
          objectKey,
          status: xhr.status,
          statusText: xhr.statusText,
          response: xhr.responseText,
        });
        reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
      }
    };

    xhr.onerror = () => {
      console.error('[파일 업로드] 실패 (네트워크 에러):', {
        fileName: file.name,
        objectKey,
        status: xhr.status,
        presignedUrl: presignedUrl.substring(0, 100) + '...',
      });
      reject(new Error('Network error during upload'));
    };

    xhr.ontimeout = () => {
      console.error('[파일 업로드] 실패 (타임아웃):', {
        fileName: file.name,
        objectKey,
      });
      reject(new Error('Upload timeout'));
    };

    // 타임아웃 설정 (30초)
    xhr.timeout = 30000;

    // 파일 전송 (변환된 파일 사용)
    xhr.send(fileToUpload);
  });
};

/**
 * 여러 파일을 Presigned URL을 통해 업로드
 */
export const uploadFilesWithPresignedUrl = async (dirname: string, files: File[]): Promise<string[]> => {
  if (files.length === 0) {
    return [];
  }

  try {
    // 1. 파일명 생성 (HEIC 파일은 .jpg로 변경)
    const filenames = await Promise.all(
      files.map(async (file, idx) => {
        let ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        // HEIC 파일인 경우 jpg로 변경
        if (isHeicFile(file)) {
          ext = 'jpg';
        }
        return `${Date.now()}_${idx}.${ext}`;
      }),
    );

    console.log('[파일 업로드 (일괄)] Presigned URL 요청:', {
      dirname,
      filenameCount: filenames.length,
      filenames,
    });

    // 2. Presigned URL 발급
    const presignedResponse = await getPresignedUrls({
      dirname,
      filename: filenames,
    });

    console.log('[파일 업로드 (일괄)] Presigned URL 응답:', {
      urlCount: presignedResponse.data.length,
      objectKeys: presignedResponse.data.map(item => item.objectKey),
    });

    // 3. 병렬 업로드 (HEIC 파일은 자동으로 JPEG로 변환됨)
    console.log(`[파일 업로드 (일괄)] 파일 업로드 시작 (${files.length}개)`);
    const uploadPromises = presignedResponse.data.map((item, i) => {
      console.log(`[파일 ${i}] 업로드 준비:`, {
        fileName: files[i].name,
        objectKey: item.objectKey,
        isHeic: isHeicFile(files[i]),
      });
      return uploadFile(item.presignedUrl, files[i], item.objectKey).then(() => {
        console.log(`[파일 ${i}] 업로드 완료:`, item.objectKey);
        return item.objectKey;
      });
    });

    const objectKeyList = await Promise.all(uploadPromises);

    console.log('[파일 업로드 (일괄)] 모든 파일 업로드 완료:', {
      objectKeyCount: objectKeyList.length,
      objectKeys: objectKeyList,
    });

    return objectKeyList;
  } catch (error) {
    console.error('[파일 업로드 (일괄)] 실패:', error);
    throw error;
  }
};
