import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import Chat from "../components/Chat"; //추가
import "./Mypostpage.css";

// MyPageSideBar 컴포넌트 추가
const MyPageSideBar = () => {
  return (
    <div className="mypage-sidebar">
      <ul>
        <li>
          <Link to="/mypage">회원정보수정</Link>
        </li>
        <li>
          <Link to="/myorderpage">나의 주문내역보기</Link>
        </li>
      </ul>
    </div>
  );
};


const Mypostpage = () => {
  const { user, loading: authLoading } = useAuth(); // useAuth에서 user와 loading을 가져옴
  const [userInfo, setUserInfo] = useState(null); // 사용자 정보
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [image, setImage] = useState("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png");
  const [introduction, setIntroduction] = useState(""); // 소개 정보
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // 편집 모드 상태
  const fileInput = useRef(null); // 파일 입력 참조
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅
  const [isChatOpen, setIsChatOpen] = useState(false); // 채팅 모드 상태 추가
  const [currentChatUserId, setCurrentChatUserId] = useState(null); // 현재 채팅 사용자 ID 저장

  // DM 버튼 클릭 핸들러
  const handleOpenChat = (authorId) => {
    console.log("DM 버튼 클릭:", authorId); // 확인용 로그
    setCurrentChatUserId(authorId); // 작성자 ID 설정
    setIsChatOpen(true); // 채팅 열기
  };

  const handleCloseChat = () => {
    setIsChatOpen(false); // 채팅 닫기
    setCurrentChatUserId(null); // 채팅 사용자 ID 초기화
  };



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
          setIntroduction(userData.introduction || ""); // 소개 설정
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

  // 소개 변경 함수
  const handleIntroductionChange = (e) => {
    setIntroduction(e.target.value);
  };

  // 프로필 편집 저장 함수
  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        setError("No valid token found.");
        return;
      }

      const response = await axios.put(
        "/api/update-postpage",
        { introduction },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setUserInfo((prev) => ({ ...prev, introduction: response.data.introduction }));
      setIsEditing(false); // 편집 모드 종료
    } catch (error) {
      console.error("Failed to update profile:", error);
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
      <MyPageSideBar /> {/* 사이드바 추가 */}
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
              <button onClick={() => navigate("/followers")} className="follower-list-btn">
                팔로워 {followers.length}
              </button>
              <button onClick={() => navigate("/following")} className="following-list-btn">
                팔로잉 {following.length}
              </button>
            </div>
          </div>
        </div>
        {isEditing ? (
          <textarea
            className="user-introduction"
            value={introduction}
            onChange={handleIntroductionChange}
            placeholder="자기 소개를 입력하세요."
          />
        ) : (
          <p>{introduction || "소개가 없습니다."}</p>
        )}
        <div className="profile-actions">
          {isEditing ? (
            <button className="edit-profile-btn" onClick={handleSaveProfile}>프로필 편집 저장</button>
          ) : (
            <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>프로필 편집</button>
          )}
          <button className="contact-btn" onClick={() => navigate('/chat')}>DM</button>
        </div>

        {isChatOpen && (
          <div className="chat-modal">
            <Chat recipientId={currentChatUserId} /> {/* 현재 채팅 사용자 ID 전달 */}
            <button onClick={handleCloseChat}>Close</button>
          </div>
        )}
      </div>

      <div className="posts-section">
  {/* 미디어 게시글 */}
    <h2>Media</h2>
    <div className="posts-grid">
      {posts
        .filter((post) => post.fileUrl)
        .map((post) => (
          <div
            key={post.poNum}
            className="post-item"
            onClick={() => navigate(`/posts/${post.poNum}`)}
          >
            {/\.(jpeg|jpg|png|gif|jfif)$/i.test(post.fileUrl) ? (
              <img src={post.fileUrl} alt="Post" />
            ) : /\.(mp4|webm|ogg)$/i.test(post.fileUrl) ? (
              <video
                src={post.fileUrl}
                controls
                autoPlay
                muted
                loop
                className="post-video"
              />
            ) : (
              <p>Unsupported media type</p>
            )}
            <div className="post-info"></div>
          </div>
        ))}
    </div>

        {/* 텍스트 게시글 */}
        <h2>Text</h2>
        <div className="posts-grid">
          {posts
            .filter((post) => !post.fileUrl)
            .map((post) => (
              <div key={post.poNum}
                className="post-item"
                onClick={() => navigate(`/posts/${post.poNum}`)}
              >
                <div className="post-info">
                  <h4>{post.poContents || "내용 없음"}</h4>
                </div>
              </div>
            ))}
        </div>
      </div>

    </div>
  );
};
export default Mypostpage;
