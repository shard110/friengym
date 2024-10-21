import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import "./PostSearch.css"; // 스타일 파일 (추후 생성)

const PostSearch = () => {
  const [searchOption, setSearchOption] = useState("content"); // 기본 검색 옵션
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [popularKeywords, setPopularKeywords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth(); // AuthContext에서 토큰을 가져옴
  const navigate = useNavigate();

   // 인기 검색 키워드 가져오기
   useEffect(() => {
    const fetchPopularKeywords = async () => {
      try {
        const response = await fetch("/api/posts/popular-search", {
          headers: {
            Authorization: `Bearer ${token}`, // 토큰을 헤더에 포함
          },
        });
        if (response.ok) {
          const data = await response.json();
          setPopularKeywords(data);
        } else {
          console.error("인기 검색 키워드를 가져오는 데 실패했습니다.");
        }
      } catch (error) {
        console.error("네트워크 오류:", error);
      }
    };

    if (token) {
      fetchPopularKeywords(); // 토큰이 존재할 때만 실행
    }
  }, [token]);

  // 검색 폼 제출 핸들러
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSearchResults([]);

    try {
      // 검색 API 호출
      const params = new URLSearchParams();
      if (searchOption === "userId") {
        params.append("userId", searchTerm);
      } else if (searchOption === "content") {
        params.append("content", searchTerm);
      } else if (searchOption === "hashtag") {
        params.append("hashtag", searchTerm);
      }

    // 검색 API 호출
    const response = await fetch(`/api/posts/search?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`, // 토큰을 헤더에 포함
      },
    });

    if (response.ok) {
      const data = await response.json();
      setSearchResults(data);
    } else {
      setError("검색 결과를 가져오는 데 실패했습니다.");
    }
  } catch (error) {
    setError("네트워크 오류가 발생했습니다.");
  }

  setLoading(false);
};

  // 인기 키워드 클릭 핸들러
  const handleKeywordClick = (keyword) => {
    setSearchOption("hashtag");
    setSearchTerm(keyword);
    // 자동으로 검색 실행
    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);
      setSearchResults([]);

      try {
        const params = new URLSearchParams();
        params.append("hashtag", keyword);

        const response = await fetch(`/api/posts/search?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${token}`, // 토큰을 헤더에 포함
          },
        });
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data);
        } else {
          setError("검색 결과를 가져오는 데 실패했습니다.");
        }
      } catch (error) {
        setError("네트워크 오류가 발생했습니다.");
      }

      setLoading(false);
    };

    fetchSearchResults();
  };

  const handleCardClick = (poNum) => {
    // 클릭 시 게시물 상세 페이지로 이동
    navigate(`/posts/${poNum}`);
  };

  return (
    <div className="post-search-container">
      <h2>게시물 검색</h2>

      {/* 검색 폼 */}
      <form onSubmit={handleSearch} className="search-form">
        <select
          value={searchOption}
          onChange={(e) => setSearchOption(e.target.value)}
          className="search-option"
        >
          <option value="userId">사용자 아이디</option>
          <option value="content">내용</option>
          <option value="hashtag">해시태그</option>
        </select>
        <input
          type="text"
          value={searchTerm || ""}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="검색어를 입력하세요"
          className="search-input"
        />
        <button type="submit" className="search-button">
          검색
        </button>
      </form>

      {/* 인기 검색 키워드 */}
      {!searchTerm && (
        <div className="popular-keywords">
          <h3>인기 검색 키워드</h3>
          <div className="keywords-list">
            {popularKeywords.map((keyword, index) => (
              <span
                key={index}
                className="keyword"
                onClick={() => handleKeywordClick(keyword)}
              >
                #{keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 검색 결과 */}
      <div className="search-results">
        {loading && <p>검색 중...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && searchResults.length > 0 && (
          <div>
            <h3>검색 결과</h3>
            {searchResults.map((post) => (
            <div key={post.poNum}
            className="post-card"
            onClick={() => handleCardClick(post.poNum)} // 클릭 시 상세 페이지로 이동
            >

            <p>작성자: {post.userId ? post.userId : "Unknown"} </p>
            <h4>{post.poContents}</h4>
            {post.fileUrl && (
              <div className="post-media">
                {post.fileUrl.endsWith(".mp4") ? (
                  <video controls>
                    <source src={post.fileUrl} type="video/mp4" />
                  </video>
                ) : (
                  <img src={post.fileUrl} alt="Uploaded" />
                )}
              </div>
            )}
            <p>👁 {post.viewCnt}  👍 {post.likes}</p>
            <div className="post-hashtags">
              {post.hashtags.map((tag) => (
                <span key={tag} className="hashtag" onClick={() => handleKeywordClick(tag)}>
                  #{tag}
                </span>
              ))}
            </div>
          </div>
          
            ))}
          </div>
        )}
        {!loading && !error && searchResults.length === 0 && (
          <p>검색 결과가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default PostSearch;