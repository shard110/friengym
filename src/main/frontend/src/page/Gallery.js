import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import "./Gallery.css"; // 새로 정의된 CSS

const Gallery = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/posts")
      .then((response) => response.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((error) => {
        setError("게시글을 불러오는 데 실패했습니다.");
        setLoading(false);
      });
  }, []);

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
            onClick={() => navigate(`/posts/${post.poNum}`)}  // 게시글 클릭 시 상세 페이지로 이동
            style={{ cursor: "pointer" }}  // 클릭 가능한 스타일 추가
          >
            <div className="user-info">
              {post.user ? (
                <>
                  <img
                    src={post.user.photo || "default-photo-url"}  // 기본 프로필 이미지 설정
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
              <span>👍 {post.likes}</span>
              <span>👁 {post.viewCnt}</span>
              {user?.id === post.user?.id && (
                <div className="action-buttons">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();  // 클릭 이벤트 전파 방지
                      navigate(`/edit-post/${post.poNum}`);
                    }}
                    className="edit-btn"
                  >
                    수정
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();  // 클릭 이벤트 전파 방지
                      fetch(`/posts/${post.poNum}`, { method: "DELETE" });
                      setPosts(posts.filter((p) => p.poNum !== post.poNum)); // 게시글 삭제 후 목록 갱신
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
