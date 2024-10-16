import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 추가
import CreateAsk from '../components/CreateAsk';
import DeleteAsk from '../components/DeleteAsk';
import UpdateAsk from '../components/UpdateAsk';
import ViewAsk from '../components/ViewAsk';

const AskPage = () => {
  const [asks, setAsks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10);
  const [selectedAsk, setSelectedAsk] = useState(null);
  const [mode, setMode] = useState("view");
  const [password, setPassword] = useState("");
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  
  const navigate = useNavigate(); // useNavigate 훅 추가

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

  const handleSelectAsk = async (ask) => {
    setSelectedAsk(ask);
    setIsPasswordVerified(false);
    setMode("view");
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
      } else {
        alert("비밀번호가 일치하지 않습니다.");
      }
    } catch (error) {
      if (error.response) {
        alert("비밀번호가 일치하지 않습니다.");
      }
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
          style={{ margin: "0 5px", backgroundColor: page === i ? "#007bff" : "#ffffff" }}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  const handleFirstPage = () => {
    setPage(1);
  };

  const handleLastPage = () => {
    setPage(totalPages);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div>
      {mode !== "create" && <h1>문의글 목록</h1>}

      {mode === "create" ? (
        <CreateAsk onAskCreated={() => fetchAsks(page)} />
      ) : (
        <>
          {mode === "update" && selectedAsk && isPasswordVerified && (
            <UpdateAsk anum={selectedAsk.anum} onAskUpdated={() => fetchAsks(page)} />
          )}
          {mode === "delete" && selectedAsk && isPasswordVerified && (
            <DeleteAsk anum={selectedAsk.anum} onAskDeleted={() => fetchAsks(page)} />
          )}
          {mode === "view" && selectedAsk && isPasswordVerified && <ViewAsk anum={selectedAsk.anum} />}

          <ul>
            {asks && asks.length > 0 ? (
              asks.map((ask) => (
                <li key={ask.anum} onClick={() => handleSelectAsk(ask)} style={{ cursor: "pointer" }}>
                  <h3>{ask.atitle}</h3>
                  작성자: {ask.user ? ask.user.id : "Unknown"}
                  작성일: {formatDate(ask.aDate)}
                </li>
              ))
            ) : (
              <p>문의글이 없습니다.</p>
            )}
          </ul>

          {selectedAsk && (
            <div>
              <h2>비밀번호를 입력하세요</h2>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button onClick={handleVerifyPassword}>비밀번호 확인</button>
            </div>
          )}

          <div>
            <button onClick={handleFirstPage} disabled={page === 1}>
              {"<<"} 첫 페이지
            </button>
            <button onClick={() => setPage(Math.max(page - 1, 1))} disabled={page === 1}>
              이전
            </button>
            {renderPageButtons()}
            <button onClick={() => setPage(Math.min(page + 1, totalPages))} disabled={page === totalPages}>
              다음
            </button>
            <button onClick={handleLastPage} disabled={page === totalPages}>
              마지막 페이지 {">>"}
            </button>
          </div>
        </>
      )}

      {/* 문의글 작성하기 버튼 추가, AskPage에서만 보이도록 설정 */}
      {mode !== "create" && (
        <button onClick={() => navigate('/createa')}>문의글 작성하기</button> // 수정된 부분
      )}
    </div>
  );
};

export default AskPage;
