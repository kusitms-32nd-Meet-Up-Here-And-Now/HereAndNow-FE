import { create } from 'zustand';
import type { CourseSaveData } from './types';

interface CourseSaveStore {
  courseData: CourseSaveData | null;
  pinFiles: File[][]; // 각 핀별 파일 배열
  setCourseData: (data: CourseSaveData) => void;
  updateCourseData: (data: Partial<CourseSaveData>) => void;
  addPin: (pin: CourseSaveData['pinList'][0]) => void;
  updatePin: (index: number, pin: Partial<CourseSaveData['pinList'][0]>) => void;
  removePin: (index: number) => void;
  setPinFiles: (pinIndex: number, files: File[]) => void;
  resetCourseData: () => void;
}

const initialCourseData: CourseSaveData = {
  courseTitle: '',
  courseDescription: '',
  coursePositive: '',
  courseNegative: '',
  isPublic: true,
  courseVisitDate: '',
  courseWith: '',
  courseRegion: '',
  courseRating: 0,
  pinList: [],
};

export const useCourseSaveStore = create<CourseSaveStore>(set => ({
  courseData: null,
  pinFiles: [],

  setCourseData: (data: CourseSaveData) => {
    set({ courseData: data });
  },

  updateCourseData: (data: Partial<CourseSaveData>) => {
    set(state => ({
      courseData: state.courseData ? { ...state.courseData, ...data } : { ...initialCourseData, ...data },
    }));
  },

  addPin: (pin: CourseSaveData['pinList'][0]) => {
    set(state => ({
      courseData: state.courseData
        ? { ...state.courseData, pinList: [...state.courseData.pinList, pin] }
        : { ...initialCourseData, pinList: [pin] },
    }));
  },

  updatePin: (index: number, pin: Partial<CourseSaveData['pinList'][0]>) => {
    set(state => {
      if (!state.courseData) return state;

      const updatedPinList = [...state.courseData.pinList];
      if (updatedPinList[index]) {
        updatedPinList[index] = { ...updatedPinList[index], ...pin };
      }

      return {
        courseData: {
          ...state.courseData,
          pinList: updatedPinList,
        },
      };
    });
  },

  removePin: (index: number) => {
    set(state => {
      if (!state.courseData) return state;

      const updatedPinList = state.courseData.pinList.filter((_, i) => i !== index);
      const updatedPinFiles = state.pinFiles.filter((_, i) => i !== index);

      return {
        courseData: {
          ...state.courseData,
          pinList: updatedPinList,
        },
        pinFiles: updatedPinFiles,
      };
    });
  },

  setPinFiles: (pinIndex: number, files: File[]) => {
    set(state => {
      const updatedPinFiles = [...state.pinFiles];
      // 배열 길이가 부족하면 빈 배열로 채우기
      while (updatedPinFiles.length <= pinIndex) {
        updatedPinFiles.push([]);
      }
      updatedPinFiles[pinIndex] = files;
      console.log('[Store] setPinFiles 실행:', {
        pinIndex,
        fileCount: files.length,
        fileNames: files.map(f => f.name),
        updatedPinFilesLength: updatedPinFiles.length,
        allPinFiles: updatedPinFiles.map((f, i) => ({
          idx: i,
          count: f.length,
          names: f.map(file => file.name),
        })),
      });
      return { pinFiles: updatedPinFiles };
    });
  },

  resetCourseData: () => {
    set({ courseData: null, pinFiles: [] });
  },
}));
