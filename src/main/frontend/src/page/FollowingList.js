import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import "./FollowingList.css"; // CSS 파일에서 레이아웃 조정

const FollowingList = () => {
  const { user, loading: authLoading } = useAuth(); // 인증된 사용자 정보 가져오기
  const [following, setFollowing] = useState([]); // 팔로잉 목록 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  useEffect(() => {
    const fetchFollowingList = async () => {
      const token = localStorage.getItem("jwtToken");
  
      if (!token) {
        setError("No valid token found.");
        setLoading(false);
        return;
      }
  
      try {
        const response = await axios.get("/follow/following", {
          headers: {
            Authorization: `Bearer ${token}`, // 토큰을 헤더에 포함
          },
        });
  
        // 응답 데이터 확인
        console.log("Response data: ", response.data);
  
        if (Array.isArray(response.data)) {
          // 필터링 조건을 제거하고 그대로 사용하거나 followingId가 있는 데이터만 사용
          const validFollowing = response.data.filter(follow => follow.followingId); 
          console.log("validFollowing: ", validFollowing);
          setFollowing(validFollowing);
        } else {
          setFollowing([]);
          setError("Invalid response data format");
        }
      } catch (error) {
        console.error("Error fetching following list:", error);
        setError("Failed to fetch following list.");
      } finally {
        setLoading(false);
      }
    };
  
    if (!authLoading) {
      fetchFollowingList();
    }
  }, [authLoading]);
  
  

  if (loading || authLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="following-list-container">
      <h2>팔로잉 목록</h2>
      <div className="following-list">
        {following.length > 0 ? (
          following.map((follow) => (
            <div key={follow.id} className="following-item">
              <img
                src={follow.followingPhoto || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                alt={follow.followingId}
                className="following-photo"
              />
              <div className="following-info">
                <span className="following-name">{follow.followingName}</span>
                <span className="following-id">@{follow.followingId}</span>
                <p className="following-introduction">{follow.Introduction || " "}</p>
              </div>
              <Link to={`/users/${follow.followingId}`} className="view-profile-btn">
                프로필 보기
              </Link>
            </div>
          ))
        ) : (
          <p>팔로잉이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default FollowingList;
