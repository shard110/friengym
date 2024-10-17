import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ViewAsk = ({ anum }) => {
  const [ask, setAsk] = useState(null);
  const navigate = useNavigate();

  // 문의글 데이터를 서버에서 가져옴
  useEffect(() => {
    const fetchAsk = async () => {
      try {
        const token = localStorage.getItem('jwtToken'); // 토큰 가져오기
        if (!token) {
          throw new Error("로그인이 필요합니다.");
        }

        const response = await axios.get(`/api/asks/${anum}`, {
          headers: {
            Authorization: `Bearer ${token}`, // JWT 토큰을 Authorization 헤더에 포함
          },
        });
        setAsk(response.data);
      } catch (error) {
        console.error("Error fetching ask:", error);
        alert("문의글 조회 중 오류가 발생했습니다.");
      }
    };

    fetchAsk();
  }, [anum]);

  const handleUpdate = () => {
    navigate(`/asks/update/${anum}`); // update 페이지로 이동
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("정말로 이 문의글을 삭제하시겠습니까?");
    if (confirmDelete) {
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          throw new Error("로그인이 필요합니다.");
        }

        await axios.delete(`/api/asks/${anum}`, {
          headers: {
            Authorization: `Bearer ${token}`, // JWT 토큰을 Authorization 헤더에 포함
          },
        });
        alert("문의글이 삭제되었습니다.");
        navigate("/asks"); // 삭제 후 목록 페이지로 이동
      } catch (error) {
        console.error("Error deleting ask:", error);
        alert("문의글 삭제 중 오류가 발생했습니다.");
      }
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString(); // 날짜와 시간을 함께 표시
  };

  // 파일 미리보기 함수
  const renderFilePreview = (filePath) => {
    const fileExtension = filePath.split('.').pop().toLowerCase(); // 파일 확장자를 추출
 // 이미지 파일인지 확인 (jpg, jpeg, png, gif 확장자 확인)
 if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
  return (
    <div>
      <p>파일 미리보기:</p>
      <img
        src={`http://localhost:8080${filePath}`}
        alt="첨부파일 미리보기"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </div>
  );
} 
// PDF 파일인 경우
else if (fileExtension === 'pdf') {
  return (
    <div>
      <p>파일 미리보기:</p>
      <embed
        src={`http://localhost:8080${filePath}`}
        type="application/pdf"
        width="100%"
        height="600px"
      />
    </div>
  );
}
// 그 외 파일은 다운로드 링크 제공
else {
  return (
    <div>
      <p>파일 다운로드: <a href={`http://localhost:8080${filePath}`} target="_blank" rel="noopener noreferrer">파일 보기</a></p>
    </div>
  );
}
};


  return (
    <div>
    <h1>문의글 조회</h1>
    {ask ? (
      <div>
        <h3>제목: {ask.aTitle}</h3>  {/* 필드 이름 수정 */}
        <p>내용: {ask.aContents}</p>  {/* 필드 이름 수정 */}
        <p>작성자: {ask.userId ? ask.userId : "Unknown"}</p>  {/* userId로 수정 */}
        <p>작성일: {formatDate(ask.aDate)}</p>  {/* aDate는 그대로 사용 */}

        {ask.aFile && (
          <div>
             {renderFilePreview(ask.aFile)}
          </div>
        )}

        {ask.reply && ( // 답변이 있을 경우
          <div>
            <h4>답변 내용</h4>
            <p>{ask.reply}</p>
          </div>
        )}

          <button onClick={handleUpdate}>수정하기</button>
          <button onClick={handleDelete}>삭제하기</button>
        </div>
      ) : (
        <p>문의글을 불러오는 중입니다...</p>
      )}
    </div>
  );
};

export default ViewAsk;
