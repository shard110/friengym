import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ManagerBar from './ManagerBar';
import UserList from './UserList'; // UserList 컴포넌트 임포트
import AskList from './AskList'; // AskList 컴포넌트 임포트
import AskDetail from './AskDetail'; // AskDetail 컴포넌트 임포트
import Shop from './Shop';

const AdminHome = () => {
  const [aid, setAid] = useState('');
  const [apwd, setApwd] = useState('');
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 컴포넌트가 마운트될 때 로컬 스토리지에서 토큰 확인
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('http://localhost:8080/api/admin/login', { aid, apwd });
        console.log(response.data);

        if (response.data.success) {
            localStorage.setItem('adminToken', response.data.token);
            setMessage('안녕하세요 관리자님');
            setIsLoggedIn(true);
        } else {
            // 로그인 실패 시 사용자에게 보여줄 메시지
            setMessage('로그인 실패. 아이디와 비밀번호를 확인하세요.');
        }
    } catch (error) {
        console.error(error);
        if (error.response) {
            // 서버가 응답했지만 오류인 경우
            if (error.response.status === 401) { // 401 Unauthorized 처리
                setMessage('로그인 실패. 아이디와 비밀번호를 확인하세요.');
            } else {
                setMessage('서버 오류. 다시 시도하세요.');
            }
        } else {
            // 네트워크 오류 등 서버에 도달하지 못한 경우
            setMessage('서버에 연결할 수 없습니다. 다시 시도하세요.');
        }
    }
  };


  const handleLogout = () => {
    localStorage.removeItem('adminToken'); // 토큰 삭제
    setIsLoggedIn(false); // 로그인 상태 업데이트
    setMessage('로그아웃 되었습니다.'); // 로그아웃 메시지 설정
    setAid(''); // 아이디 초기화
    setApwd(''); // 비밀번호 초기화
  };

  return (
    <div>
      {!isLoggedIn ? (
        <>
          <h1>관리자 로그인</h1>
          <form onSubmit={handleLogin}>
            <div>
              <label htmlFor="aid">아이디:</label>
              <input
                type="text"
                id="aid"
                value={aid}
                onChange={(e) => setAid(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="apwd">비밀번호:</label>
              <input
                type="password"
                id="apwd"
                value={apwd}
                onChange={(e) => setApwd(e.target.value)}
                required
              />
            </div>
            <button type="submit">로그인</button>
          </form>
          {message && <p>{message}</p>}
        </>
      ) : (
        <>
          <ManagerBar onLogout={handleLogout} />
          <Routes>
            <Route path="/user" element={<UserList />} /> {/* UserList 경로 추가 */}
            <Route path="/ask" element={<AskList />} /> {/* 문의글 목록 경로 추가 */}
            <Route path="/ask/:id" element={<AskDetail />} /> {/* 문의글 상세 내용 경로 추가 */}
            <Route path="shop" element={<Shop />} />
          </Routes>
        </>
      )}
    </div>
  );
};

export default AdminHome;
