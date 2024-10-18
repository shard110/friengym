import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import styles from './LoginPage.module.css';

import logo from '../img/logo_friengym.svg';

function LoginPage() {
  const [id, setId] = useState('');
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    try {

      console.log("ID:", id);
      console.log("Password:", pwd);

      if (!id || !pwd) {
        setError('ID와 비밀번호를 모두 입력하세요.');
        return;
      }

      // `AuthContext`의 `login` 함수 호출
      await login({ id, pwd });
      navigate('/');  // 로그인 성공 후 메인 페이지로 이동

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
      
      <div className={styles.orContainer}>
        <hr className={styles.orLine} />
        <span className={styles.orText}>또는</span>
        <hr className={styles.orLine} />
      </div>

      <div>
        <span className={styles.signUpText}>아직 계정이 없으신가요?</span>
        <span onClick={() => navigate('/register')} className={styles.signUpLink}>회원가입</span>
      </div>
    </div>
  );
}
export default LoginPage;
