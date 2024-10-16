import axios from "axios";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import './CreateAsk.css';

const CreateAsk = ({ onAskCreated }) => {
  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState(""); // 비밀번호 상태 추가
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!title || !contents || !password) { // 비밀번호 확인 추가
      alert("제목, 내용, 비밀번호를 입력해 주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("aTitle", title);
    formData.append("aContents", contents);
    if (file) {
      formData.append("afile", file);
    }
    formData.append("password", password); // 비밀번호 추가

    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      const response = await axios.post("/api/asks", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        alert("문의글이 성공적으로 작성되었습니다.");
        onAskCreated();
        navigate('/asks');
      } else {
        alert("문의글 작성에 실패했습니다.");
      }
    } catch (error) {
      console.error("문의글 작성 중 오류가 발생했습니다.", error.response?.data || error.message);
      alert("문의글 작성 중 오류가 발생했습니다.");
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
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
        type="file"
        onChange={handleFileChange}
      />
      <input
        type="password" // 비밀번호 입력 필드 추가
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="button-container">
        <button onClick={handleSubmit}>작성완료</button>
        <Link to="/asks">
          <button>취소</button>
        </Link>
      </div>
    </div>
  );
};

export default CreateAsk;
