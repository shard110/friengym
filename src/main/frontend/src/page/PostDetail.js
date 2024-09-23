import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../components/AuthContext"; // 사용자 인증 정보 사용
import "./PostDetail.css"; // 스타일 정의

const PostDetail = () => {
  const { poNum } = useParams();
  const { user } = useAuth();  // 현재 로그인한 사용자 정보 가져오기
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState(""); // 새 댓글 상태
  const [editingCommentId, setEditingCommentId] = useState(null); // 수정 중인 댓글 ID
  const [editedComment, setEditedComment] = useState(""); // 수정할 댓글 내용


  useEffect(() => {
    fetch(`/posts/${poNum}`)
      .then((response) => response.json())
      .then((data) => {
        setPost(data);
        setLoading(false);
      })
      .catch((error) => {
        setError("게시글을 불러오는 데 실패했습니다.");
        setLoading(false);
      });

    fetch(`/posts/${poNum}/comments`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);  // 댓글 데이터를 출력하여 user 정보 확인
        setComments(data);
      })
      .catch((error) => {
        setError("댓글을 불러오는 데 실패했습니다.");
      });
  }, [poNum]);

  // 댓글 추가 핸들러
  const handleAddComment = () => {
    if (!newComment.trim()) return;
  
    // localStorage에서 JWT 토큰 가져오기
    const token = localStorage.getItem('jwtToken');
  
    if (!token) {
      setError("로그인이 필요합니다.");
      return;
    }
  
    fetch(`/posts/${poNum}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,  // JWT 토큰을 Authorization 헤더에 추가
      },
      body: JSON.stringify({
        comment: newComment,
      }),
    })
      .then((response) => response.json())
      .then((newComment) => {
        setComments([...comments, newComment]); // 댓글 목록 갱신
        setNewComment(""); // 입력 필드 초기화
      })
      .catch((error) => {
        setError("댓글을 추가하는 데 실패했습니다.");
      });
  };
  

  // 댓글 수정 핸들러
  const handleEditComment = (commentId) => {
    const token = localStorage.getItem('jwtToken');
  
    fetch(`/posts/${poNum}/comments/${commentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ comment: editedComment }),
    })
      .then((response) => response.json())
      .then((updatedComment) => {
        setComments(comments.map((comment) =>
          comment.commentNo === commentId ? updatedComment : comment
        ));
        setEditingCommentId(null);
      })
      .catch((error) => {
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
          throw new Error("댓글 삭제에 실패했습니다.");
        }
      })
      .catch((error) => {
        setError("댓글을 삭제하는 데 실패했습니다.");
      });
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="post-detail">
      {post ? (
        <div>
         
          <p>작성자: {post.user ? post.user.id : "Unknown"}</p> <br></br>
        
           <h2>{post.poContents}</h2> <br></br>

         {/* 파일이 존재하는 경우에만 미디어 파일 표시 */}
         {post.fileUrl && (
            <div className="post-media">
              {post.fileUrl.endsWith(".mp4") ? (
                <video controls>
                  <source src={post.fileUrl} type="video/mp4" />
                </video>
              ) : (
                <img src={post.fileUrl} alt="Uploaded" />
              )}
            </div>
          )}


          <p>👁 {post.viewCnt}  👍 {post.likes}</p>

          {/* 댓글 목록 */}
          <div className="comments-section">
            <h3>댓글</h3>
            {comments.length > 0 ? (
              comments.map((comment) => (
              <div className="comment" key={comment.commentNo}>
                {/* 댓글 작성자의 프로필 사진과 댓글 내용 표시 */}
              <div className="comment-user-info">
              <img src={comment.photo || "default-photo-url"} alt={comment.id} className="comment-user-photo" />
              {editingCommentId === comment.commentNo ? (
                      <>
                        <textarea
                          value={editedComment}
                          onChange={(e) => setEditedComment(e.target.value)}
                        />
                        <button onClick={() => handleEditComment(comment.commentNo)}>수정</button>
                        <button onClick={() => setEditingCommentId(null)}>취소</button>
                      </>
                    ) : (
                      <>
                        <span> : {comment.comment}
                        {user?.id === comment.id && (
                          <div className="comment-actions">
                            <button onClick={() => {
                              setEditingCommentId(comment.commentNo);
                              setEditedComment(comment.comment);
                            }}>수정</button>
                            <button onClick={() => handleDeleteComment(comment.commentNo)}>삭제</button>
                          </div>
                        )}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>댓글이 없습니다.</p>
            )}
          </div>


          {/* 댓글 작성 폼 */}
          {user && (
            <div className="add-comment">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글을 입력하세요"
              />
              <button onClick={handleAddComment}>댓글 추가</button>
            </div>
          )}
        </div>
      ) : (
        <p>게시글을 찾을 수 없습니다.</p>
      )}
    </div>
  );
};

export default PostDetail;
