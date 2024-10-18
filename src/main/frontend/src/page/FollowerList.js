import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import "./FollowerList.css";

const FollowerList = () => {
  const { user, loading: authLoading } = useAuth(); // 인증된 사용자 정보 가져오기
  const [followers, setFollowers] = useState([]); // 팔로워 목록 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  useEffect(() => {
    const fetchFollowerList = async () => {
      const token = localStorage.getItem("jwtToken");

      if (!token) {
        setError("No valid token found.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("/follow/followers", {
          headers: {
            Authorization: `Bearer ${token}`, // 토큰을 헤더에 포함
          },
        });

        // 응답 데이터 구조 확인을 위해 로그 출력
        console.log("Response data: ", response.data);

        if (Array.isArray(response.data)) {
          // 유효한 데이터만 필터링하여 상태로 설정
          const validFollowers = response.data.filter(follower => follower.followerId);
          console.log("validFollowers: ", validFollowers);
          setFollowers(validFollowers);
        } else {
          setError("Invalid response data");
        }
      } catch (error) {
        console.error("Error fetching follower list:", error);
        setError("Failed to fetch follower list.");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchFollowerList();
    }
  }, [authLoading]);

  if (loading || authLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="follower-list-container">
      <h2>팔로워 목록</h2>
      <div className="follower-list">
        {followers.length > 0 ? (
          followers.map((follower) => (
            <div key={follower.followerId} className="follower-item">
              <img
                src={follower.followerPhoto || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                alt={follower.followerId}
                className="follower-photo"
              />
              <div className="follower-info">
                <span>{follower.followerName}</span>
                <span>@{follower.followerId}</span>
              </div>
              <Link to={`/users/${follower.followerId}`} className="view-profile-btn">
                프로필 보기
              </Link>
            </div>
          ))
        ) : (
          <p>팔로워가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default FollowerList;
