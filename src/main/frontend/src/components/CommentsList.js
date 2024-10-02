// src/components/CommentsList.js

import PropTypes from "prop-types";
import React from "react";
import Comment from "./Comment";

const CommentsList = ({
  comments,
  userId,
  onEditComment,
  onDeleteComment,
  onAddComment,
}) => {
  return (
    <div className="comments-list">
      {comments.length > 0 ? (
        comments.map((comment) => (
          <Comment
            key={comment.commentNo}
            comment={comment}
            userId={userId}
            onEdit={onEditComment}
            onDelete={onDeleteComment}
            onAddReply={onAddComment} // 답글 추가 함수 전달
            
          />
        ))
      ) : (
        <p>댓글이 없습니다.</p>
      )}
    </div>
  );
};

CommentsList.propTypes = {
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      commentNo: PropTypes.number.isRequired,
      id: PropTypes.string.isRequired,
      comment: PropTypes.string.isRequired,
      photo: PropTypes.string,
      replies: PropTypes.array, // replies 추가
    })
  ).isRequired,
  userId: PropTypes.string,
  onEditComment: PropTypes.func.isRequired,
  onDeleteComment: PropTypes.func.isRequired,
  onAddComment: PropTypes.func.isRequired, // 추가
};


export default CommentsList;
