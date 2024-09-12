import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from './AuthContext'; // 인증 컨텍스트 추가
import style from './EditPost.module.css'; // CSS 모듈 임포트

export default function EditPost() {
  const [post, setPost] = useState({
    poTitle: "",
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
          poTitle: result.data.poTitle,
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost((prevPost) => ({
      ...prevPost,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setPost((prevPost) => ({
      ...prevPost,
      file: e.target.files[0], // 선택한 파일을 상태에 저장
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('poTitle', post.poTitle);
    formData.append('poContents', post.poContents);
    if (post.file) {
      formData.append('file', post.file);
    }

    try {
      await axios.put(`http://localhost:8080/posts/${poNum}`, formData, {
        headers: {
          'Authorization': `Bearer ${user?.token || localStorage.getItem('jwtToken')}`, // 인증 헤더 추가
          'Content-Type': 'multipart/form-data',
        }
      });
      navigate(`/post/${poNum}`); // 수정 완료 후 상세 페이지로 이동
    } catch (error) {
      setError("게시글 업데이트에 실패했습니다.");
    }
  };

  if (loading) return <div className={style.loading}>로딩 중...</div>;
  if (error) return <div className={style.error}>오류: {error}</div>;

  return (
    <div className={style.container}>
      <div className={style.postEditCard}>
        <div className={style.cardHeader}>게시글 수정</div>
        <div className={style.cardBody}>
          <form onSubmit={handleSubmit}>
            <div className={style.formGroup}>
              <label htmlFor="poTitle">제목</label>
              <input
                type="text"
                id="poTitle"
                name="poTitle"
                value={post.poTitle}
                onChange={handleChange}
                required
              />
            </div>
            <div className={style.formGroup}>
              <label htmlFor="poContents">내용</label>
              <textarea
                id="poContents"
                name="poContents"
                value={post.poContents}
                onChange={handleChange}
                required
              />
            </div>
            <div className={style.formGroup}>
              <label htmlFor="file">파일 (선택)</label>
              <input
                type="file"
                id="file"
                name="file"
                onChange={handleFileChange}
              />
            </div>
            <button type="submit" className={style.button}>
              수정하기
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
