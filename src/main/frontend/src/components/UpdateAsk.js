import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import './UpdateAsk.css'; // CSS 파일 import

const UpdateAsk = () => {
  const { anum } = useParams();
  const [ask, setAsk] = useState({
    aTitle: "",
    aContents: "",
    afile: "",
    aDate: "",
    userId: ""  // DTO에 있는 필드로 수정
  });

  const [newFile, setNewFile] = useState(null); // 새로운 파일을 저장할 상태 추가
  const navigate = useNavigate();

  // 기존 데이터를 불러오기
  useEffect(() => {
    const fetchAsk = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await axios.get(`/api/asks/${anum}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setAsk(response.data); // DTO 데이터를 ask 상태에 설정
      } catch (error) {
        console.error("문의글을 불러오는 중 오류 발생:", error);
      }
    };
    fetchAsk();
  }, [anum]);

  // 문의글 수정 처리
  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("aTitle", ask.aTitle);
    formData.append("aContents", ask.aContents);

    if (newFile) {
      formData.append("afile", newFile); // 새로운 파일을 선택한 경우
    }

    try {
      const token = localStorage.getItem('jwtToken');
      await axios.put(`/api/asks/${anum}`,formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      alert("문의글이 성공적으로 수정되었습니다.");
      navigate(`/asks`); // 수정 후 목록 페이지로 이동
    } catch (error) {
      alert("수정 중 오류가 발생했습니다.");
      console.error(error);
    }
  };

  // 텍스트 입력 처리
  const handleChange = (e) => {
    setAsk({ ...ask, [e.target.name]: e.target.value });
  };

  // 파일 변경 처리
  const handleFileChange = (e) => {
    setNewFile(e.target.files[0]); // 새로운 파일을 상태에 저장
  };

  return (
    <div className="update-ask-container">
      <h1>문의글 수정</h1>
      <input
        type="text"
        name="aTitle"
        value={ask.aTitle}
        onChange={handleChange}
        placeholder="제목"
      />
      <textarea
        name="aContents"
        value={ask.aContents}
        onChange={handleChange}
        placeholder="내용"
      />
      {ask.afile && (
        <div>
          <p>
            현재 파일:{" "}
            <a
              href={ask.afile}
              target="_blank"
              rel="noopener noreferrer"
            >
              파일 보기
            </a>
          </p>
        </div>
      )}
      <input
        type="file"
        name="afile"
        onChange={handleFileChange} // 파일 변경 처리
      />
      <button onClick={handleUpdate}>수정 완료</button>
    </div>
  );
};

export default UpdateAsk;
