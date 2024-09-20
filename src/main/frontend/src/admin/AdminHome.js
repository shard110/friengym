import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ManagerBar from './ManagerBar';
import UserList from './UserList'; // UserList 컴포넌트 임포트

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
        setMessage('로그인 실패. 아이디와 비밀번호를 확인하세요.');
      }
    } catch (error) {
      console.error(error);
      setMessage('서버 오류. 다시 시도하세요.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsLoggedIn(false);
    setMessage('로그아웃 되었습니다.');
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
          </Routes>
        </>
      )}
    </div>
  );
};

export default AdminHome;
