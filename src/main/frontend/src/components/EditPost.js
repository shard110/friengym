import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from './AuthContext'; // 인증 컨텍스트 추가
import "./EditPost.css"; // 새로 정의된 CSS

export default function EditPost() {
  const [post, setPost] = useState({
    poContents: "",
    hashtags: [], // 해시태그 추가
    existingFileUrl: null, // 기존 파일 URL
    file: null, // 새로 선택된 파일
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
          hashtags: result.data.hashtags || [],
          existingFileUrl: result.data.fileUrl || null,
          file: null,
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
    formData.append('hashtags', post.hashtags.join(' ')); // 해시태그를 문자열로 변환하여 전송

    if (post.file) {
      formData.append('file', post.file);
    }

    try {
      await axios.put(`http://localhost:8080/posts/${poNum}`, formData, {
        headers: {
          'Authorization': `Bearer ${user?.token || localStorage.getItem('jwtToken')}`,
          'Content-Type': 'multipart/form-data',
        }
      });
      navigate(`/posts/${poNum}`); // 수정 후 해당 게시글로 이동
    } catch (error) {
      setError("게시글 업데이트에 실패했습니다.");
    }
  };

  const handleHashtagsChange = (e) => {
    const tags = e.target.value.split(' ').map(tag => tag.trim().replace('#', '')).filter(tag => tag !== '');
    setPost({ ...post, hashtags: tags });
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

        {/* 해시태그 입력 필드 */}
        <input
          type="text"
          value={post.hashtags.map(tag => `#${tag}`).join(' ')}
          onChange={handleHashtagsChange}
          placeholder="#해시태그 입력"
        />

        {/* 기존 파일이 있으면 미리보기 제공 */}
        {post.existingFileUrl && (
          <div className="existing-file-preview">
            {post.existingFileUrl.endsWith(".mp4") ? (
              <video controls className="post-video">
                <source src={post.existingFileUrl} type="video/mp4" />
              </video>
            ) : (
              <img src={post.existingFileUrl} alt="Uploaded" className="post-image" />
            )}
          </div>
        )}

        <label>
          <input
            type="checkbox"
            checked={post.deleteExistingFile || false}
            onChange={(e) => setPost({ ...post, deleteExistingFile: e.target.checked })}
          />
          파일 삭제
        </label>


        {/* 새 파일 선택 */}
        <input
          type="file"
          onChange={(e) => setPost({ ...post, file: e.target.files[0] })}
        />
        <button type="submit">수정하기</button>
      </form>
    </div>
  );
}
