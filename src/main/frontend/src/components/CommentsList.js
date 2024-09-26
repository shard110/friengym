// src/components/CommentsList.js

import PropTypes from "prop-types";
import React from "react";
import Comment from "./Comment";

const CommentsList = ({
  comments,
  userId,
  onEditComment,
  onDeleteComment,
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
    })
  ).isRequired,
  userId: PropTypes.string,
  onEditComment: PropTypes.func.isRequired,
  onDeleteComment: PropTypes.func.isRequired,
};

export default CommentsList;
