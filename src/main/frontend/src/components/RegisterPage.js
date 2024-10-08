import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './RegisterPage.module.css';
import logo from '../img/logo.png'; // Adjust the path as needed
import googleIcon from '../img/google.png'; // Google icon path
import kakaoIcon from '../img/kakao.png'; // Kakao icon path

function RegisterPage() {
  const [id, setId] = useState('');
  const [pwd, setPwd] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [sex, setSex] = useState('');
  const [email, setEmail] = useState('');
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
        sex,
        email
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

      <div className={styles.snsIcons}>
        <button className={styles.snsButton}>
          <img src={googleIcon} alt="Google" className={styles.snsIcon} />
        </button>
        <button className={styles.snsButton}>
          <img src={kakaoIcon} alt="Kakao" className={styles.snsIcon} />
        </button>
      </div>

      <hr className={styles.separator} />

      <div className={styles.RegisterPage}>
        <h2 className={styles.heading}>회원가입</h2>
        {error && <p className={styles.error}>{error}</p>}
        {idError && <p className={styles.error}>{idError}</p>}
        {idSuccess && <p className={styles.success}>{idSuccess}</p>}
        
        <label className={styles.inputLabel}>사용자 ID <span style={{ color: 'red' }}>*</span></label>
        <div className={styles.inputGroup}>
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className={styles.input}
          />
          <button
            onClick={checkIdAvailability}
            className={styles.buttonCheckId}
          >
            ID 중복 확인
          </button>
        </div>

        <label className={styles.inputLabel}>비밀번호 <span style={{ color: 'red' }}>*</span></label>
        <input
          type="password"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          className={styles.input}
        />

        <label className={styles.inputLabel}>이름 <span style={{ color: 'red' }}>*</span></label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
        />

        <label className={styles.inputLabel}>이메일 <span style={{ color: 'red' }}>*</span></label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />

        <label className={styles.inputLabel}>전화번호 <span style={{ color: 'red' }}>*</span></label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={styles.input}
        />

        <label className={styles.inputLabel}>성별</label>
        <input
          type="text"
          value={sex}
          onChange={(e) => setSex(e.target.value)}
          className={styles.input}
        />
        
        <button onClick={handleRegister} className={styles.button}>회원가입</button>
      </div>
    </div>
  );
}

export default RegisterPage;
