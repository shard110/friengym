import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import styles from './CreatePostForm.module.css'; // CSS 모듈 import
import Footer from './Footer'; // Footer 컴포넌트 import

const CreatePostForm = () => {
  const { user } = useAuth(); // AuthContext에서 사용자 정보를 가져옵니다
  const navigate = useNavigate();
  const [poTitle, setpoTitle] = useState("");
  const [poContents, setpoContents] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  // Redirect to login page if not authenticated
  if (!user) {
    navigate("/login");
    return null; // Return null while navigating
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("poTitle", poTitle);
    formData.append("poContents", poContents);
    formData.append("userId", user.userId);
    if (file) {
      formData.append("file", file);
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/posts",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${
              user.token || localStorage.getItem("jwtToken")
            }`,
          },
        }
      );
      console.log(response.data);
      setMessage("Post created successfully!");
      alert("Post created successfully!");
      setTimeout(() => {
        navigate("/posts");
      }, 2000);
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      setMessage("An unexpected error occurred.");
      alert("An unexpected error occurred.");
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.formWrapper}>
          <form onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label className={styles.label}>제목</label>
              <input
                type="text"
                className={styles.inputText}
                value={poTitle}
                onChange={(e) => setpoTitle(e.target.value)}
                required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>내용</label>
              <textarea
                className={styles.textarea}
                value={poContents}
                onChange={(e) => setpoContents(e.target.value)}
                required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>첨부파일</label>
              <input
                type="file"
                className={styles.inputFile}
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
            <button type="submit" className={styles.button}>게시글 등록</button>
            {message && <p className={styles.message}>{message}</p>}
          </form>
        </div>
      </div>
      <Footer /> {/* Footer 추가 */}
    </>
  );
};

export default CreatePostForm;
