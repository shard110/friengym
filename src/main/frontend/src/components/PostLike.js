import { React, useState } from 'react';

const PostCard = ({ post }) => {
  const [likes, setLikes] = useState(post.likes);
  const [error, setError] = useState(null);

  // localStorage에서 JWT 토큰 가져오기
  const token = localStorage.getItem('token');
  
  if (!token) {
    setError("로그인이 필요합니다.");


  const handleLike = () => {
      fetch(`/posts/${post.poNum}/like`, { method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,  // JWT 토큰을 Authorization 헤더에 추가
        }
       })
          .then(response => response.json())
          .then(data => setLikes(data.likes));
  };

  return (
      <div className="post-card">
          <img src={post.fileUrl} alt={post.title} />
          <div className="post-info">
              <h3>{post.poContents}</h3>
              <button onClick={handleLike}>👍 {likes}</button>
          </div>
      </div>
  );
};
};