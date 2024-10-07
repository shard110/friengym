import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
