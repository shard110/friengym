import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Router import
import ManagerBar from './ManagerBar';
import UserList from './UserList'; // UserList import

const AdminHome = () => {
  const [aid, setAid] = useState('');
  const [apwd, setApwd] = useState('');
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/admin/login', { aid, apwd });
      if (response.data.success) {
        setMessage('안녕하세요 관리자님');
        setIsLoggedIn(true);
      } else {
        setMessage('로그인 실패. 아이디와 비밀번호를 확인하세요.');
      }
    } catch (error) {
      setMessage('서버 오류. 다시 시도하세요.');
    }
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
            <ManagerBar />
            <Routes>
              <Route path="/user" element={<UserList />} /> {/* 유저 목록 페이지 */}
              {/* 다른 라우트 추가 가능 */}
            </Routes>
        </>
      )}
    </div>
  );
};

export default AdminHome;
