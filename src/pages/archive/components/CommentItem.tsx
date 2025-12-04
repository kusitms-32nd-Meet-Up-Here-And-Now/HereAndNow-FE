interface CommentItemProps {
  profileImage: string;
  userName: string;
  content: string;
}

const CommentItem = ({ profileImage, userName, content }: CommentItemProps) => {
  return (
    <div className="flex w-full items-start gap-4">
      {/* 프로필 */}
      <div className="flex h-5 max-h-5 min-h-5 w-[50px] max-w-[50px] min-w-[50px] items-center gap-1">
        <div className="flex h-5 w-5 items-center justify-center overflow-hidden rounded-full">
          <img src={profileImage} alt="프로필" className="h-full w-full object-cover" />
        </div>
        <span className="text-d1 text-neutral-5">{userName}</span>
      </div>

      {/* 댓글 내용 */}
      <span className="text-b5 text-iceblue-8 flex-1">{content}</span>
    </div>
  );
};

export default CommentItem;

