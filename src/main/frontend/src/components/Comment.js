// src/components/Comment.js


import PropTypes from "prop-types";
import React, { useState } from "react";
import AddComment from "./AddComment"; // 답글 작성 폼을 위해 임포트
import "./Comment.css";
import YouTubePreview from "./YouTubePreview";

const Comment = ({
  comment,
  userId,
  onEdit,
  onDelete,
  onAddReply,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.comment);
  const [showReplyForm, setShowReplyForm] = useState(false); // 답글 작성 폼 표시 여부

  const handleSave = () => {
    onEdit(comment.commentNo, editedText);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedText(comment.comment);
    setIsEditing(false);
  };

  // 유튜브 링크를 포함한 댓글 텍스트를 파싱하여 미리보기와 텍스트를 섞어줍니다.
  const parseCommentText = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
      if (part.match(/https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/[^\s]+/)) {
        return <YouTubePreview key={index} url={part} />;
      } else {
        return <span key={index}>{part}</span>;
      }
    });
  };

  return (
    <div className="comment">
       {/* 기존 댓글 내용 표시 */}
      <div className="comment-user-info">
        <img
          src={comment.photo || "default-photo-url"}
          alt={comment.id}
          className="comment-user-photo"
        />
        {isEditing ? (
          <textarea
            className="edit-comment-textarea"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
          />
        ) : (
          <span className="comment-text">{parseCommentText(comment.comment)}</span>
        )}
          {userId === comment.id && (
          <div className="comment-actions">
            {isEditing ? (
              <>
                <button onClick={handleSave} className="save-btn">저장</button>
                <button onClick={handleCancel} className="cancel-btn">취소</button>
              </>
            ) : (
              <>
                <button onClick={() => setIsEditing(true)} className="edit-btn">수정</button>
                <button onClick={() => onDelete(comment.commentNo)} className="delete-btn">삭제</button>
              </>
            )}
          </div>
        )}
      </div>

      {/* 답글 버튼 */}
      <div className="reply-button">
        <button onClick={() => setShowReplyForm(!showReplyForm)}>
          {showReplyForm ? '답글 취소' : '답글'}
        </button>
      </div>

      {/* 답글 작성 폼 */}
      {showReplyForm && (
        <div className="add-reply">
          <AddComment onAdd={(replyText) => {
            onAddReply(replyText, comment.commentNo);
            setShowReplyForm(false); // 답글 작성 후 폼 닫기
          }} />
        </div>
      )}

        {/* 답글 리스트 */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="replies">
          {comment.replies.map((reply) => (
            <Comment
              key={reply.commentNo}
              comment={reply}
              userId={userId}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddReply={onAddReply}
            />
          ))}
        </div>
      )}
    </div>
  );
};

Comment.propTypes = {
  comment: PropTypes.shape({
    commentNo: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
    comment: PropTypes.string.isRequired,
    photo: PropTypes.string,
    replies: PropTypes.array, // replies 추가
  }).isRequired,
  userId: PropTypes.string,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onAddReply: PropTypes.func.isRequired,
};

export default Comment;
