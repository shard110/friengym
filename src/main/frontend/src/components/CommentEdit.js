// src/components/CommentEdit.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchCommentById, updateComment } from '../api/PostApi';


const CommentEdit = () => {
  const { commentNo } = useParams();
  const [comment, setComment] = useState('');

  useEffect(() => {
    const fetchComment = async () => {
      try {
        const response = await fetchCommentById(commentNo);
        setComment(response.comment);
      } catch (error) {
        console.error('댓글을 가져오는 중 오류 발생:', error);
      }
    };

    fetchComment();
  }, [commentNo]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await updateComment(commentNo, { comment });
      setComment('');
    } catch (error) {
      console.error('댓글 업데이트 중 오류 발생:', error);
    }
  };

  return (
    <div>
      <h2>댓글 수정</h2>
      <form onSubmit={handleSubmit}>
        <label>
          댓글:
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
        </label>
        <button type="submit">댓글 수정</button>
      </form>
    </div>
  );
};

export default CommentEdit;