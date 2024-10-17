import axios from "axios";
import React, { useEffect, useState } from "react";

const LikeButton = ({ post, likedPosts, setLikedPosts, setPosts, user }) => {
  const [isLiked, setIsLiked] = useState(likedPosts[post.poNum] || false);
  const userId = user?.id;
  const likedPostsKey = `likedPosts_${userId}`;

  useEffect(() => {
    setIsLiked(likedPosts[post.poNum] || false);
  }, [likedPosts, post.poNum]);

  const handleLike = async () => {

     if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }
  

    const token = localStorage.getItem("jwtToken");

    if (isLiked) {
      // 좋아요 취소 처리
      handleUnlike(post, token);
      return;
    }

    // UI 즉시 업데이트 (Optimistic UI)
    setPosts((prevPosts) =>
      prevPosts.map((p) =>
        p.poNum === post.poNum ? { ...p, likes: p.likes + 1 } : p
      )
    );

    // 로컬 스토리지 업데이트
    const updatedLikedPosts = { ...likedPosts, [post.poNum]: true };
    localStorage.setItem(likedPostsKey, JSON.stringify(updatedLikedPosts));
    setLikedPosts(updatedLikedPosts);

    try {
      // 서버에 좋아요 요청 전송
      await axios.post(`/api/posts/${post.poNum}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsLiked(true);  // 상태 업데이트
    } catch (error) {
      const errorMessage = error.response?.data;
      if (errorMessage === "이미 이 게시글에 좋아요를 눌렀습니다.") {
        // 이미 좋아요를 누른 경우에는 오류를 표시하지 않고 상태를 업데이트
        setIsLiked(true);
        // 필요하면 추가 로직을 넣을 수 있습니다.
      } else {
        console.error("좋아요 처리 중 오류:", error);

      // 서버 오류 시, 좋아요 상태 롤백
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.poNum === post.poNum ? { ...p, likes: p.likes - 1 } : p
        )
      );
      const updatedLikedPosts = { ...likedPosts };
      delete updatedLikedPosts[post.poNum];
      localStorage.setItem(likedPostsKey, JSON.stringify(updatedLikedPosts));
      setLikedPosts(updatedLikedPosts);
      alert("좋아요 처리에 실패했습니다.");
    }
  }
  };

  const handleUnlike = async (post, token) => {
    // UI 즉시 업데이트 (Optimistic UI)
    setPosts((prevPosts) =>
      prevPosts.map((p) =>
        p.poNum === post.poNum ? { ...p, likes: p.likes - 1 } : p
      )
    );

    // 로컬 스토리지에서 좋아요 취소
    const updatedLikedPosts = { ...likedPosts };
    delete updatedLikedPosts[post.poNum];
    localStorage.setItem(likedPostsKey, JSON.stringify(updatedLikedPosts));
    setLikedPosts(updatedLikedPosts);

    try {
      // 서버에 좋아요 취소 요청 전송
      await axios.delete(`/api/posts/${post.poNum}/like`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsLiked(false);  // 상태 업데이트
    } catch (error) {
      console.error("좋아요 취소 처리 중 오류:", error);

      // 서버 오류 시, 좋아요 상태 롤백
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.poNum === post.poNum ? { ...p, likes: p.likes + 1 } : p
        )
      );
      updatedLikedPosts[post.poNum] = true;
      localStorage.setItem(likedPostsKey, JSON.stringify(updatedLikedPosts));
      setLikedPosts(updatedLikedPosts);

      alert("좋아요 취소에 실패했습니다.");
    }
  };


  return (
    <button
    className="like-btn"
    onClick={(e) => {
      e.stopPropagation();
      handleLike();
    }}
    disabled={false}
  >
    {isLiked ? "💔" : "👍"} {post.likes}
  </button>
  );
};


export default LikeButton;
