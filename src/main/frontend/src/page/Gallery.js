import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import "./Gallery.css"; // 새로 정의된 CSS

const Gallery = () => {
  const [posts, setPosts] = useState([]); // 게시글 목록 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const { user } = useAuth(); // 인증된 사용자 정보 가져오기
  const navigate = useNavigate(); // 페이지 이동을 위한 훅

  useEffect(() => {
    fetch("/posts")
      .then((response) => response.json())
      .then((data) => {
        setPosts(data); // 게시글 데이터 설정
        setLoading(false); // 로딩 상태 해제
      })
      .catch((error) => {
        setError("게시글을 불러오는 데 실패했습니다."); // 에러 메시지 설정
        setLoading(false);
      });
  }, []);


// 사용자별로 likedPosts 가져오기
const likedPostsKey = `likedPosts_${user?.id}`;
const likedPosts = JSON.parse(localStorage.getItem(likedPostsKey)) || {};

// 좋아요 여부 확인 함수
const hasLiked = (postId) => likedPosts[postId];

// 좋아요 처리 함수
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
      .then((response) => response.json())
      .then((updatedPost) => {
        setPosts((prevPosts) =>
          prevPosts.map((p) => (p.poNum === updatedPost.poNum ? updatedPost : p))
        );

        // 사용자별로 likedPosts 업데이트
        const updatedLikedPosts = { ...likedPosts, [post.poNum]: true };
        localStorage.setItem(likedPostsKey, JSON.stringify(updatedLikedPosts));
      })
      .catch((error) => {
        console.error("좋아요 처리 중 오류:", error);
        alert("좋아요 처리에 실패했습니다.");
      });
  } else {
    alert("이미 이 게시글에 좋아요를 눌렀습니다.");
  }
};



  
  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="gallery">
      <div className="create-post">
        <button onClick={() => navigate("/create-post")} className="create-btn">
          + 글 작성
        </button>
      </div>

      {posts.length > 0 ? (
        posts.map((post) => (
          <div
            className="post-card"
            key={post.poNum}
            onClick={() => navigate(`/posts/${post.poNum}`)} // 게시글 클릭 시 상세 페이지로 이동
            style={{ cursor: "pointer" }} // 클릭 가능한 스타일 추가
          >
            <div className="user-info">
              {post.user ? (
                <>
                  <img
                    src={post.user.photo || "default-photo-url"} // 기본 프로필 이미지 설정
                    alt={post.user.id}
                    className="user-photo"
                  />
                  <span>{post.user.id}</span>
                </>
              ) : (
                <span>Unknown User</span>
              )}
            </div>

            {post.fileUrl && (
              <div className="post-media">
                {post.fileUrl.endsWith(".mp4") ? (
                  <video controls className="post-video">
                    <source src={post.fileUrl} type="video/mp4" />
                  </video>
                ) : (
                  <img src={post.fileUrl} alt="Uploaded" className="post-image" />
                )}
              </div>
            )}

            <div className="post-content">{post.poContents}</div>

            <div className="post-actions">
              {/* 좋아요 버튼 */}
              <button
                className="like-btn"
                onClick={() => handleLike(post)}
                disabled={hasLiked(post.poNum)} // 이미 좋아요를 누른 경우 버튼 비활성화
              >
                👍 {post.likes}
              </button>
              <span>👁 {post.viewCnt}</span>

              {user?.id === post.user?.id && (
                <div className="action-buttons">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // 클릭 이벤트 전파 방지
                      navigate(`/edit-post/${post.poNum}`);
                    }}
                    className="edit-btn"
                  >
                    수정
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // 클릭 이벤트 전파 방지

                      // JWT 토큰 가져오기 (예시: localStorage에서 가져옴)
                      const token = localStorage.getItem('jwtToken');

                      fetch(`/posts/${post.poNum}`, {
                        method: "DELETE",
                        headers: {
                          'Authorization': `Bearer ${token}`,  // Authorization 헤더 추가
                          'Content-Type': 'application/json'
                        }
                      })
                        .then((response) => {
                          if (!response.ok) {
                            throw new Error("게시글 삭제에 실패했습니다.");
                          }
                          setPosts(posts.filter((p) => p.poNum !== post.poNum)); // 게시글 삭제 후 목록 갱신
                        })
                        .catch((error) => {
                          console.error("Error deleting post:", error);
                          alert("게시글 삭제에 실패했습니다.");
                        });
                    }}
                    className="delete-btn"
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <p>게시물이 없습니다.</p>
      )}
    </div>
  );
};

export default Gallery;
