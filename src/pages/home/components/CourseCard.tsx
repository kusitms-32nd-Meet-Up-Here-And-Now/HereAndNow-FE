import LocationIcon from '@assets/icons/pinpoint.svg';
import MapIcon from '@assets/icons/map.svg';
import sendIcon from '@assets/icons/mingcute_send-fill_img.svg';
import placeSaveIcon from '@assets/icons/place_not_save.svg';
import Tag from '@common/Tag';
import CommentItem from '@pages/archive/components/CommentItem';
import useGetCourseComment from '@apis/course/query/useGetCourseComment';
import usePostCourseComment from '@apis/course/mutation/usePostCourseComment';
import usePostCourseScrap from '@apis/course/mutation/usePostCourseScrap';
import CircularImagePoints from '@common/Ccw';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface CourseCardProps {
  courseId: number;
  profileImageUrl: string;
  authorName: string;
  title: string;
  location: string;
  placeCount: number;
  tags: string[];
  courseImages?: string[];
  hasComments?: boolean;
  onClick?: () => void;
}

const CourseCard = ({
  courseId,
  profileImageUrl,
  authorName,
  title,
  location,
  placeCount,
  tags,
  courseImages,
  hasComments,
  onClick,
}: CourseCardProps) => {
  const navigate = useNavigate();
  const [commentText, setCommentText] = useState('');

  // 실제 댓글 데이터 가져오기
  const { data: commentData, refetch: refetchComments } = useGetCourseComment(courseId);
  const comments = commentData?.data?.comments || [];
  const commentCount = commentData?.data?.count || 0;

  // 댓글 등록 mutation
  const { mutate: postComment } = usePostCourseComment();

  // 코스 스크랩 mutation
  const { mutate: scrapCourse } = usePostCourseScrap();

  // 댓글 제출 핸들러
  const handleCommentSubmit = () => {
    if (!commentText.trim()) return;

    postComment(
      { courseId, content: commentText },
      {
        onSuccess: () => {
          console.log('[댓글 등록] 성공');
          setCommentText('');
          // 댓글 목록 즉시 새로고침
          refetchComments();
        },
        onError: error => {
          console.error('[댓글 등록] 실패:', error);
          alert('댓글 등록에 실패했습니다.');
        },
      },
    );
  };

  // 코스 저장 핸들러
  const handleCourseSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    scrapCourse(courseId, {
      onSuccess: response => {
        console.log('[코스 스크랩] 성공:', response);
        // /archive/save 페이지로 이동하면서 activeTab을 'course'로 설정
        navigate('/archive/save', { state: { activeTab: 'course' } });
      },
      onError: error => {
        console.error('[코스 스크랩] 실패:', error);
        alert('코스 저장에 실패했습니다.');
      },
    });
  };
  return (
    <div className="flex w-full cursor-pointer rounded-lg bg-white p-4 shadow-sm">
      <div className="flex w-full flex-col gap-3">
        {/* 코스 정보 */}
        <div className="flex w-full gap-2" onClick={onClick}>
          <div className="flex flex-1 flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <img src={profileImageUrl} alt={authorName} className="h-[20px] w-[20px] rounded-full object-cover" />
              <span className="text-d1 text-neutral-5">{authorName}</span>
            </div>

            <h3 className="text-s4 text-neutral-8">{title}</h3>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <img src={LocationIcon} alt="위치" className="h-4 w-4" />
                <span className="text-d2 text-neutral-5">{location}</span>
              </div>

              <div className="bg-neutral-5 h-3 w-px" />

              <div className="flex items-center gap-1.5">
                <img src={MapIcon} alt="장소" className="h-4 w-4" />
                <span className="text-d2 text-neutral-5">장소 {placeCount}개</span>
              </div>
            </div>

            <div className="flex flex-row flex-wrap gap-1.5">
              {tags.map((tag, index) => {
                const tagColors = [
                  { bgColor: 'bg-orange-2', textColor: 'text-orange-8' },
                  { bgColor: 'bg-purple-1', textColor: 'text-purple-8' },
                ];
                const color = tagColors[index % tagColors.length];

                return <Tag key={index} text={tag} bgColor={color.bgColor} textColor={color.textColor} />;
              })}
            </div>
          </div>

          <div className="bg-iceblue-3 relative h-[128px] w-[128px] flex-shrink-0 overflow-hidden rounded-lg">
            <CircularImagePoints pointCount={placeCount} pointImages={courseImages} className="h-full w-full" />
            <button
              onClick={handleCourseSave}
              className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-all hover:scale-110"
            >
              <img src={placeSaveIcon} alt="코스 저장" className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* 댓글 */}
        {hasComments && commentCount > 0 && (
          <div className="flex w-full flex-col gap-4">
            {/* 댓글 작성 폼 */}
            <div className="flex w-full flex-col gap-2">
              <span className="text-d1 text-iceblue-8">댓글 {commentCount}개</span>
              <div className="flex w-full items-center gap-[10px]">
                <div className="border-iceblue-2 flex h-12 flex-1 items-center justify-center rounded-[8px] border px-5 py-3">
                  <input
                    type="text"
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleCommentSubmit();
                      }
                    }}
                    className="placeholder:text-iceblue-7 placeholder:text-b4 h-full w-full bg-transparent outline-none"
                    placeholder="댓글을 남겨보세요!"
                  />
                  <button
                    onClick={handleCommentSubmit}
                    disabled={!commentText.trim()}
                    className="border-iceblue-2 hover:bg-iceblue-1 flex h-12 w-12 items-center justify-center rounded-[4px] border bg-transparent transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <img src={sendIcon} alt="전송" className="h-6 w-6" />
                  </button>
                </div>
                <button
                  onClick={handleCourseSave}
                  className="border-iceblue-2 hover:bg-iceblue-1 flex h-12 w-12 items-center justify-center rounded-[4px] border bg-transparent transition-colors"
                >
                  <img src={placeSaveIcon} alt="코스 저장" className="h-8 w-8" />
                </button>
              </div>
            </div>

            {/* 댓글 리스트 */}
            <div className="flex w-full flex-col gap-4">
              {comments.map((comment, index) => (
                <CommentItem
                  key={comment.commentId || index}
                  profileImage={comment.profileImage}
                  userName={comment.nickName}
                  content={comment.content}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
