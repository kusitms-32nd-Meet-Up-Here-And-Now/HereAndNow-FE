import smallFolder from '@assets/images/smallFolder.png';
import type { CourseItem } from '@apis/archive/archive';

interface ArchiveFolderListProps {
  archives: CourseItem[];
  onFolderClick: (courseId: number) => void;
  formatDate: (dateString: string) => string;
  showEmptyMessage?: boolean;
}

const ArchiveFolderList = ({ archives, onFolderClick, formatDate, showEmptyMessage = false }: ArchiveFolderListProps) => {
  if (archives.length === 0) {
    if (showEmptyMessage) {
      return (
        <div className="bg-neutral-2 text-b3 text-neutral-5 flex h-32 w-full items-center justify-center rounded-2xl">
          검색 결과가 없습니다
        </div>
      );
    }
    return null;
  }

  return (
    <div className="flex w-full flex-wrap gap-x-5 gap-y-8 px-1.75">
      {archives.map(course => (
        <div
          key={course.id}
          className="flex h-26 w-18 cursor-pointer flex-col"
          onClick={() => onFolderClick(course.id)}
        >
          {/* 폴더 */}
          <div className="relative flex h-18 w-18 items-center justify-center">
            <img src={smallFolder} alt="폴더" className="h-full w-full object-cover" />

            {/* 개수 */}
            <div className="bg-pink-6 text-d4 absolute top-2.5 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full text-white">
              {course.commentCount}
            </div>
          </div>

          {/* 타이틀 */}
          <div className="flex w-full flex-col gap-0.5">
            <span className="text-d2 text-neutral-10 line-clamp-1 w-17 text-center">{course.courseTitle}</span>
            <span className="text-d3 text-neutral-5 line-clamp-1 w-17 text-center">
              {formatDate(course.courseVisitDate)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ArchiveFolderList;

