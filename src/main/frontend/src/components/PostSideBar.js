import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'; // 사이드바 관련 CSS 파일 임포트

const  PostSideBar = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      const token = localStorage.getItem('jwtToken');

      if (!token) return;

      try {
        const response = await fetch('/notifications/unread-count', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUnreadCount(data.count);
        }
      } catch (error) {
        console.error('Failed to fetch unread count');
      }
    };

    fetchUnreadCount();

    // 실시간 업데이트를 위해 일정 간격으로 unread count를 갱신
    const interval = setInterval(fetchUnreadCount, 10000); // 10초마다 갱신

    return () => clearInterval(interval);
  }, []);


  return (
    <nav>
    <div className="sidebar">
    <Link to="/posts">게시글</Link>
    <Link to="/post-search">검색</Link>
    <Link to="/recommendations">추천</Link>
    <Link to="/chat">메시지</Link>
    <Link to="/notifications">알림
    {unreadCount > 0 && <span style={{ color: 'red' }}> ({unreadCount})</span>}
    </Link>
    <Link to="/liked-posts">좋아요 목록</Link>
    <Link to="/totalmypage">프로필</Link>
    </div>
    </nav>
  );
};

export default PostSideBar;