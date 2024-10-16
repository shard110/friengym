import axios from "axios";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Link 추가
import './CreateAsk.css';

const CreateAsk = ({ onAskCreated }) => {
  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!title || !contents) {
      alert("제목과 내용을 입력해 주세요."); // 제목이나 내용이 비어 있을 때 경고
      return;
    }

    const formData = new FormData();
    formData.append("aTitle", title);
    formData.append("aContents", contents);
    if (file) {
      formData.append("afile", file);
    }

    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        console.error("JWT 토큰이 존재하지 않습니다.");
        return;
      }

      await axios.post("/api/asks", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("문의글이 성공적으로 작성되었습니다.");
      onAskCreated();
      navigate('/asks');
    } catch (error) {
      console.error("문의글 작성 중 오류가 발생했습니다.", error.response?.data || error.message);
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
      <div className="button-container">
        <button onClick={handleSubmit}>작성완료</button>
        <Link to="/asks">
          <button>취소</button> {/* Link로 감싸기 */}
        </Link>
      </div>
    </div>
  );
};

export default CreateAsk;
