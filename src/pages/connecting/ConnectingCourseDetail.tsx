import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import KakaoMap from '@common/KakaoMap';
import DetailSection from './components/DetailSection';
import useGetCourse from '@apis/course/query/useGetCourse';

// 날짜 포맷팅 함수
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

// 태그 색상 매핑
const getTagColorClass = (index: number): string => {
  const colors = ['bg-purple-2 text-purple-8', 'bg-orange-2 text-orange-8', 'bg-blue-2 text-blue-8'];
  return colors[index % colors.length];
};

const ConnectingCourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const courseId = id ? parseInt(id, 10) : 1;
  const { data: course, isLoading } = useGetCourse(courseId);

  const formattedDate = useMemo(() => {
    if (!course?.data?.courseVisitDate) return null;
    return formatDate(course.data.courseVisitDate);
  }, [course?.data?.courseVisitDate]);

  const mainImage = useMemo(() => {
    if (!course?.data?.pins || course.data.pins.length === 0) return '/dummy_course_detail.png';
    const firstPin = course.data.pins[0];
    return firstPin.pinImages && firstPin.pinImages.length > 0 ? firstPin.pinImages[0] : '/dummy_course_detail.png';
  }, [course?.data?.pins]);

  const mapCenter = useMemo(() => {
    if (!course?.data?.pins || course.data.pins.length === 0) {
      return { latitude: 37.566826, longitude: 126.9786567 };
    }
    const firstPin = course.data.pins[0];
    return {
      latitude: firstPin.placeDetails.placeLatitude,
      longitude: firstPin.placeDetails.placeLongitude,
    };
  }, [course?.data?.pins]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <span className="text-iceblue-8">로딩 중...</span>
      </div>
    );
  }

  if (!course?.data) {
    return (
      <div className="flex items-center justify-center p-8">
        <span className="text-iceblue-8">코스 정보를 불러올 수 없습니다.</span>
      </div>
    );
  }

  return (
    <div className="">
      <div className="relative z-0 w-full overflow-hidden rounded-[24px]">
        <KakaoMap latitude={mapCenter.latitude} longitude={mapCenter.longitude} className="h-[292px] w-full" />

        {formattedDate && (
          <div className="absolute top-1 left-1/2 z-20 flex -translate-x-1/2 gap-4">
            <div className="bg-pink-2 border-pink-2 shadow-pink-3/30 flex items-center justify-center gap-6 rounded-[50px] border border-solid px-10 py-3 shadow-lg">
              <span className="text-s2 text-pink-6">{formattedDate.day}</span>
              <span className="text-s2 text-pink-6">{formattedDate.month}</span>
              <span className="text-s2 text-pink-6">{formattedDate.date}</span>
            </div>
          </div>
        )}
      </div>
      <div className="flex w-93 flex-col gap-4 py-[32px]">
        <div className="flex flex-col gap-2">
          <img src={mainImage} alt="코스 상세" className="h-full w-full object-cover" />
        </div>
        <span className="text-h5 text-neutral-10">{course.data.courseTitle}</span>

        <span className="text-b4 text-iceblue-8">{course.data.courseDescription}</span>

        {/* 태그 표시 */}
        {course.data.courseTags && course.data.courseTags.length > 0 && (
          <div className="flex items-center gap-3 overflow-x-visible">
            {course.data.courseTags.map((tag, index) => (
              <div
                key={index}
                className={`${getTagColorClass(index)} text-b4 flex h-9 items-center justify-center rounded-sm px-2.5 whitespace-nowrap`}
                style={{ boxShadow: '0px 4px 8px 0px #0000000F' }}
              >
                {tag}
              </div>
            ))}
          </div>
        )}
        <DetailSection pins={course.data.pins} courseId={course.data.courseId} />
      </div>
    </div>
  );
};

export default ConnectingCourseDetail;
