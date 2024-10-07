import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';
import styles from './LoginPage.module.css';

function LoginPage() {
  const [id, setId] = useState('');
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      const response = await axios.post('/api/login', { id, pwd });
      const { token, user } = response.data;
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
      <button onClick={() => navigate('/find-id')} className={styles.button}>아이디 찾기</button> {/* 수정된 버튼 경로 */}
    </div>
  );
}

export default LoginPage;
