import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import './AskPage.css';

const AskPage = () => {
  const navigate = useNavigate(); 
  const [asks, setAsks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10);
  const [selectedAsk, setSelectedAsk] = useState(null);
  const [password, setPassword] = useState("");
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);

  useEffect(() => {
    fetchAsks(page);
  }, [page]);

  const fetchAsks = async (page) => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        throw new Error("로그인이 필요합니다.");
      }
      const response = await axios.get(`/api/asks?page=${page - 1}&size=${pageSize}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAsks(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching asks:", error);
    }
  };

  const handleSelectAsk = (ask) => {
    setSelectedAsk(ask);
    setIsPasswordVerified(false);
  };

  const handleVerifyPassword = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        throw new Error("로그인이 필요합니다.");
      }
      const response = await axios.post('/api/asks/check-password', {
        anum: selectedAsk.anum,
        password: password,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setIsPasswordVerified(true);
        navigate(`/asks/view/${selectedAsk.anum}`);
      } else {
        alert("비밀번호가 일치하지 않습니다.");
      }
    } catch (error) {
      alert("비밀번호가 일치하지 않습니다.");
    }
  };

  const renderPageButtons = () => {
    const buttons = [];
    const startPage = Math.floor((page - 1) / 10) * 10 + 1;
    const endPage = Math.min(startPage + 9, totalPages);

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={page === i ? "active-page-button" : "page-button"}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <div className="ask-page">
      <h1>문의글 목록</h1>

      <table>
        <thead>
          <tr>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>
          {asks && asks.length > 0 ? (
            asks.map((ask) => (
              <tr key={ask.anum} onClick={() => handleSelectAsk(ask)} style={{ cursor: "pointer" }}>
                <td>{ask.atitle}</td>
                <td>{ask.userId ? ask.userId : "Unknown"}</td>
                <td>{new Date(ask.adate).toLocaleString("ko-KR")}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">문의글이 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>

      {selectedAsk && !isPasswordVerified && (
        <div className="password-section">
          <h2>비밀번호를 입력하세요</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="password-button" onClick={handleVerifyPassword}>비밀번호 확인</button>
        </div>
      )}

      <div className="pagination">
        <button onClick={() => setPage(1)} disabled={page === 1}>{"<<"} 첫 페이지</button>
        <button onClick={() => setPage(Math.max(page - 1, 1))} disabled={page === 1}>이전</button>
        {renderPageButtons()}
        <button onClick={() => setPage(Math.min(page + 1, totalPages))} disabled={page === totalPages}>다음</button>
        <button onClick={() => setPage(totalPages)} disabled={page === totalPages}>마지막 페이지 {">>"}</button>
      </div>

      <Link to="/createa">
        <div className="create-button-container">
          <button className="create-button">문의글 작성하기</button>
        </div>
      </Link>
    </div>
  );
};

export default AskPage;
