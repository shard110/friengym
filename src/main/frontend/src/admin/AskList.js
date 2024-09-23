import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './ListStyles.css'; // CSS 파일 import

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
      } catch (error) {
        console.error('Error fetching asks:', error);
        setError('문의글을 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchAsks();
  }, [navigate]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container">
      <h2>문의글 목록</h2>
      <table>
        <thead>
          <tr>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>
          {asks.length === 0 ? (
            <tr>
              <td colSpan="3">등록된 문의글이 없습니다.</td>
            </tr>
          ) : (
            asks.map((ask) => (
              <tr key={ask.anum}>
                <td>
                  <Link to={`/adminHome/ask/${ask.anum}`}>
                    {ask.atitle || '제목 없음'}
                  </Link>
                </td>
                <td>{ask.user ? ask.user.id : 'Unknown'}</td>
                <td>{new Date(ask.aDate).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AskList;
