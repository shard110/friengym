import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../components/AuthContext";
import "./Mypostpage.css";

const Mypostpage = () => {
  const { user, loading: authLoading } = useAuth(); // useAuth에서 user와 loading을 가져옴
  const [userInfo, setUserInfo] = useState(null); // 사용자 정보
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [image, setImage] = useState("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fileInput = useRef(null); // 파일 입력 참조

  // 유저의 게시물, 팔로잉, 팔로워 정보를 가져오는 함수
  const fetchUserPostInfo = useCallback(async () => {
    const token = localStorage.getItem("jwtToken");

    // 토큰이 없으면 에러 처리 및 리턴
    if (!token) {
      setError("No valid token found.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get("/api/mypostpage", {
        headers: {
          Authorization: `Bearer ${token}`, // 토큰을 헤더에 포함
        },
      });


      // 서버 응답 데이터 구조를 확인하고 안전하게 처리
    if (response.data) {
      const { posts = [], following = [], followers = [], user: userData = {} } = response.data;

      // userData가 존재하는지 확인한 후 상태 업데이트
      if (userData) {
        setUserInfo(userData);
        setImage(userData.photo || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png");
      }

      setPosts(posts);
      setFollowing(following);
      setFollowers(followers);
    } else {
      setError("Invalid response data format");
    }

  } catch (error) {
    console.error("Error fetching mypostpage data:", error);
    setError("Failed to fetch user info.");
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => {
    if (!authLoading) {
      fetchUserPostInfo();
    }
  }, [authLoading, fetchUserPostInfo]);

  // 프로필 사진 변경을 위한 함수
  const handleProfilePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        setError("No valid token found.");
        return;
      }

      const response = await axios.put("/api/user/update-photo", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setImage(response.data.photo); // 서버로부터 반환된 새로운 프로필 사진 URL로 업데이트
    } catch (error) {
      console.error("Failed to upload profile photo:", error);
    }
  };

  if (loading || authLoading) {
    return <div>Loading...</div>;
  }
  
  if (!userInfo) {
    return <div>Error: Failed to load user information.</div>;
  }
  

  if (error) {
    return <div>Error: {error}</div>; // 에러 발생 시 에러 메시지 출력
  }

  return (
    <div className="mypostpage-container">
      <div className="profile-section">
        <div className="profile-header">
          <div className="user-info">
            <img
              src={image}
              alt={user.id}
              className="user-photo"
              onClick={() => fileInput.current.click()} // 클릭 시 파일 선택 창 열기
            />
            <input
              type="file"
              ref={fileInput}
              style={{ display: "none" }}
              onChange={handleProfilePhotoChange} // 파일 선택 시 이벤트 발생
            />
            <span>{userInfo.id}</span>
          </div>
          <div className="profile-info">
          <h2>{userInfo.name}</h2>
            <div className="stats">
              <span>게시물 {posts.length}</span>
              <span>팔로워 {followers.length}</span>
              <span>팔로잉 {following.length}</span>
            </div>
          </div>
        </div>
        <div className="profile-actions">
          <button className="edit-profile-btn">프로필 편집</button>
          <button className="contact-btn">연락처</button>
        </div>
      </div>

      <div className="posts-section">
        <div className="posts-grid">
          {posts.map((post) => (
            <div key={post.poNum} className="post-item">
              <img src={post.fileUrl || "/default-post.jpg"} alt="Post" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Mypostpage;
