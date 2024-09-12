import axios from "axios";
import React, { useState } from "react";
import { useAuth } from './AuthContext'; // 인증 컨텍스트 추가
import './CommentCreate.css'; // CSS 파일 임포트

export default function AddComment({ poNum, refreshComments }) {
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);
  const { user } = useAuth(); // 인증 정보 가져오기

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!comment.trim()) {
      setError("Comment cannot be empty.");
      return;
    }

    try {
      await axios.post(`http://localhost:8080/posts/${poNum}/comments`, { comment }, {
        headers: {
          'Authorization': `Bearer ${user.token || localStorage.getItem('jwtToken')}`
        }
      });
      setComment("");
      setError(null);
      refreshComments(); // 댓글 목록을 새로 고침
    } catch (error) {
      setError("Failed to add comment.");
    }
  };

  return (
    <div className="card">
      <div className="card-header bi bi-chat-right-dots">댓글 쓰기</div>
      <form onSubmit={handleSubmit}>
        {user ? (
          <>
            <div className="card-body">
              <textarea 
                id="comment" 
                className="form-control" 
                rows="4" 
                placeholder="댓글을 입력하세요"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            <div className="card-footer">
              <button type="submit" className="btn btn-outline-primary bi bi-pencil-square">
                댓글 등록하기
              </button>
            </div>
          </>
        ) : (
          <div className="card-body" style={{ fontSize: "small" }}>
            <a href="/login">로그인</a> 후 댓글을 등록할 수 있습니다.
          </div>
        )}
        {error && <div className="error">Error: {error}</div>}
      </form>
    </div>
  );
}