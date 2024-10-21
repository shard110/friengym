import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import styles from './ListStyles.module.css';

const AskList = () => {
  const [asks, setAsks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAsks = async () => {
      const token = localStorage.getItem('adminToken');

      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:8080/api/admin/asks', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAsks(response.data);
      } catch (err) {
        console.error('Error fetching asks:', err);
        setError('문의글을 불러오는 데 실패했습니다. 다시 시도해 주세요.');
      } finally {
        setLoading(false);
      }
    };

    fetchAsks();
  }, [navigate]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;
  if (!Array.isArray(asks)) return <div>문제 발생: 데이터가 올바른 형식이 아닙니다.</div>;

  const renderReplyStatus = (reply) => {
    return reply && reply.trim() !== "" ? (
      <span style={{ color: 'green' }}>답변 완료</span>
    ) : (
      <span style={{ color: 'red' }}>답변 미완료</span>
    );
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.h2}>문의글 목록</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>제목</th>
            <th className={styles.th}>작성자</th>
            <th className={styles.th}>작성일</th>
            <th className={styles.th}>상태</th> {/* 상태 열 추가 */}
          </tr>
        </thead>
        <tbody>
          {asks.length === 0 ? (
            <tr>
              <td colSpan="4" className={styles.td}>등록된 문의글이 없습니다.</td>
            </tr>
          ) : (
            asks.map((ask) => (
              <tr key={ask.anum}>
                <td className={styles.td}>
                  <Link to={`/adminHome/ask/${ask.anum}`}>
                    {ask.atitle || '제목 없음'}
                  </Link>
                </td>
                <td className={styles.td}>{ask.user ? ask.user.id : 'Unknown'}</td>
                <td className={styles.td}>{new Date(ask.aDate).toLocaleString()}</td>
                <td className={styles.td}>
                  {ask.reply ? (
                    <span style={{ color: 'green' }}>답변 완료</span> // 답변이 있을 경우
                  ) : (
                    <span style={{ color: 'red' }}>답변 미완료</span> // 답변이 없을 경우
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AskList;
