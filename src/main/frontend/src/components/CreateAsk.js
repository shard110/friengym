import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateAsk = ({ onAskCreated }) => {
  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState(null);  // 파일을 저장할 상태 추가
  const [filePreview, setFilePreview] = useState(null); // 파일 미리보기 상태 추가
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("aTitle", title);
    formData.append("aContents", contents);
    formData.append("password", password);
    if (file) {
      formData.append("afile", file);  // 선택한 파일을 formData에 추가
    }

    try {
      // JWT 토큰을 localStorage에서 가져오거나 필요한 방식으로 불러옵니다.
      const token = localStorage.getItem("jwtToken"); // JWT 토큰 가져오기

      // 토큰이 없는 경우 오류를 표시하고 종료
      if (!token) {
        console.error("JWT 토큰이 존재하지 않습니다.");
        return;
      }

      // DTO에 맞는 필드명을 사용하여 서버로 전송
      await axios.post("/api/asks", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data" // JWT 토큰을 Authorization 헤더에 추가
        },
      });

      alert("문의글이 성공적으로 작성되었습니다.");
      onAskCreated();
      navigate('/asks'); // 문의글 작성 후 AskPage로 이동
    } catch (error) {
      console.error("문의글 작성 중 오류가 발생했습니다.", error.response?.data || error.message);
    }
  };

  // 파일 선택 시 파일 상태 업데이트 및 미리보기 설정
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile); // 파일 선택 시 상태에 저장
    if (selectedFile) {
      const fileURL = URL.createObjectURL(selectedFile);
      setFilePreview(fileURL); // 파일 미리보기 설정
    } else {
      setFilePreview(null); // 파일이 없는 경우 미리보기 제거
    }
  };

  return (
    <div id="create-ask">
      <h1>문의글 작성</h1>
      <input
        type="text"
        placeholder="제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="내용"
        value={contents}
        onChange={(e) => setContents(e.target.value)}
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="file"
        onChange={handleFileChange}  // 파일 선택
      />

      {/* 파일이 선택된 경우 미리보기 표시 */}
      {filePreview && (
        <div>
          <h4>파일 미리보기:</h4>
          <img src={filePreview} alt="파일 미리보기" style={{ maxWidth: "300px", height: "auto" }} />
        </div>
      )}

      <button onClick={handleSubmit}>작성완료</button>
    </div>
  );
};

export default CreateAsk;
