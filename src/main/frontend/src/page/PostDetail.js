import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AddComment from "../components/AddComment"; // AddComment 컴포넌트 임포트
import { useAuth } from "../components/AuthContext"; // 사용자 인증 정보 사용
import CommentsList from "../components/CommentsList"; // CommentsList 컴포넌트 임포트
import ReportPopup from "../components/ReportPopup"; // 신고 팝업 추가
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
  const [isReportOpen, setReportOpen] = useState(false); // 신고 팝업 상태
  const navigate = useNavigate(); // 페이지 이동을 위한 훅

  // 게시글과 댓글 데이터를 가져오는 useEffect
  useEffect(() => {
    // 게시글 데이터 가져오기
    fetch(`/api/posts/${poNum}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("게시글을 불러오는 데 실패했습니다.");
        }
        return response.json();
      })
      .then((data) => {
        setPost(data);
        setComments(data.comments || []); // 댓글 설정
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching post:", error);
        setError(error.message);
        setLoading(false);
      });
  }, [poNum]);

  const handleDeletePost = () => {
    if (window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      const token = localStorage.getItem('jwtToken');
  
      fetch(`/api/posts/${post.poNum}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            alert('게시글이 삭제되었습니다.');
            navigate('/'); // 삭제 후 메인 페이지로 이동
          } else {
            return response.text().then((text) => {
              throw new Error(`Server Error: ${text}`);
            });
          }
        })
        .catch((error) => {
          console.error('게시글 삭제 중 오류:', error);
          setError('게시글을 삭제하는 데 실패했습니다.');
        });
    }
  };
  
  const handleEditPost = () => {
    navigate(`/posts/edit/${post.poNum}`);
  };

  // 신고 제출 핸들러
  const handleReportSubmit = (reason) => {
    const token = localStorage.getItem("jwtToken");
    fetch(`/api/posts/${post.poNum}/report`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reason }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("신고 처리에 실패했습니다.");
        }
        alert("신고가 접수되었습니다.");
        setReportOpen(false);
      })
      .catch((error) => {
        console.error("신고 처리 중 오류:", error);
        alert("신고 처리에 실패했습니다.");
      });
  };

  // 댓글 추가 핸들러
  const handleAddComment = (commentText, parentId = null) => {
    const token = localStorage.getItem('jwtToken');

    const commentPayload = {
      comment: commentText,
      parentId: parentId, // 부모 댓글 ID
    };

    fetch(`/api/posts/${poNum}/comments`, {
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
        if (parentId) {
          // 답글인 경우
          setComments((prevComments) =>
            prevComments.map((comment) =>
              comment.commentNo === parentId
                ? { ...comment, replies: [...(comment.replies || []), newCommentData] }
                : comment
            )
          );
        } else {
          // 최상위 댓글인 경우
          setComments([...comments, newCommentData]);
        }
      })
      .catch((error) => {
        console.error("댓글 추가 중 오류:", error);
        setError("댓글을 추가하는 데 실패했습니다.");
      });
  };

  // 댓글 수정 핸들러
  const handleEditComment = (commentId, editedText) => {
    const token = localStorage.getItem('jwtToken');

    fetch(`/api/posts/${poNum}/comments/${commentId}`, {
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

    fetch(`/api/posts/${poNum}/comments/${commentId}`, {
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
          <div className="user-info">
            {post.userId ? (
              <>
                <img
                  src={post.userPhoto || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                  alt={post.userId}
                  className="user-photo"
                />
                <span>{post.userId}</span>
                {/* 신고 버튼 */}
                <button
                  className="report-btn"
                  onClick={() => setReportOpen(true)}
                >
                  신고
                </button>
              </>
            ) : (
              <span>Unknown User</span>
            )}
          </div>

          {user?.id === post.userId && (
          <div className="post-actions">
            <button onClick={handleEditPost}>수정</button>
            <button onClick={handleDeletePost}>삭제</button>
          </div>
          )}

          <br />
          <h2>{post.poContents}</h2>
          <br />

          {/* 유튜브 링크가 있는 경우 YouTubePreview 컴포넌트 사용 */}
          {post.poContents.match(/https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/[^\s]+/g) &&
            post.poContents
              .match(/https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/[^\s]+/g)
              .map((url, index) => (
                <YouTubePreview key={index} url={url} />
              ))
          }

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


   


        <div className="post-stats">
         <p>
            👁 {post.viewCnt}  👍 {post.likes}
          </p>
         </div>

          
    

          {/* 댓글 목록 */}
          <div className="comments-section">
            <h3>댓글</h3>
            <CommentsList
              comments={comments}
              userId={user?.id}
              onEditComment={handleEditComment}
              onDeleteComment={handleDeleteComment}
              onAddComment={handleAddComment}
            />
          </div>

          {/* 댓글 작성 폼 */}
          {user && (
            <AddComment onAdd={handleAddComment} />
          )}

          {/* 신고 팝업 */}
          <ReportPopup
            isOpen={isReportOpen}
            onClose={() => setReportOpen(false)}
            onSubmit={handleReportSubmit}
          />
        </div>
      ) : (
        <p>게시글을 찾을 수 없습니다.</p>
      )}
    </div>
  );
};

export default PostDetail;
