import React, { useState } from 'react';
import axios from 'axios';
import styles from './FindIdPage.module.css'; // CSS 모듈

function FindIdPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState('');

  const handleFindId = async () => {
    try {
      const response = await axios.post('/api/find-id', { name, email });
      setUserId(response.data.id); // 서버에서 받은 ID 저장
      setMessage('찾은 아이디: ' + response.data.id);
    } catch (error) {
      setMessage('아이디를 찾을 수 없습니다. 정보를 확인하세요.');
      console.error('ID 찾기 실패', error);
    }
  };

  return (
    <div className={styles.FindIdPage}>
      <h2>아이디 찾기</h2>
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
      <button onClick={handleFindId} className={styles.button}>아이디 찾기</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default FindIdPage;
