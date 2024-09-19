import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from './AuthContext'; // 인증 컨텍스트 추가
import "./EditPost.css"; // 새로 정의된 CSS

export default function EditPost() {
  const [post, setPost] = useState({
    poContents: "",
    file: null, // 파일 선택 상태
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { poNum } = useParams();
  const { user } = useAuth(); // 인증 정보 가져오기

  useEffect(() => {
    const loadPost = async () => {
      try {
        const result = await axios.get(`http://localhost:8080/posts/${poNum}`);
        setPost({
          poContents: result.data.poContents,
        });
      } catch (error) {
        setError("게시글을 가져오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [poNum]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('poContents', post.poContents);
    if (post.file) {
      formData.append('file', post.file);
    }

    try {
      await axios.put(`http://localhost:8080/posts/${poNum}`, formData, {
        headers: {
          'Authorization': `Bearer ${user?.token || localStorage.getItem('jwtToken')}`, // 인증 헤더 추가
          
        }
      });
      navigate(`/posts`); 
    } catch (error) {
      setError("게시글 업데이트에 실패했습니다.");
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error}</div>;

  return (
    <div className="edit-post-form">
      <form onSubmit={handleSubmit}>
        <textarea
          value={post.poContents}
          onChange={(e) => setPost({ ...post, poContents: e.target.value })}
          required
        />
        <input
          type="file"
          onChange={(e) => setPost({ ...post, file: e.target.files[0] })}
        />
        <button type="submit">수정하기</button>
      </form>
    </div>
  );
};

