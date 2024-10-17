import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { useAuth } from "../components/AuthContext";

const ChatPage = () => {
  const { senderId, recipientId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const token = localStorage.getItem("jwtToken");
  const [message, setMessage] = useState("");
  const [stompClient, setStompClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);

  // 사용자 이름을 가져오는 함수 (이름을 표시하지 않으므로 이 부분은 삭제)
  const fetchUserNames = async () => {
    try {
      const response = await fetch(`http://localhost:8080/users/${senderId},${recipientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
      },
      });
      const users = await response.json();
      const namesMap = {};
      users.forEach(user => {
        namesMap[user.id] = user.name;
      });
      console.log("사용자 이름 맵:", namesMap); // 디버깅 로그
    } catch (error) {
      console.error("Error fetching user names:", error);
    }
  };

  useEffect(() => {
    fetchUserNames(); // 컴포넌트 마운트 시 사용자 이름 가져오기
  }, [senderId, recipientId]);

  useEffect(() => {
    if (!user || connected) {
      return;
    }

    const socket = new SockJS("http://localhost:8080/ws");
    const client = Stomp.over(socket);

    client.connect(
      { Authorization: `Bearer ${localStorage.getItem("token")}` },
      (frame) => {
        console.log("WebSocket 연결 성공:", frame); // 디버깅 로그
        setConnected(true);
        setStompClient(client);

        client.subscribe(
          `/user/${user.user.id}/queue/messages`,
          (messageOutput) => {
            const notification = JSON.parse(messageOutput.body);
            console.log("수신한 메시지:", notification); // 디버깅 로그

            if (notification.recipientId === user.user.id) {
              setMessages((prevMessages) => {
                if (!prevMessages.some(prevMsg => prevMsg.id === notification.id)) {
                  console.log("새 메시지 추가:", notification); // 디버깅 로그
                  return [
                    ...prevMessages,
                    { ...notification, isSender: notification.senderId === user.user.id },
                  ];
                }
                return prevMessages; // 중복 메시지 처리
              });
            }
          }
        );
      },
      (error) => {
        console.error("WebSocket 연결 실패:", error);
      }
    );

    return () => {
      if (client && connected) {
        client.disconnect(() => {
          console.log("WebSocket 연결 해제"); // 디버깅 로그
          setConnected(false);
        });
      }
    };
  }, [connected, user, senderId, recipientId]);

  const sendMessage = () => {
    if (stompClient && connected && message) {
      stompClient.send(
        "/app/chat",
        {},
        JSON.stringify({
          senderId: senderId,
          recipientId: recipientId,
          content: message,
          timestamp: new Date(),
        })
      );

      setMessages((prevMessages) => [
        ...prevMessages,
        { senderId: senderId, content: message, isSender: true },
      ]);

      console.log("메시지 전송:", message); // 디버깅 로그
      setMessage("");
    } else {
      console.error("WebSocket 연결이 되어 있지 않거나 메시지가 비어 있습니다.");
    }
  };

  const disconnectAndGoBack = () => {
    if (stompClient && connected) {
      stompClient.disconnect(() => {
        console.log("WebSocket 연결 해제"); // 디버깅 로그
        setConnected(false);
        navigate(`/userpostpage/${senderId}`);
      });
    } else {
      console.error("WebSocket 연결이 되어 있지 않습니다.");
    }
  };

  return (
    <div>
      <h2>DM</h2>
      {/* 대화 중인 사용자들의 ID 표시 */}
      <div>
        <p>대화 중인 사용자 ID: {recipientId}</p>
      </div>
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="메시지를 입력하세요"
        />
        <button onClick={sendMessage}>보내기</button>
      </div>
      <button onClick={disconnectAndGoBack}>닫기</button>

      <div>
        <h3>채팅 내역</h3>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.isSender ? "right" : "left",
              marginBottom: "10px",
              color: msg.isSender ? "blue" : "green",
            }}
          >
            <strong>{msg.isSender ? "나" : "상대방"}:</strong> {msg.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatPage;
