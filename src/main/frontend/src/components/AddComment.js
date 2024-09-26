// src/components/AddComment.js

import PropTypes from "prop-types";
import React, { useState } from "react";
import "./AddComment.css";

const AddComment = ({ onAdd }) => {
  const [newComment, setNewComment] = useState("");

  const handleSubmit = () => {
    if (!newComment.trim()) return;
    onAdd(newComment);
    setNewComment("");
  };

  return (
    <div className="add-comment">
      <textarea
        className="add-comment-textarea"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="댓글을 입력하세요"
      />
      <button onClick={handleSubmit} className="submit-comment-btn">댓글 추가</button>
    </div>
  );
};

AddComment.propTypes = {
  onAdd: PropTypes.func.isRequired,
};

export default AddComment;
