import type { AlarmItem } from './AlarmModal';

export const dummyAlarms: AlarmItem[] = [
  {
    id: '1',
    message: '댓글이 달렸습니다!',
    subMessage: '@kakaoid',
    isRead: false,
    onClick: () => {
      console.log('댓글 알림 클릭');
    },
  },
  {
    id: '2',
    message: '커플 요청이 도착했어요!',
    subMessage: '@kakaoid',
    isRead: false,
    onClick: () => {
      console.log('커플 요청 알림 클릭');
    },
  },
];
