// src/components/Notifications.js

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem('jwtToken');

      if (!token) {
        // 로그인되어 있지 않으면 로그인 페이지로 이동
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('/notifications', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setNotifications(data);
        } else {
          console.error('Failed to fetch notifications');
        }
      } catch (error) {
        console.error('Network error:', error);
      }
    };

    fetchNotifications();
  }, [navigate]);

  const handleNotificationClick = async (notification) => {
    const token = localStorage.getItem('jwtToken');

    // 알림 읽음 처리
    try {
      await fetch(`/notifications/${notification.id}/read`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Failed to mark notification as read');
    }

    // 해당 게시물로 이동
    navigate(`/posts/${notification.postId}`);
  };

  return (
    <div>
      <h2>알림</h2>
      {notifications.length > 0 ? (
        <ul>
          {notifications.map((notification) => (
            <li
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              style={{
                cursor: 'pointer',
                backgroundColor: notification.isRead ? '#f0f0f0' : '#fff',
                padding: '10px',
                marginBottom: '5px',
                border: '1px solid #ccc',
              }}
            >
              <p>{notification.message}</p>
              <span>{new Date(notification.createdAt).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>알림이 없습니다.</p>
      )}
    </div>
  );
};

export default Notifications;