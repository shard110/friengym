import { React, useEffect, useState } from 'react';
import { useAuth } from "../components/AuthContext";

const PostCard = ({ post }) => {
  const [likes, setLikes] = useState(post.likes);
  const [error, setError] = useState(null);
  const { user } = useAuth(); // 인증된 사용자 정보
  const [likedPosts, setLikedPosts] = useState({}); // 좋아요 상태 관리

  // JWT 토큰 가져오기
  const token = localStorage.getItem('jwtToken');

  // 좋아요 상태 로컬 스토리지에서 불러오기
  useEffect(() => {
    const likedPostsKey = `likedPosts_${user?.id}`;
    const storedLikedPosts = JSON.parse(localStorage.getItem(likedPostsKey)) || {};
    setLikedPosts(storedLikedPosts);
  }, [user?.id]);

  // 이미 좋아요를 눌렀는지 확인하는 함수
  const hasLiked = (postId) => !!likedPosts[postId];

  // 좋아요 버튼 클릭 처리
  const handleLike = async () => {
    if (!token) {
      setError("로그인이 필요합니다.");
      return;
    }

    if (hasLiked(post.poNum)) {
      alert("이미 이 게시글에 좋아요를 눌렀습니다.");
      return;
    }

    try {
      const response = await fetch(`/posts/${post.poNum}/like`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Server Error: ${errorMessage}`);
      }

      const updatedPost = await response.json();

      setLikes(updatedPost.likes); // 좋아요 수 업데이트

      const updatedLikedPosts = { ...likedPosts, [post.poNum]: true };
      setLikedPosts(updatedLikedPosts);
      localStorage.setItem(`likedPosts_${user?.id}`, JSON.stringify(updatedLikedPosts));

      alert("좋아요를 눌렀습니다.");
    } catch (error) {
      console.error("좋아요 처리 중 오류:", error);
      alert("좋아요 처리에 실패했습니다.");
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


