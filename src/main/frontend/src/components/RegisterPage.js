import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './RegisterPage.module.css';
import logo from '../img/logo.png'; // 경로는 실제 파일 위치에 맞게 조정
import googleIcon from '../img/google.png'; // 구글 아이콘 경로
import kakaoIcon from '../img/kakao.png'; // 카카오톡 아이콘 경로

function RegisterPage() {
  const [id, setId] = useState('');
  const [pwd, setPwd] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [sex, setSex] = useState('');
  const [email, setEmail] = useState(''); // 이메일 상태 추가
  const [error, setError] = useState('');
  const [idError, setIdError] = useState('');
  const [idSuccess, setIdSuccess] = useState('');
  const [isIdAvailable, setIsIdAvailable] = useState(true);
  const navigate = useNavigate();

  const checkIdAvailability = async () => {
    if (id.length > 0) {
      try {
        const response = await axios.get(`/api/check-id/${id}`);
        if (response.data) {
          setIsIdAvailable(true);
          setIdError('');
          setIdSuccess('사용할 수 있는 아이디입니다.');
        } else {
          setIsIdAvailable(false);
          setIdError('ID가 이미 사용 중입니다.');
          setIdSuccess('');
        }
      } catch (error) {
        setIdError('ID 중복 확인 중 오류가 발생했습니다.');
        setIdSuccess('');
        console.error('ID 중복 확인 중 오류 발생:', error);
      }
    } else {
      setIdError('ID는 빈 칸일 수 없습니다.');
      setIsIdAvailable(false);
      setIdSuccess('');
    }
  };

  const handleRegister = async () => {
    if (!isIdAvailable) {
      setError('회원가입 전 ID 중복 확인을 해주세요.');
      return;
    }

    try {
      const response = await axios.post('/api/register', {
        id,
        pwd,
        name,
        phone,
        sex
      });
      console.log('회원가입 성공:', response.data);
      navigate('/login');
    } catch (error) {
      setError('회원가입 실패. 다시 시도해 주세요.');
      console.error('회원가입 실패:', error);
    }
  };

  return (
    <div className={styles.container}>
      <img src={logo} alt="Logo" className={styles.logo} />
      <h3 className={styles.snsMessage}>SNS 계정으로 간편하게 회원가입</h3>

      {/* SNS 로그인 아이콘 추가 */}
      <div className={styles.snsIcons}>
        <button className={styles.snsButton}>
          <img src={googleIcon} alt="Google" className={styles.snsIcon} />
        </button>
        <button className={styles.snsButton}>
          <img src={kakaoIcon} alt="Kakao" className={styles.snsIcon} />
        </button>
      </div>
      
      {/* 가로 줄 추가 */}
      <hr className={styles.separator} />

      <div className={styles.RegisterPage}>
        <h2 className={styles.heading}>회원가입</h2>
        {error && <p className={styles.error}>{error}</p>}
        {idError && <p className={styles.error}>{idError}</p>}
        {idSuccess && <p className={styles.success}>{idSuccess}</p>}
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="사용자 ID"
          className={styles.input}
        />
        <button onClick={checkIdAvailability} className={styles.button}>ID 중복 확인</button>
        <input
          type="password"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          placeholder="비밀번호"
          className={styles.input}
        />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름"
          className={styles.input}
        />
              <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="이메일"
        className={styles.input}
      />
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="전화번호"
          className={styles.input}
        />
        <input
          type="text"
          value={sex}
          onChange={(e) => setSex(e.target.value)}
          placeholder="성별"
          className={styles.input}
        />
        <button onClick={handleRegister} className={styles.button}>회원가입</button>
      </div>
    </div>
  );
}

export default RegisterPage;
