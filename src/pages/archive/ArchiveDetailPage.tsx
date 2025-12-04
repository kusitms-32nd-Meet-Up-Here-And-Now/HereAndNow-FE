import { useMemo, useState, type ReactNode } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import KakaoMap from '@common/KakaoMap';
import ArchivePlaceItem from '@common/components/ArchivePlaceItem';
import CommentItem from './components/CommentItem';
import Modal from '@common/components/Modal';
import useGetCourse from '@apis/course/query/useGetCourse';
import useGetCourseComment from '@apis/course/query/useGetCourseComment';
import usePostCourseComment from '@apis/course/mutation/usePostCourseComment';

const DEFAULT_PLACE_IMAGE = '/dummy_placecard.png';
const DEFAULT_MAP_CENTER = {
  latitude: 37.566826,
  longitude: 126.9786567,
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return {
    day: days[date.getDay()],
    month: months[date.getMonth()],
    date: date.getDate(),
  };
};

const getTagColorClass = (index: number): string => {
  const colors = ['bg-purple-2 text-purple-8', 'bg-orange-2 text-orange-8', 'bg-blue-2 text-blue-8'];
  return colors[index % colors.length];
};

const ArchiveDetailPage = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isDeleteCompleteModalOpen, setIsDeleteCompleteModalOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [commentInput, setCommentInput] = useState<string>('');
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const parsedCourseId = Number(id);
  const isCourseIdValid = Number.isFinite(parsedCourseId) && parsedCourseId > 0;
  const { data: course, isLoading, isError } = useGetCourse(isCourseIdValid ? parsedCourseId : 0);
  const {
    data: commentData,
    isLoading: isCommentLoading,
    isError: isCommentError,
    refetch: refetchComments,
  } = useGetCourseComment(isCourseIdValid ? parsedCourseId : 0);
  const { mutate: postCourseComment } = usePostCourseComment();

  const handleSubmitComment = () => {
    if (!isCourseIdValid) return;

    const trimmed = commentInput.trim();
    if (!trimmed) return;

    postCourseComment(
      {
        courseId: parsedCourseId,
        content: trimmed,
      },
      {
        onSuccess: () => {
          setCommentInput('');
          refetchComments();
        },
      },
    );
  };

  const formattedDate = useMemo(() => {
    if (!course?.data?.courseVisitDate) return null;
    return formatDate(course.data.courseVisitDate);
  }, [course?.data?.courseVisitDate]);

  const mapCenter = useMemo(() => {
    if (!course?.data?.pins || course.data.pins.length === 0) {
      return DEFAULT_MAP_CENTER;
    }

    const firstPin = course.data.pins[0];
    return {
      latitude: firstPin.placeDetails.placeLatitude,
      longitude: firstPin.placeDetails.placeLongitude,
    };
  }, [course?.data?.pins]);

  const mapMarkers = useMemo(() => {
    if (!course?.data?.pins || course.data.pins.length === 0) {
      return [];
    }

    return course.data.pins.map(pin => ({
      latitude: pin.placeDetails.placeLatitude,
      longitude: pin.placeDetails.placeLongitude,
      name: pin.placeDetails.placeName,
    }));
  }, [course?.data?.pins]);

  let pageBody: ReactNode = null;

  if (!isCourseIdValid) {
    pageBody = (
      <div className="flex h-full w-full items-center justify-center p-8">
        <span className="text-iceblue-8">잘못된 코스 ID입니다.</span>
      </div>
    );
  } else if (isLoading) {
    pageBody = (
      <div className="flex h-full w-full items-center justify-center p-8">
        <span className="text-iceblue-8">코스를 불러오는 중입니다...</span>
      </div>
    );
  } else if (isError || !course?.data) {
    pageBody = (
      <div className="flex h-full w-full items-center justify-center p-8">
        <span className="text-iceblue-8">코스 정보를 불러올 수 없습니다.</span>
      </div>
    );
  } else if (course?.data) {
    const courseData = course.data;
    pageBody = (
      <div className="flex w-full flex-col items-center gap-8">
        {/* 지도 */}
        {/* TODO: 지도 커스텀 해야함 */}
        <div className="relative flex h-[438px] w-[402px] min-w-[402px] items-center justify-center">
          {/* 날짜 */}
          {formattedDate && (
            <div className="bg-iceblue-2 border-iceblue-2 absolute top-0 left-1/2 z-10 flex -translate-x-1/2 items-center justify-center gap-6 rounded-[50px] border border-solid px-10 py-3">
              <span className="text-s2 text-iceblue-8">{formattedDate.day}</span>
              <span className="text-s2 text-iceblue-8">{formattedDate.month}</span>
              <span className="text-s2 text-iceblue-8">{formattedDate.date}</span>
            </div>
          )}

          {/* 지도 */}
          <KakaoMap
            latitude={mapCenter.latitude}
            longitude={mapCenter.longitude}
            markers={mapMarkers}
            showHeartButton={false}
            className="h-full w-full"
          />
        </div>

        {/* 타이틀 / 설명 / 태그 */}
        <div className="flex w-93 flex-col gap-4">
          {/* 타이틀 */}
          <span className="text-h5 text-neutral-10 w-[322px]">{courseData.courseTitle}</span>

          {/* 설명 */}
          <span className="text-b4 text-iceblue-8 w-[322px]">{courseData.courseDescription}</span>

          {/* 태그 */}
          {courseData.courseTags && courseData.courseTags.length > 0 && (
            <div className="flex items-center gap-3 overflow-x-visible">
              {courseData.courseTags.map((tag, index) => (
                <div
                  key={`${tag}-${index}`}
                  className={`${getTagColorClass(index)} text-b4 flex h-9 items-center justify-center rounded-sm px-2.5 whitespace-nowrap`}
                  style={{ boxShadow: '0px 4px 8px 0px #0000000F' }}
                >
                  {tag}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 아카이브 리스트 */}
        <div className="flex w-full flex-col gap-11">
          {courseData.pins.length > 0 ? (
            courseData.pins.map((pin, index) => {
              const photos = pin.pinImages && pin.pinImages.length > 0 ? pin.pinImages : [DEFAULT_PLACE_IMAGE];

              return (
                <ArchivePlaceItem
                  key={`${pin.placeDetails.placeId}-${index}`}
                  title={index + 1}
                  thumbnail={photos[0]}
                  placeName={pin.placeDetails.placeName}
                  category={pin.placeDetails.placeCategory}
                  roadAddress={pin.placeDetails.placeStreetNameAddress}
                  rating={pin.placeDetails.placeRating}
                  reviewCount={pin.placeDetails.reviewCount}
                  photos={photos}
                  goodPoints={pin.pinPositive}
                  badPoints={pin.pinNegative}
                  placeId={pin.placeDetails.placeId}
                  scrapped={pin.placeDetails.scrapped}
                  onDetailClick={() => navigate(`/archive/place/${pin.placeDetails.placeId}`)}
                />
              );
            })
          ) : (
            <div className="border-iceblue-3 flex w-full items-center justify-center rounded-lg border border-dashed py-10">
              <span className="text-b4 text-iceblue-7">등록된 장소가 없습니다.</span>
            </div>
          )}
        </div>

        {/* 댓글 */}
        <div className="flex w-full flex-col gap-4">
          {/* 댓글 작성 폼 */}
          <div className="flex w-full flex-col gap-2">
            <span className="text-d1 text-iceblue-8">댓글 {commentData?.data?.count ?? 0}개</span>
            <div className="border-iceblue-2 flex h-12 w-full items-center gap-2 rounded-[8px] border px-3 py-2">
              <input
                type="text"
                className="placeholder:text-iceblue-7 placeholder:text-b4 h-full flex-1 bg-transparent outline-none"
                placeholder="댓글을 남겨보세요!"
                value={commentInput}
                onChange={e => setCommentInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSubmitComment();
                  }
                }}
              />
              <button
                type="button"
                className="bg-pink-6 text-b5 flex h-8 items-center justify-center rounded-[8px] px-3 text-white"
                onClick={handleSubmitComment}
                disabled={!commentInput.trim() || !isCourseIdValid}
              >
                등록
              </button>
            </div>
          </div>

          {/* 댓글 리스트 */}
          <div className="flex w-full flex-col gap-4">
            {isCommentLoading ? (
              <div className="flex w-full items-center justify-center py-4">
                <span className="text-b4 text-iceblue-7">댓글을 불러오는 중...</span>
              </div>
            ) : isCommentError || !commentData?.data?.comments ? (
              <div className="flex w-full items-center justify-center py-4">
                <span className="text-b4 text-iceblue-7">댓글을 불러올 수 없습니다.</span>
              </div>
            ) : commentData.data.comments.length === 0 ? (
              <div className="flex w-full items-center justify-center py-4">
                <span className="text-b4 text-iceblue-7">아직 댓글이 없습니다.</span>
              </div>
            ) : (
              commentData.data.comments.map(comment => (
                <CommentItem
                  key={comment.commentId}
                  profileImage={comment.profileImage}
                  userName={comment.nickName}
                  content={comment.content}
                />
              ))
            )}
          </div>
        </div>

        {/* 삭제하기 / 공유하기 버튼 */}
        <div className="mt-[27px] flex w-full gap-3 py-5">
          <button
            type="button"
            className="bg-iceblue-2 text-s5 text-iceblue-7 flex h-13.5 w-full flex-1 cursor-pointer items-center justify-center rounded-[12px]"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            삭제하기
          </button>
          <button
            type="button"
            className="bg-pink-6 text-s5 flex h-13.5 w-full flex-1 cursor-pointer items-center justify-center rounded-[12px] text-white"
            onClick={() => setIsShareModalOpen(true)}
          >
            공유하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {pageBody}

      {/* 삭제 모달 */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        mainMessage="정말 코스를 삭제하시겠어요?"
        leftButtonText="네, 삭제할게요"
        leftButtonOnClick={() => {
          setIsDeleteModalOpen(false);
          setIsDeleteCompleteModalOpen(true);
        }}
        rightButtonText="아니요"
        rightButtonOnClick={() => setIsDeleteModalOpen(false)}
      />

      {/* 삭제 완료 모달 */}
      <Modal
        isOpen={isDeleteCompleteModalOpen}
        onClose={() => setIsDeleteCompleteModalOpen(false)}
        mainMessage="코스가 삭제되었어요"
        rightButtonText="확인"
        rightButtonOnClick={() => setIsDeleteCompleteModalOpen(false)}
      />

      {/* 공유 모달 */}
      <Modal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        mainMessage="링크를 눌러 복사할 수 있어요"
        subMessageLink="https://here-and-now-fe.vercel.app/"
        rightButtonText="확인"
        rightButtonOnClick={() => setIsShareModalOpen(false)}
      />
    </>
  );
};

export default ArchiveDetailPage;
