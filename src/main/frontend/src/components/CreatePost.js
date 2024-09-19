import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./CreatePostForm.css";

const CreatePostForm = () => {
  const { user } = useAuth(); // AuthContext에서 사용자 정보를 가져옵니다
  const navigate = useNavigate();
  const [poContents, setpoContents] = useState("");
  const [file, setFile] = useState(null);


  // Redirect to login page if not authenticated
  if (!user) {
    navigate("/login");
    return null; // Return null while navigating
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("poContents", poContents);
    formData.append("userId", user.userId);
    if (file) {
      formData.append("file", file);
    }

    try {
      await axios.post("http://localhost:8080/posts", formData, {
        headers: {
          Authorization: `Bearer ${
            user.token || localStorage.getItem("jwtToken")
          }`,
        },
      });
      alert("게시글이 성공적으로 작성되었습니다!");
      navigate("/posts");
    } catch (error) {
      alert("게시글 작성 중 오류가 발생했습니다.");
    }
  };


  return (
    <div className="create-post-form">
    <form onSubmit={handleSubmit}>
      <textarea
        value={poContents}
        onChange={(e) => setpoContents(e.target.value)}
        placeholder="무엇이든 이야기 해보자!"
        required
      />
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button type="submit">게시글 등록</button>
    </form>
  </div>
);
};

export default CreatePostForm;