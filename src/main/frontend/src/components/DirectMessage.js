import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from './AuthContext';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import axios from 'axios';
import "./DirectMessage.css";

const DirectMessage = ({ isOpen, onClose, userId }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!user) return;

      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get(`http://localhost:8080/messages/${user.id}/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    if (isOpen) {
      fetchMessages();
      connectWebSocket(); // WebSocket 연결
    }

    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, [userId, user, isOpen]);

  const connectWebSocket = () => {
    const socket = new SockJS('http://localhost:8080/ws');
    const client = Stomp.over(socket);

    client.connect({}, (frame) => {
      console.log('Connected: ' + frame);
      setStompClient(client);
      client.subscribe(`/user/${user.id}/queue/messages`, onMessageReceived); // 메시지 수신 구독
    }, (error) => {
      console.error('WebSocket error:', error);
    });
  };

  const onMessageReceived = (payload) => {
    const message = JSON.parse(payload.body);
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const sendMessage = async () => {
    if (!messageInput) return;

    try {
      const token = localStorage.getItem('jwtToken');
      const messageData = {
        senderId: user.id,
        recipientId: userId,
        content: messageInput,
        timestamp: new Date(),
      };

      // WebSocket을 통해 메시지 전송
      if (stompClient) {
        stompClient.send("/app/chat", {}, JSON.stringify(messageData));
      }

      setMessages(prev => [...prev, messageData]); // UI에 새 메시지 추가
      setMessageInput(""); // 입력 필드 초기화
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Direct Messages with User ID: {userId}</h2>
        {messages.length > 0 ? (
          <div className="messages-container">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.senderId === user.id ? 'sent' : 'received'}`}
              >
                <strong>{msg.senderId === user.id ? '나' : 'Other User'}:</strong>
                <p>{msg.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No messages found.</p>
        )}
        <div className="message-input">
          <input
            type="text"
            placeholder="Type your message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
        <div ref={messagesEndRef} />
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default DirectMessage;
