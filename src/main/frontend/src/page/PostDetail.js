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
    const token = localStorage.getItem('token');
  
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
                  <p><strong>{comment.user.id}:</strong> {comment.comment}</p>
                </div>
              ))
            ) : (
              <p> </p>
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
