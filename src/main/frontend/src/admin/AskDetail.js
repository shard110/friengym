import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './AskDetail.css';

const AskDetail = () => {
  const { id } = useParams();
  const [ask, setAsk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reply, setReply] = useState('');

  // useCallback을 사용하여 fetchAsk 메모이제이션
  const fetchAsk = useCallback(async () => {
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
  }, [id]);

  useEffect(() => {
    fetchAsk(); // 컴포넌트가 마운트될 때 질문 정보 fetch
  }, [fetchAsk]); // fetchAsk를 의존성 배열에 추가

  const handleReplySubmit = async () => {
    try {
      await axios.post(`http://localhost:8080/api/admin/asks/${id}/reply`, { reply }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
      });
      alert('답변이 등록되었습니다.');
      setReply(''); // 입력란 초기화
      fetchAsk(); // 새로 등록된 답변을 포함하여 질문 정보를 다시 fetch
    } catch (error) {
      alert('답변 등록에 실패했습니다.');
    }
  };

  const handleDeleteReply = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/admin/asks/${id}/reply`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
      });
      alert('답변이 삭제되었습니다.');
      fetchAsk(); // 삭제 후 새로고침
    } catch (error) {
      alert('답변 삭제에 실패했습니다.');
    }
  };

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

      <div className="reply-container">
        <h3>답변하기</h3>
        <textarea 
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="답변을 입력하세요..."
          rows="4"
          style={{ width: '100%' }}
        />
        <button onClick={handleReplySubmit}>답변 등록</button>
      </div>

      {ask.reply && ( // 등록된 답변이 있을 때만 표시
        <div className="submitted-reply">
          <h3>등록된 답변</h3>
          <p>{ask.reply}</p>
          <p><strong>답변 작성일:</strong> {new Date().toLocaleString()}</p>
          <button onClick={handleDeleteReply}>삭제</button> {/* 삭제 버튼 추가 */}
        </div>
      )}
    </div>
  );
};

export default AskDetail;
