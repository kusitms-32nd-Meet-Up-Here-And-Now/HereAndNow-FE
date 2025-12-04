import { useNavigate } from 'react-router-dom';
import PlaceCard from '@pages/home/components/PlaceCard';
import PencilIcon from '@assets/icons/bxs_pencil.svg';
import MinusCircleIcon from '@assets/icons/bx_minus-circle.svg';
import PlusCircleIcon from '@assets/icons/bx_plus-circle.svg';
import BottomActionButton from '@common/button/BottomActionButton';
import { useCourseSaveStore } from '@stores/course-save';

const MAX_COURSE_PLACES = 7;

const CourseRegister = () => {
  const navigate = useNavigate();
  const { courseData, removePin } = useCourseSaveStore();

  const pinList = courseData?.pinList || [];

  const handleRemovePlace = (index: number) => {
    removePin(index);
  };

  const handleEditPlace = (index: number) => {
    // PlaceDetail 페이지로 이동 (index를 state로 전달)
    const pin = pinList[index];
    if (pin?.place) {
      console.log('[CourseRegister] PlaceDetail로 이동:', {
        pinIndex: index,
        placeName: pin.place.placeName,
      });
      navigate('/place/detail', {
        state: { pinIndex: index, pin },
      });
    }
  };

  const handleAddPlace = () => {
    navigate('/place/add-place');
  };

  return (
    <div className="flex w-full flex-col gap-[24px] pb-24">
      <main className="flex flex-col gap-[24px] px-4">
        <section className="flex flex-col gap-[16px]">
          {pinList.map((pin, index) => {
            const place = pin.place;
            return (
              <div key={index} className="flex flex-col gap-3">
                <PlaceCard
                  imageUrl={place.placeUrl || '/dummy_placecard.png'}
                  name={place.placeName}
                  category={place.placeCategory || '장소'}
                  address={place.placeStreetNameAddress}
                  addressDetail={place.placeNumberAddress}
                  rating={pin.pinRating || 0}
                  reviewCount={0}
                />
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleRemovePlace(index)}
                    className="text-d1 border-iceblue-4 bg-iceblue-1 text-iceblue-8 hover:bg-iceblue-2 flex-1 rounded-[16px] border py-3 transition-colors"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <img src={MinusCircleIcon} alt="" className="h-5 w-5" />
                      장소 삭제
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEditPlace(index)}
                    className="text-d1 border-pink-4 bg-pink-1 text-pink-6 hover:bg-pink-2 flex-1 rounded-[16px] border py-3 transition-colors"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <img src={PencilIcon} alt="" className="h-5 w-5" />
                      세부설명 수정
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </section>

        {pinList.length < MAX_COURSE_PLACES && (
          <button
            type="button"
            onClick={handleAddPlace}
            className="border-iceblue-4 hover:bg-iceblue-1/40 flex flex-col items-center justify-center gap-4 rounded-[24px] border border-dashed bg-white p-[10px] transition-colors"
          >
            <img src={PlusCircleIcon} alt="" className="h-12 w-12" />
            <span className="text-d1 text-iceblue-7">새로운 장소 추가하기</span>
            <span className="text-b4 text-iceblue-6">
              {pinList.length}/{MAX_COURSE_PLACES}
            </span>
          </button>
        )}
      </main>

      <BottomActionButton
        type="button"
        onClick={() => navigate('/place/course/submit')}
        disabled={pinList.length === 0}
      >
        다음
      </BottomActionButton>
    </div>
  );
};

export default CourseRegister;
