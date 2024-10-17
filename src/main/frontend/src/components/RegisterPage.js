import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './RegisterPage.module.css';
import logo from '../img/logo.png';
import googleIcon from '../img/google.png';
import kakaoIcon from '../img/kakao.png';

function RegisterPage() {
  const [id, setId] = useState('');
  const [pwd, setPwd] = useState('');
  const [name, setName] = useState('');
  const [areaCode, setAreaCode] = useState('');
  const [middleNumber, setMiddleNumber] = useState('');
  const [lastNumber, setLastNumber] = useState('');
  const [sex, setSex] = useState('');
  const [emailId, setEmailId] = useState('');
  const [emailDomain, setEmailDomain] = useState('naver.com');
  const [error, setError] = useState('');
  const [idError, setIdError] = useState('');
  const [idSuccess, setIdSuccess] = useState('');
  const [isIdAvailable, setIsIdAvailable] = useState(true);
  const [isAgreedAll, setIsAgreedAll] = useState(false);
  const [isAgreedAge, setIsAgreedAge] = useState(false);
  const [isAgreedTerms, setIsAgreedTerms] = useState(false);
  const [isAgreedPrivacy, setIsAgreedPrivacy] = useState(false);
  const [isAgreedOptionalPrivacy, setIsAgreedOptionalPrivacy] = useState(false);
  const [isAgreedOptionalInfo, setIsAgreedOptionalInfo] = useState(false);
  const [isAgreedSMS, setIsAgreedSMS] = useState(false);
  const [isAgreedEmail, setIsAgreedEmail] = useState(false);
  
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

    const email = `${emailId}@${emailDomain}`;

    if (!isAgreedAge || !isAgreedTerms || !isAgreedPrivacy) {
      setError('이용 약관에 동의해 주세요.');
      return;
    }

    // 전화번호를 하나의 문자열로 결합
    const phone = `${areaCode}-${middleNumber}-${lastNumber}`;

    try {
      const response = await axios.post('/api/register', {
        id,
        pwd,
        name,
        phone, // 결합된 전화번호 사용
        sex,
        email,
        isAgreedSMS,
        isAgreedEmail,
      });
      console.log('회원가입 성공:', response.data);
      navigate('/login');
    } catch (error) {
      setError('회원가입 실패. 다시 시도해 주세요.');
      console.error('회원가입 실패:', error);
    }
  };

  const handleAgreeAll = () => {
    const newValue = !isAgreedAll;
    setIsAgreedAll(newValue);
    setIsAgreedAge(newValue);
    setIsAgreedTerms(newValue);
    setIsAgreedPrivacy(newValue);
    setIsAgreedOptionalPrivacy(newValue);
    setIsAgreedOptionalInfo(newValue);
    setIsAgreedSMS(newValue);
    setIsAgreedEmail(newValue);
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
            placeholder="아이디를 입력하세요"
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
        <small style={{ display: 'block', fontSize: '0.9em', color: '#828282', marginTop: '-2%', marginBottom: '10px' }}>
          영문, 숫자를 포함한 8자 이상의 비밀번호를 입력해주세요
        </small>
        <input
          type="password"
          value={pwd}
          placeholder="비밀번호를 입력하세요"
          onChange={(e) => setPwd(e.target.value)}
          className={`${styles.input} ${styles.shortInput}`}
        />

        <label className={styles.inputLabel}>이름 <span style={{ color: 'red' }}>*</span></label>
        <input
          type="text"
          placeholder="이름을 입력히세요"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`${styles.input} ${styles.shortInput}`}
        />

        <label className={styles.inputLabel}>이메일 <span style={{ color: 'red' }}>*</span></label>
        <div className={styles.inputGroup}>
          <input
            type="text"
            value={emailId}
            onChange={(e) => setEmailId(e.target.value)}
            className={`${styles.input} ${styles.emailInput}`}
            placeholder="이메일 아이디"
          />
          <span>@</span>
          <select className={styles.select} title="이메일 도메인 주소 선택" onChange={(e) => setEmailDomain(e.target.value)} value={emailDomain}>
            <option value="naver.com">naver.com</option>
            <option value="gmail.com">gmail.com</option>
            <option value="hanmail.net">hanmail.net</option>
            <option value="hotmail.com">hotmail.com</option>
            <option value="korea.com">korea.com</option>
            <option value="nate.com">nate.com</option>
            <option value="yahoo.com">yahoo.com</option>
          </select>
        </div>
        
        <label className={styles.inputLabel}>전화번호 <span style={{ color: 'red' }}>*</span></label>
        <div className={styles.inputGroup}>
          <select
            className={`${styles.phoneInput}`}
            value={areaCode}
            onChange={(e) => setAreaCode(e.target.value)}
          >
            <option value="">-선택-</option>
            <option value="010">010</option>
            <option value="02">02</option>
            <option value="011">011</option>
          </select>
          <input
            type="text"
            value={middleNumber}
            onChange={(e) => setMiddleNumber(e.target.value)}
            className={`${styles.middleInput}`}
            placeholder="가운데 번호"
          />
          <input
            type="text"
            value={lastNumber}
            onChange={(e) => setLastNumber(e.target.value)}
            className={`${styles.lastInput}`}
            placeholder="마지막 번호"
          />
        </div>

        <label className={styles.inputLabelsex}>성별</label>
        <div className={styles.genderGroup}>
          <label className={styles.genderLabel} htmlFor="gender-male">
            <input
              type="radio"
              value="남"
              checked={sex === '남'}
              onChange={(e) => setSex(e.target.value)}
              className={styles.radioInput}
              id="gender-male"
            />
            남
          </label>
          <label className={styles.genderLabel} htmlFor="gender-female">
            <input
              type="radio"
              value="여"
              checked={sex === '여'}
              onChange={(e) => setSex(e.target.value)}
              className={styles.radioInput}
              id="gender-female"
            />
            여
          </label>
        </div>

        <div className={styles.termsGroup}>
          <label className={styles.termsLabel}>이용 약관 동의 <span style={{ color: 'red' }}>*</span></label>
          <div>
            <label className={styles.customCheckbox}>
              <input
                type="checkbox"
                checked={isAgreedAll}
                onChange={handleAgreeAll}
                className={styles.checkbox}
              />
              <span className={styles.checkmark}></span>
              <strong style={{ fontSize: '1.1em', color: 'black' }}>전체 동의합니다.</strong>
            </label>
            <small style={{ display: 'block', fontSize: '0.9em', color: '#828282', marginTop: '-4%', marginBottom: '5%' }}>
              선택 항목을 포함해 전체 동의합니다.
            </small>
          </div>
          <div>
            <label className={styles.customCheckbox}>
              <input
                type="checkbox"
                checked={isAgreedAge}
                onChange={() => setIsAgreedAge(!isAgreedAge)}
                className={styles.checkbox}
              />
              <span className={styles.checkmark}></span>
              본인은 만 14세 이상입니다. <span style={{ color: '#828282' }}>(필수)</span>
            </label>
            <label className={styles.customCheckbox}>
              <input
                type="checkbox"
                checked={isAgreedTerms}
                onChange={() => setIsAgreedTerms(!isAgreedTerms)}
                className={styles.checkbox}
              />
              <span className={styles.checkmark}></span>
              이용 약관 동의 <span style={{ color: '#828282' }}>(필수)</span>
            </label>
            <label className={styles.customCheckbox}>
              <input
                type="checkbox"
                checked={isAgreedPrivacy}
                onChange={() => setIsAgreedPrivacy(!isAgreedPrivacy)}
                className={styles.checkbox}
              />
              <span className={styles.checkmark}></span>
              개인정보 수집 및 이용 동의 <span style={{ color: '#828282' }}>(필수)</span>
            </label>
            <label className={styles.customCheckbox}>
              <input
                type="checkbox"
                checked={isAgreedOptionalPrivacy}
                onChange={() => setIsAgreedOptionalPrivacy(!isAgreedOptionalPrivacy)}
                className={styles.checkbox}
              />
              <span className={styles.checkmark}></span>
              개인정보 수집 및 이용 동의 <span style={{ color: '#828282' }}>(선택)</span>
            </label>
            <label className={styles.customCheckbox}>
              <input
                type="checkbox"
                checked={isAgreedOptionalInfo}
                onChange={() => setIsAgreedOptionalInfo(!isAgreedOptionalInfo)}
                className={styles.checkbox}
              />
              <span className={styles.checkmark}></span>
              혜택/정보 수신 동의 <span style={{ color: '#828282' }}>(선택)</span>
            </label>
            <div style={{ display: 'flex', marginTop: '5px' }}>
              <label className={styles.customCheckbox} style={{ marginRight: '20px' }}>
                <input
                  type="checkbox"
                  checked={isAgreedSMS}
                  onChange={() => setIsAgreedSMS(!isAgreedSMS)}
                  className={styles.checkbox}
                />
                <span className={styles.checkmark}></span>
                SMS 
              </label>
              <label className={styles.customCheckbox}>
                <input
                  type="checkbox"
                  checked={isAgreedEmail}
                  onChange={() => setIsAgreedEmail(!isAgreedEmail)}
                  className={styles.checkbox}
                />
                <span className={styles.checkmark}></span>
                Email 
              </label>
            </div>
          </div>
        </div>
        
        <button onClick={handleRegister} className={styles.registerButton}>회원가입</button>
      </div>
    </div>
  );
}

export default RegisterPage;
