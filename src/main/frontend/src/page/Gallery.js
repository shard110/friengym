import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./Gallery.css"; // 새로 정의된 CSS

const Gallery = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/posts")
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
          <div className="post" key={post.id}>
            <div className="post-header">
              <img
                src={post.user.photo}
                alt={post.user.id}
                className="post-avatar"
              />
              <div className="post-user">
                <span>{post.user.id}</span>
              </div>
            </div>
            <div className="post-content">{post.poContents}</div>
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
            <div className="post-actions">
              <span>👍 {post.likes}</span>
              <span>👁 {post.viewCnt}</span>
              {user?.userId === post.user.id && (
                <div className="action-buttons">
                  <button
                    onClick={() => navigate(`/edit-post/${post.id}`)}
                    className="edit-btn"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => {
                      fetch(`/api/posts/${post.id}`, { method: "DELETE" });
                      setPosts(posts.filter((p) => p.id !== post.id));
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
