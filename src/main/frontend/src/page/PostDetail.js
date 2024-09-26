// src/components/PostDetail.js

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import AddComment from "../components/AddComment"; // AddComment 컴포넌트 임포트
import { useAuth } from "../components/AuthContext"; // 사용자 인증 정보 사용
import CommentsList from "../components/CommentsList"; // CommentsList 컴포넌트 임포트
import YouTubePreview from "../components/YouTubePreview"; // YouTubePreview 컴포넌트 임포트
import "./PostDetail.css"; // 스타일 정의

const PostDetail = () => {
  const isFirstRender = useRef(true);
  const { poNum } = useParams();
  const { user } = useAuth();  // 현재 로그인한 사용자 정보 가져오기
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 게시글과 댓글 데이터를 가져오는 useEffect
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;

      // 게시글 데이터 가져오기
      fetch(`/posts/${poNum}`)
        .then((response) => response.json())
        .then((data) => {
          setPost(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching post:", error);
          setError("게시글을 불러오는 데 실패했습니다.");
          setLoading(false);
        });

      // 댓글 데이터 가져오기
      fetch(`/posts/${poNum}/comments`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);  // 댓글 데이터를 출력하여 user 정보 확인
          setComments(data);
        })
        .catch((error) => {
          console.error("Error fetching comments:", error);
          setError("댓글을 불러오는 데 실패했습니다.");
        });
    }
  }, [poNum]);

  // 댓글 추가 핸들러 (텍스트만 사용)
  const handleAddComment = (commentText) => {
    const token = localStorage.getItem('jwtToken');

    const commentPayload = {
      comment: commentText,
    };

    fetch(`/posts/${poNum}/comments`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json', // JSON 형식으로 전송
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(commentPayload),
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
      .then((newCommentData) => {
        setComments([...comments, newCommentData]);
      })
      .catch((error) => {
        console.error("댓글 추가 중 오류:", error);
        setError("댓글을 추가하는 데 실패했습니다.");
      });
  };

  // 댓글 수정 핸들러
  const handleEditComment = (commentId, editedText) => {
    const token = localStorage.getItem('jwtToken');

    fetch(`/posts/${poNum}/comments/${commentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ comment: editedText }),
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
      .then((updatedComment) => {
        setComments(comments.map((comment) =>
          comment.commentNo === commentId ? updatedComment : comment
        ));
      })
      .catch((error) => {
        console.error("댓글 수정 중 오류:", error);
        setError("댓글을 수정하는 데 실패했습니다.");
      });
  };

  // 댓글 삭제 핸들러
  const handleDeleteComment = (commentId) => {
    const token = localStorage.getItem('jwtToken');

    fetch(`/posts/${poNum}/comments/${commentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          setComments(comments.filter((comment) => comment.commentNo !== commentId));
        } else {
          return response.text().then((text) => {
            throw new Error(`Server Error: ${text}`);
          });
        }
      })
      .catch((error) => {
        console.error("댓글 삭제 중 오류:", error);
        setError("댓글을 삭제하는 데 실패했습니다.");
      });
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="post-detail">
      {post ? (
        <div>
          {/* 사용자 정보는 <p> 태그 대신 <div>로 변경 */}
          <div className="user-info">
            {post.user ? (
              <>
                <img
                  src={post.user.photo || "default-photo-url"}
                  alt={post.user.id}
                  className="user-photo"
                />
                <span>{post.user.id}</span>
              </>
            ) : (
              <span>Unknown User</span>
            )}
          </div>
          <br />
          <h2>{post.poContents}</h2>
          <br />

          {/* 유튜브 링크가 있는 경우 YouTubePreview 컴포넌트 사용 */}
          {post.poContents.match(/https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/[^\s]+/g) && (
            post.poContents
              .match(/https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/[^\s]+/g)
              .map((url, index) => (
                <YouTubePreview key={index} url={url} />
              ))
          )}

          {/* 파일이 존재하는 경우에만 미디어 파일 표시 */}
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

          <p>👁 {post.viewCnt}  👍 {post.likes}</p>

          {/* 댓글 목록 */}
          <div className="comments-section">
            <h3>댓글</h3>
            <CommentsList
              comments={comments}
              userId={user?.id}
              onEditComment={handleEditComment}
              onDeleteComment={handleDeleteComment}
            />
          </div>

          {/* 댓글 작성 폼 */}
          {user && (
            <AddComment onAdd={handleAddComment} />
          )}

        </div>
      ) : (
        <p>게시글을 찾을 수 없습니다.</p>
      )}
    </div>
  );
};

export default PostDetail;
