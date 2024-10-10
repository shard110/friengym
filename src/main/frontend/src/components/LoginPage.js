import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';
import styles from './LoginPage.module.css';

import logo from '../img/logo.png';

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
      <img src={logo} alt="Logo" className={styles.logo} />
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="아이디를 입력하세요"
          className={styles.input}
        />
      </div>
      <div className={styles.inputContainer}>
        <input
          type="password"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          placeholder="비밀번호를 입력하세요"
          className={styles.input}
        />
      </div>
      <div className={styles.linksContainer}>
        <span onClick={() => navigate('/find-id')} className={styles.link}>아이디 찾기</span>
        <span className={styles.link}>|</span>
        <span onClick={() => navigate('/find-password')} className={styles.link}>비밀번호 찾기</span>
      </div>
      <button onClick={handleLogin} className={styles.loginButton}>Login</button>
    </div>
  );
}

export default LoginPage;
