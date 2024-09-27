import React, { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { useAuth } from "./AuthContext"; // AuthContext import
import "./Chat.css";

function Chat() {
  const { user } = useAuth(); // 로그인한 사용자 정보 가져오기
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [stompClient, setStompClient] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(false); // 로딩 상태 추가

  const messagesEndRef = useRef(null); // 메시지 끝을 참조할 ref 추가

  useEffect(() => {
    const connect = () => {
      const socket = new SockJS("http://localhost:8080/ws");
      const client = Stomp.over(socket);

      client.connect(
        {},
        (frame) => {
          setStompClient(client);
          onConnected(client);
        },
        onError
      );
    };
    connect(); // 컴포넌트가 마운트될 때 connect 호출
  }, []); // 빈 배열로 의존성 설정하여 컴포넌트 마운트 시 한 번만 실행

  const onConnected = (client) => {
    if (!user || !user.id) {
      console.error("User is not authenticated");
      return; // user가 없으면 함수 종료
    }
    client.subscribe(`/user/${user.id}/queue/messages`, onMessageReceived);
    fetchConnectedUsers();
  };

  const fetchConnectedUsers = async () => {
    setLoading(true); // 로딩 시작 
    try {
        const response = await fetch("http://localhost:8080/users");
        const data = await response.json();
        console.log("Fetched users:", data);
         // 현재 사용자를 제외하고 상태 업데이트
         setConnectedUsers(data);
    } catch (error) {
      console.error("Error fetching connected users:", error);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchConnectedUsers(); // 컴포넌트가 마운트될 때 온라인 사용자 목록을 가져옵니다.
  }, []);

  const onMessageReceived = (payload) => {
    const message = JSON.parse(payload.body);
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const sendMessage = () => {
    if (messageInput && selectedUserId && stompClient) {
      const chatMessage = {
        senderId: user.id,
        recipientId: selectedUserId,
        content: messageInput,
        timestamp: new Date(),
      };

      // 메시지를 보내기 전에 상태에 추가
      setMessages((prevMessages) => [...prevMessages, chatMessage]);
      stompClient.send("/app/chat", {}, JSON.stringify(chatMessage));
      setMessageInput("");
    } else {
      console.error("Cannot send message: stompClient is null or input is invalid.");
    }
  };

  const handleUserClick = async (userId) => {
    setSelectedUserId(userId);
    console.log("Selected user ID:", userId);
    await fetchAndDisplayUserChat(userId); // 대화 내용 불러오기
  };

  const fetchAndDisplayUserChat = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/messages/${user.id}/${userId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const chatHistory = await response.json();
      setMessages(chatHistory);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]); // messages가 변경될 때 스크롤

  const onError = (error) => {
    console.error("WebSocket error:", error);
    alert("WebSocket connection error. Please try again later.");
  };

  return (
    <div className="chat-container">
      <div className="chat-area">
        <div className="user-info">
          <p>Welcome, {user ? user.name : "사용자"}!</p>{" "}
          {/* user가 없을 경우 대비 */}
        </div>
        {selectedUserId && (
          <div className="current-chat">
            <p>
              대화 중인 사용자:{" "}
              {connectedUsers.find((user) => user.id === selectedUserId)
                ?.name || "사용자를 선택하세요."}
            </p>
          </div>
        )}
   <div className="users-list">
      <h2>Online Users</h2>
      {loading ? (
        <p>Loading...</p> // 로딩 중 표시
      ) : connectedUsers.length > 0 ? (
        <ul>
          {connectedUsers.map((u) => (
            <li key={u.id} onClick={() => handleUserClick(u.id)}>
              {u.name}
            </li>
          ))}
        </ul>
      ) : (
        <p>온라인 사용자가 없습니다.</p>
      )}
    </div>

        <div className="messages">
          {selectedUserId &&
            messages
              .filter(
                (msg) =>
                  msg.senderId === selectedUserId ||
                  msg.recipientId === selectedUserId
              )
              .map((msg, index) => (
                <div
                  key={index}
                  className={msg.senderId === user.id ? "sender" : "receiver"}
                >
                  <p>{msg.content}</p>
                </div>
              ))}
          <div ref={messagesEndRef} /> {/* 메시지 끝에 ref 추가 */}
        </div>

        {selectedUserId && (
          <div className="message-input">
            <input
              type="text"
              placeholder="Type your message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
