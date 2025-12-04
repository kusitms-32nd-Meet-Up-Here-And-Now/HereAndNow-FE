import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PlusIcon from '@assets/icons/plus.svg';

const AddCourse = () => {
  const navigate = useNavigate();

  const handleAddCourse = () => {
    navigate('/place/save-place');
  };

  const messages = useMemo(
    () =>
      [
        ['오늘의 순간,', '누군가의 다음 데이트가 될지도 몰라 :)'],
        ['오늘의 이야기가', '내일의 추억이 되는 순간'],
        ['돌만의 기록이 시작되는 지점,', 'here&now'],
        ['이 순간을 오래도록 간직하는 방법,', 'here& now.'],
        ['우리의 발자취가 기록이 되는 곳,', 'here& now.'],
        ['우리가 남긴 길 위로,', '또 다른 설렘이 피어나'],
        ['추억으로 다시 걷는', '그때 그 길'],
        ['평범한 하루가', '조금 더 특별해지는 순간'],
        ['당신의 코스가', '누군가의 다음 여정이 되는 순간'],
        ['새로운 장소를', '발견할 준비 되셨나요?'],
        ['오늘은 또 어떤 코스를', '찾을 수 있을까요?'],
        ['지금 느끼는 설렘을', '잊지 않도록 저장해요'],
        ['어제의 나보다,', '지금 이 순간 더 나답게'],
        ['어제보다 지금,', '지금보다 내일 조금 더 나답게'],
        ['우리의 데이트가 곧,', '누군가의 다음 로망이 되는 순간'],
        ['당신의 여정이', '다른 이의 영감이 되는 곳'],
        ['시간을 담는 가장 감성적인 방법,', 'here&now'],
        ['평범한 하루가', '누군가의 특별한 여정이 되는 순간'],
        ['우리가 남긴 길 위로,', '또 다른 설렘이 피어나'],
        ['돌만의 행복을 넘어,', '모두의 설렘이 만드는 곳'],
      ] as const,
    [],
  );

  const [primaryText, secondaryText] = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
  }, [messages]);

  return (
    <div className="border-iceblue-2 bg-iceblue-2 flex h-[88px] w-full items-center justify-between rounded-[8px] border px-5">
      <div className="flex flex-col gap-1">
        <span className="text-b4 text-iceblue-8">{primaryText}</span>
        <span className="text-b4 text-iceblue-8">{secondaryText}</span>
      </div>
      <button
        className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg bg-white"
        onClick={handleAddCourse}
      >
        <img src={PlusIcon} alt="추가" className="h-6 w-6" />
      </button>
    </div>
  );
};

export default AddCourse;
