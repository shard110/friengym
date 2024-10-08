import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import PostSideBar from "../components/PostSideBar";
import ReportPopup from "../components/ReportPopup"; // 신고 팝업 추가
import YouTubePreview from "../components/YouTubePreview";
import "./Gallery.css";

const Gallery = () => {
  const [posts, setPosts] = useState([]); // 게시글 목록 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [isReportOpen, setReportOpen] = useState(false); // 신고 팝업 상태
  const [selectedPost, setSelectedPost] = useState(null); // 선택된 게시글
  const { user } = useAuth(); // 인증된 사용자 정보 가져오기
  const navigate = useNavigate(); // 페이지 이동을 위한 훅

  useEffect(() => {
    fetch("api/posts") // Spring Boot 백엔드의 엔드포인트에 맞게 수정 필요
      .then((response) => response.json())
      .then((data) => {
        setPosts(data); // 게시글 데이터 설정
        setLoading(false); // 로딩 상태 해제
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        setError("게시글을 불러오는 데 실패했습니다."); // 에러 메시지 설정
        setLoading(false);
      });
  }, []);

  const handleReportClick = (post) => {
    setSelectedPost(post);
    setReportOpen(true);
  };

  const handleReportSubmit = (reason) => {
    const token = localStorage.getItem("jwtToken");
  
    fetch(`/api/posts/${selectedPost.poNum}/report`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded", // Content-Type 수정
      },
      body: new URLSearchParams({ reason }), // 파라미터 형식으로 수정
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text || "신고 처리에 실패했습니다.");
          });
        }
        alert("신고가 접수되었습니다.");
        setReportOpen(false);
      })
      .catch((error) => {
        console.error("신고 처리 중 오류:", error);
        alert(`신고 처리 중 오류가 발생했습니다: ${error.message}`);
      });
  };
  
  

  const likedPostsKey = `likedPosts_${user?.id}`;
  const likedPosts = JSON.parse(localStorage.getItem(likedPostsKey)) || {};

  const hasLiked = (postId) => likedPosts[postId];

  const handleLike = (post) => {
    const token = localStorage.getItem("jwtToken");

    if (!hasLiked(post.poNum)) {
      fetch(`/api/posts/${post.poNum}/like`, {
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

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="gallery-layout">
      <PostSideBar />
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
              onClick={() => navigate(`/posts/${post.poNum}`)}
              style={{ cursor: "pointer" }}
            >
              <div className="user-info">
                {post.user ? (
                  <>
                    <img
                      src={post.user.photo || "default-photo-url"}
                      alt={post.user.id}
                      className="user-photo"
                    />
                    <span>{post.user.id}</span>
                       {/* 신고 버튼 */}
                       <button
                      className="report-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReportClick(post);
                      }}
                    >
                      신고
                    </button>
                  </>
                ) : (
                  <span>Unknown User</span>
                  
                )}
              </div>

              {post.fileUrl && (
                <div className="post-media">
                  {/\.(jpeg|jpg|png|gif)$/i.test(post.fileUrl) ? (
                    <img src={post.fileUrl} alt="Uploaded" className="post-image" />
                  ) : /\.(mp4|mov)$/i.test(post.fileUrl) ? (
                    <video controls className="post-video">
                      <source src={post.fileUrl} type="video/mp4" />
                    </video>
                  ) : (
                    <a href={post.fileUrl} target="_blank" rel="noopener noreferrer">
                      파일 보기
                    </a>
                  )}
                </div>
              )}

              <div className="post-content">{post.poContents}</div>

              {/* 유튜브 링크가 있는 경우 YouTubePreview 컴포넌트 사용 */}
              {post.poContents.match(/https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/[^\s]+/g) && (
                post.poContents
                  .match(/https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/[^\s]+/g)
                  .map((url, index) => (
                    <YouTubePreview key={index} url={url} />
                  ))
              )}

              <div className="hashtags">
                {post.hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="hashtag"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/hashtag/${tag}`);
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="post-actions">
                <button
                  className="like-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(post);
                  }}
                  disabled={hasLiked(post.poNum)}
                >
                  👍 {post.likes}
                </button>

                <span>👁 {post.viewCnt}</span>

                {user?.id === post.user?.id && (
                  <div className="action-buttons">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/edit-post/${post.poNum}`);
                      }}
                      className="edit-btn"
                    >
                      수정
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const token = localStorage.getItem("jwtToken");

                        fetch(`/api/posts/${post.poNum}`, {
                          method: "DELETE",
                          headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                          },
                        })
                          .then((response) => {
                            if (!response.ok) {
                              throw new Error("게시글 삭제에 실패했습니다.");
                            }
                            setPosts(posts.filter((p) => p.poNum !== post.poNum));
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
        {/* 신고 팝업 */}
        <ReportPopup
        isOpen={isReportOpen}
        onClose={() => setReportOpen(false)}
        onSubmit={handleReportSubmit}
      />
    </div>
  );
};

export default Gallery;