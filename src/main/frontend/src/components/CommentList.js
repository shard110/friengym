import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthContext"; // 인증 컨텍스트 추가
import style from './CommentList.module.css'; // CSS 모듈 import

export default function CommentList({ poNum }) {
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const [editingCommentNo, setEditingCommentNo] = useState(null); // 수정할 댓글 번호
  const [editedCommentText, setEditedCommentText] = useState(""); // 수정된 댓글 내용
  const { user } = useAuth(); // 인증 정보 가져오기

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const result = await axios.get(
          `http://localhost:8080/posts/${poNum}/comments`
        );
        setComments(result.data);
        console.log("Fetched comments:", result.data); // comments 로그 출력
      } catch (error) {
        setError("Failed to fetch comments.");
      }
    };

    fetchComments();
  }, [poNum]);

  const deleteComment = async (commentNo) => {
    try {
      await axios.delete(
        `http://localhost:8080/posts/${poNum}/comments/${commentNo}`,
        {
          headers: {
            Authorization: `Bearer ${
              user.token || localStorage.getItem("jwtToken")
            }`,
          },
        }
      );
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.commentNo !== commentNo)
      );
    } catch (error) {
      setError("Failed to delete comment.");
      console.error("Error deleting comment:", error); // 오류를 콘솔에 출력
    }
  };

  const startEditing = (comment) => {
    setEditingCommentNo(comment.commentNo);
    setEditedCommentText(comment.comment);
  };

  const cancelEditing = () => {
    setEditingCommentNo(null);
    setEditedCommentText("");
  };

  const handleEditChange = (e) => {
    setEditedCommentText(e.target.value);
  };

  const saveEdit = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8080/posts/${poNum}/comments/${editingCommentNo}`,
        { comment: editedCommentText },
        {
          headers: {
            Authorization: `Bearer ${
              user.token || localStorage.getItem("jwtToken")
            }`,
          },
        }
      );
      const updatedComment = response.data;
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.commentNo === editingCommentNo
            ? { ...comment, comment: updatedComment.comment, modifiedDate: updatedComment.modifiedDate }
            : comment
        )
      );
      cancelEditing();
    } catch (error) {
      setError("Failed to update comment.");
      console.error("Error updating comment:", error); // 오류를 콘솔에 출력
    }
  };

  if (error) return <div className={style.error}>Error: {error}</div>;

  return (
    <div className={style.container}>
      <div className={style.cardBody}>
        <div className={style.cardHeader}>
          {comments.length} 댓글
        </div>
        <ul className={style.listGroup}>
          {comments.map((comment) => (
            <li key={comment.commentNo} className={style.listGroupItem}>
              <div className={style.listGroupItemContent}>
                <div className={style.commentText}>
                  <span style={{ fontSize: "small" }}>
                    {comment.name || "Anonymous"}
                  </span>
                  <span style={{ fontSize: "xx-small" }}>
                    {editingCommentNo === comment.commentNo ? (
                      "Editing..."
                    ) : (
                      <>
                        {comment.modifiedDate || comment.createdDate}
                      </>
                    )}
                  </span>
                </div>
                <div className={style.buttonContainer}>
                  {user && user.id === comment.id && (
                    <>
                      {editingCommentNo === comment.commentNo ? (
                        <>
                          <textarea
                            className={style.textarea}
                            value={editedCommentText}
                            onChange={handleEditChange}
                          />
                          <button
                            className={`${style.button} ${style.saveButton}`}
                            onClick={saveEdit}
                          >
                            저장
                          </button>
                          <button
                            className={`${style.button} ${style.cancelButton}`}
                            onClick={cancelEditing}
                          >
                            취소
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className={`${style.button} ${style.editButton}`}
                            onClick={() => startEditing(comment)}
                          >
                            댓글 수정
                          </button>
                          <button
                            className={`${style.button} ${style.deleteButton}`}
                            onClick={() => deleteComment(comment.commentNo)}
                          >
                            댓글 삭제
                          </button>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className={style.commentText}>
                {comment.comment}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
