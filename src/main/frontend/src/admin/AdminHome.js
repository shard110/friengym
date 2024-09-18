import React, { useState } from 'react';
import axios from 'axios';

const AdminHome = () => {
  const [aid, setAid] = useState('');
  const [apwd, setApwd] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('http://localhost:8080/api/admin/login', { aid, apwd });
      if (response.data.success) {
        setMessage('안녕하세요 관리자님');
      } else {
        setMessage('로그인 실패. 아이디와 비밀번호를 확인하세요.');
      }
    } catch (error) {
      setMessage('서버 오류. 다시 시도하세요.');
    }
  };

  return (
    <div>
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
    </div>
  );
};

export default AdminHome;
