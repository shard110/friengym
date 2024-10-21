import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./CreatePostForm.css";

// 유튜브 링크 감지 정규식
const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([^\s&]+)/;

// URL 감지 정규식 (유튜브 포함)
const urlRegex = /(https?:\/\/[^\s]+)/g;

// 유튜브 링크에서 동영상 ID 추출
function extractYouTubeVideoId(url) {
  const match = url.match(youtubeRegex);
  return match ? match[1] : null;
}

// 유튜브 동영상 정보 가져오기
async function fetchYouTubeVideoInfo(videoId) {
  const url = `https://www.youtube.com/watch?v=${videoId}`;
  const oEmbedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;

  try {
    const response = await fetch(oEmbedUrl);
    if (response.ok) {
      const data = await response.json();
      return {
        title: data.title,
        thumbnailUrl: data.thumbnail_url,
        authorName: data.author_name,
      };
    } else {
      console.error("Failed to fetch video info");
      return null;
    }
  } catch (error) {
    console.error("Error fetching video info:", error);
    return null;
  }
}

// Open Graph 메타데이터 가져오기
async function fetchOpenGraphData(url) {
  try {
    const response = await fetch(`/api/posts/fetch-metadata?url=${encodeURIComponent(url)}`);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error("Failed to fetch Open Graph data");
      return null;
    }
  } catch (error) {
    console.error("Error fetching Open Graph data:", error);
    return null;
  }
}

const CreatePostForm = () => {
  const { user } = useAuth(); // AuthContext에서 사용자 정보를 가져옵니다
  const navigate = useNavigate();
  const [poContents, setpoContents] = useState("");
  const [linkPreview, setLinkPreview] = useState(null);
  const [hashtags, setHashtags] = useState([]);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null); // 미리보기 상태

  useEffect(() => {
    // 게시글 내용에서 링크를 감지
    const urls = poContents.match(urlRegex);
    if (urls && urls.length > 0) {
      const url = urls[0]; // 첫 번째로 발견된 링크를 사용
      if (url.match(youtubeRegex)) {
        // 유튜브 링크인 경우
        const videoId = extractYouTubeVideoId(url);
        fetchYouTubeVideoInfo(videoId).then((info) => {
          if (info) {
            setLinkPreview({
              type: "youtube",
              data: {
                videoId,
                ...info,
              },
            });
          }
        });
      } else {
        // 일반 링크인 경우 Open Graph 메타데이터 가져오기
        fetchOpenGraphData(url).then((data) => {
          if (data) {
            setLinkPreview({
              type: "link",
              data,
            });
          }
        });
      }
    } else {
      setLinkPreview(null);
    }
  }, [poContents]);

  // Redirect to login page if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return null; // 로그인 페이지로 리다이렉트하는 동안 null 반환
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    // 파일이 이미지거나 동영상인 경우 미리보기 설정
    if (selectedFile) {
      const fileUrl = URL.createObjectURL(selectedFile);
      setFilePreview(fileUrl); // 미리보기 URL 설정
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("poContents", poContents);
    formData.append('hashtags', hashtags);
    formData.append("userId", user.userId);
    if (file) {
      formData.append("file", file);
    }

    try {
      await axios.post("http://localhost:8080/api/posts", formData, {
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
        {/* 링크 미리보기 표시 */}
        {linkPreview && (
          <div className="link-preview">
            {linkPreview.type === "youtube" ? (
              <div className="youtube-preview">
                <img
                  src={linkPreview.data.thumbnailUrl}
                  alt={linkPreview.data.title}
                />
                <p>{linkPreview.data.title}</p>
              </div>
            ) : (
              <div className="link-preview-content">
                <img src={linkPreview.data.image} alt={linkPreview.data.title} />
                <div>
                  <h3>{linkPreview.data.title}</h3>
                  <p>{linkPreview.data.description}</p>
                </div>
              </div>
            )}
          </div>
        )}
        <input
          type="text"
          value={hashtags.join(' ')}
          onChange={(e) => setHashtags(e.target.value.split(' '))}
          placeholder="#해시태그"
        />
        <br />
        <input type="file" onChange={handleFileChange} />
        {filePreview && (
          <div>
            {/* 파일 미리보기 설정 */}
            {file.type.startsWith("image/") && (
              <img
                src={filePreview}
                alt="미리보기"
                style={{ width: "100%", maxHeight: "300px" }}
              />
            )}
            {file.type.startsWith("video/") && (
              <video
                src={filePreview}
                controls
                style={{ width: "100%", maxHeight: "300px" }}
              />
            )}
          </div>
        )}
        <button type="submit">게시글 등록</button>
      </form>
    </div>
  );
};

export default CreatePostForm;
