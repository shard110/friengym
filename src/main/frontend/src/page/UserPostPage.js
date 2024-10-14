import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import "./UserPostPage.css";

const UserPostPage = () => {
  const { id } = useParams(); // URL의 유저 ID 파라미터
  const { user, loading: authLoading } = useAuth(); // 현재 로그인한 유저 정보
  const [userInfo, setUserInfo] = useState(null); // 조회할 사용자 정보
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState(false); // 팔로잉 상태
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [blocked, setBlocked] = useState(false); // 초기값을 false로 설정
  const [isFollowingMe, setIsFollowingMe] = useState(false); // 다른 사용자가 나를 팔로우 중인지 여부

  const navigate = useNavigate();

  // 유저의 게시물과 팔로우 상태를 가져오는 함수
  const fetchUserPostInfo = useCallback(async () => {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      setError("No valid token found.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`/api/user/${id}/posts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        const { user: userData, posts, isFollowing, isBlocked } = response.data;

        setUserInfo(userData);
        setPosts(posts);
        setFollowing(isFollowing); // 현재 팔로우 여부 설정
        setBlocked(isBlocked); // 서버에서 받은 차단 상태로 업데이트
      } else {
        setError("Invalid response data format");
      }
    } catch (error) {
      console.error("Error fetching user post page data:", error);
      setError("Failed to fetch user info.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const checkIfFollowingMe = async () => {
    const token = localStorage.getItem("jwtToken");
    try {
      const response = await axios.get(
        `/follow/is-following-me/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsFollowingMe(response.data); // 서버로부터 맞팔로우 상태 업데이트
    } catch (error) {
      console.error("Error checking if user is following me:", error);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchUserPostInfo();
      checkIfFollowingMe(); // 맞팔로우 상태 확인
    }
  }, [authLoading, fetchUserPostInfo]);

  

  // 팔로우/언팔로우 함수
  const handleFollowToggle = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const url = following
        ? `/follow/unfollow/${id}` // 언팔로우 URL
        : `/follow/follow/${id}`; // 팔로우 URL

      const method = following ? "DELETE" : "POST"; // 언팔로우는 DELETE, 팔로우는 POST

      const response = await axios({
        method,
        url,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setFollowing(!following); // 팔로우 상태 업데이트
        alert(following ? "언팔로우 성공" : "팔로우 성공");
      }
    } catch (error) {
      console.error("팔로우/언팔로우 처리 중 오류:", error);
      alert("처리 중 오류가 발생했습니다.");
    }
  };

  // 차단하기 기능
const handleBlockUser = async () => {
  const token = localStorage.getItem("jwtToken");

  if (!token) {
    alert("로그인이 필요합니다.");
    return;
  }

  try {
    const response = await axios.post(`/api/block/${userInfo.id}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      alert("차단 완료");
      navigate("/totalmypage"); // 차단 후 내 페이지로 이동
    }
  } catch (error) {
    console.error("차단 처리 중 오류:", error);
    alert("차단 처리에 실패했습니다.");
  }
};

//차단해제
const handleUnblockUser = async () => {
  const token = localStorage.getItem("jwtToken");

  if (!token) {
    alert("로그인이 필요합니다.");
    return;
  }

  try {
    const response = await axios.delete(`/api/block/${userInfo.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      alert("차단 해제 완료");
      setBlocked(false); // 차단 상태 업데이트
    }
  } catch (error) {
    console.error("차단 해제 처리 중 오류:", error);
    alert("차단 해제에 실패했습니다.");
  }
};


  if (loading || authLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userInfo) {
    return <div>Error: Failed to load user information.</div>;
  }

  return (
    <div className="user-postpage-container">
      <div className="profile-section">
        <div className="profile-header">
          <div className="user-info">
            <img
              src={userInfo.photo || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
              alt={userInfo.id}
              className="user-photo"
            />
            <span>{userInfo.id}</span>
          </div>
          <div className="profile-info">
            <h2>{userInfo.name}</h2>
          </div>
        </div>
        <div className="profile-actions">
          {user?.id !== userInfo.id && (
            <>
              <button onClick={handleFollowToggle} className="follow-btn">
                {following ? "언팔로우" : isFollowingMe ? "맞팔로우" : "팔로우"}
              </button>


              {/* 차단하기 버튼 */}
              {blocked ? (
                <button onClick={handleUnblockUser} className="unblock-btn">차단 해제</button>
              ) : (
                <button onClick={handleBlockUser} className="block-btn">차단하기</button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="posts-section">
        <h2>{userInfo.name}님의 게시물</h2>
        <div className="posts-grid">
          {posts.map((post) => (
            <div key={post.poNum} className="post-item">
              {post.fileUrl ? (
                <img src={post.fileUrl} alt="Post" />
              ) : (
                <div className="post-text">{post.poContents || "내용 없음"}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserPostPage;
