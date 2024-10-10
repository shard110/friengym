import { React, useState } from 'react';
import { useAuth } from "../components/AuthContext";


const PostCard = ({ post }) => {
  const [likes, setLikes] = useState(post.likes);
  const [error, setError] = useState(null);
  const { user } = useAuth(); // 인증된 사용자 정보 가져오기
  const [posts, setPosts] = useState([]); // 게시글 목록 상태
  // localStorage에서 JWT 토큰 가져오기
  const token = localStorage.getItem('token');
  
  if (!token) {
    setError("로그인이 필요합니다.");

  const likedPostsKey = `likedPosts_${user?.id}`;
  const likedPosts = JSON.parse(localStorage.getItem(likedPostsKey)) || {};

  const hasLiked = (postId) => likedPosts[postId];

    const handleLike = (post) => {
      const token = localStorage.getItem("jwtToken");
    
      if (!hasLiked(post.poNum)) {
        fetch(`/posts/${post.poNum}/like`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              return response.text().then((text) => {
                throw new Error(`Server Error: ${text}`);
              });
            }
          })
          .then((updatedPost) => {
            setPosts((prevPosts) =>
              prevPosts.map((p) => (p.poNum === updatedPost.poNum ? updatedPost : p))
            );
    
            const updatedLikedPosts = { ...likedPosts, [post.poNum]: true };
            localStorage.setItem(likedPostsKey, JSON.stringify(updatedLikedPosts));
    
            alert("좋아요를 눌렀습니다.");
          })
          .catch((error) => {
            console.error("좋아요 처리 중 오류:", error);
            alert("좋아요 처리에 실패했습니다.");
          });
      } else {
        alert("이미 이 게시글에 좋아요를 눌렀습니다.");
      }
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