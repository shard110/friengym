import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './ViewAsk.css'; // CSS 파일 import

const ViewAsk = () => {
  const { anum } = useParams();
  const [ask, setAsk] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAsk = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          throw new Error("로그인이 필요합니다.");
        }

        const response = await axios.get(`/api/asks/${anum}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAsk(response.data);
      } catch (error) {
        console.error("Error fetching ask:", error);
        alert("문의글 조회 중 오류가 발생했습니다.");
      }
    };

    fetchAsk();
  }, [anum]);

  const handleUpdate = () => {
    navigate(`/asks/update/${anum}`);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("정말로 이 문의글을 삭제하시겠습니까?");
    if (confirmDelete) {
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          throw new Error("로그인이 필요합니다.");
        }

        await axios.delete(`/api/asks/${anum}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert("문의글이 삭제되었습니다.");
        navigate("/asks");
      } catch (error) {
        console.error("Error deleting ask:", error);
        alert("문의글 삭제 중 오류가 발생했습니다.");
      }
    }
  };

  const handleBackToList = () => {
    navigate("/asks"); // 게시글 목록 페이지로 이동
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="view-ask-container">
      <h1>문의글 조회</h1>
      {ask ? (
        <table className="view-ask-table">
          <tbody>
            <tr>
              <th colSpan="2" className="view-ask-title">게시글 제목</th>
              <td colSpan="2" className="view-ask-title-content">{ask.atitle}</td>
            </tr>
            <tr>
              <th>작성자</th>
              <td>{ask.user ? ask.user.id : "Unknown"}</td>
              <th>작성일</th>
              <td>{formatDate(ask.aDate)}</td>
            </tr>
            <tr>
              <th colSpan="4">내용</th>
            </tr>
            <tr>
              <td colSpan="4" className="view-ask-content">{ask.acontents}</td>
            </tr>
            {ask.afile && (
              <tr>
                <th>첨부파일</th>
                <td colSpan="3">
                  <a href={`http://localhost:8080${ask.afile}`} target="_blank" rel="noopener noreferrer">파일 보기</a>
                </td>
              </tr>
            )}
            {ask.reply && (
              <tr>
                <th>답변 내용</th>
                <td colSpan="3">{ask.reply}</td>
              </tr>
            )}
          </tbody>
        </table>
      ) : (
        <p>문의글을 불러오는 중입니다...</p>
      )}
      <div className="view-ask-buttons">
        <button onClick={handleBackToList}>목록으로 돌아가기</button>
        <button onClick={handleUpdate}>수정하기</button>
        <button onClick={handleDelete}>삭제하기</button>
      </div>
    </div>
  );
};

export default ViewAsk;
