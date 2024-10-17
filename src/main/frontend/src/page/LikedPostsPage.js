import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Link 추가
import { useAuth } from "../components/AuthContext";
import "./LikedPostsPage.css";

const LikedPostsPage = () => {
  const { user } = useAuth(); // 현재 로그인한 유저 정보
  const [likedPosts, setLikedPosts] = useState([]); // 좋아요한 게시물 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLikedPosts = async () => {
      const token = localStorage.getItem("jwtToken");
      try {
        const response = await axios.get(`/api/posts/liked-posts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLikedPosts(response.data); // 좋아요한 게시물 목록 저장
        setLoading(false); // 로딩 해제
      } catch (error) {
        console.error("좋아요한 게시물 목록을 불러오는 중 오류 발생:", error);
        setError("게시물을 불러오는 데 실패했습니다.");
        setLoading(false); // 로딩 해제
      }
    };

    if (user) {
      fetchLikedPosts();
    } else {
      setLoading(false);
      setError("로그인이 필요합니다.");
    }
  }, [user]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="liked-posts-page">
      <h2>{user.name}님의 좋아요한 게시물</h2>
      <div className="gallery-container">
        {likedPosts.length > 0 ? (
          <div className="likepost-list">
            {likedPosts.map((post) => (
              <div className="post-card" key={post.poNum}>
                <Link to={`/posts/${post.poNum}`}>
                  {/* 이미지나 동영상이 있으면 출력, 없으면 텍스트만 출력 */}
                  {post.fileUrl ? (
                    /\.(mp4|mov)$/i.test(post.fileUrl) ? (
                      <video
                        src={post.fileUrl}
                        controls
                        className="post-video"
                      ></video>
                    ) : (
                      <img
                        src={post.fileUrl}
                        alt={post.poContents}
                        className="post-image"
                      />
                    )
                  ) : (
                    <div className="text-only">
                      <p>{post.poContents}</p>
                    </div>
                  )}
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p>좋아요한 게시글이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

// 여기서 함수가 닫히고 있습니다.

export default LikedPostsPage;
