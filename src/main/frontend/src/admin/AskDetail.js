import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './AskDetail.css'; // 스타일 파일을 임포트합니다.

const AskDetail = () => {
  const { id } = useParams();
  const [ask, setAsk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAsk = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/admin/asks/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
        });
        setAsk(response.data);
      } catch (error) {
        setError('문의글을 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchAsk();
  }, [id]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;
  if (!ask) return <div>문의글이 없습니다.</div>;

  return (
    <div className="ask-detail-container">
      <h2>{ask.atitle}</h2>
      <p><strong>작성자:</strong> {ask.user ? ask.user.name : '정보 없음'}</p>
      <p><strong>내용:</strong> {ask.acontents}</p>
      <p><strong>작성일:</strong> {new Date(ask.aDate).toLocaleString()}</p>
      <p><strong>첨부파일:</strong> {ask.afile || '없음'}</p>
    </div>
  );
};

export default AskDetail;
