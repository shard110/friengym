import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';
import styles from './LoginPage.module.css'; // Corrected import for CSS module


function LoginPage() {
  const [id, setId] = useState('');
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      // 서버에 JSON 형식으로 로그인 요청
      const response = await axios.post('/api/login', { id, pwd });
      const { token, user } = response.data; // 서버가 token과 user를 반환한다고 가정

      // 로그인 상태를 업데이트하고 토큰을 저장
      login({ ...user, token });
      navigate('/');
    } catch (error) {
      setError('Login failed. Please check your credentials and try again.');
      console.error('Login failed', error);
    }
  };

  return (
    <div className={styles.LoginPage}>
      <h2 className={styles.heading}>로그인</h2>
      {error && <p className={styles.error}>{error}</p>}
      <input
        type="text"
        value={id}
        onChange={(e) => setId(e.target.value)}
        placeholder="User ID"
        className={styles.input}
      />
      <input
        type="password"
        value={pwd}
        onChange={(e) => setPwd(e.target.value)}
        placeholder="Password"
        className={styles.input}
      />
      <button onClick={handleLogin} className={styles.button}>Login</button>
    </div>
  );
}

export default LoginPage;
