import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { useAuth } from "../components/AuthContext";
import Navbar from "../components/NavBar";

const ChatPage = () => {
  const { senderId, recipientId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const token = localStorage.getItem("jwtToken");  // JWT 토큰 가져오기
  const [message, setMessage] = useState("");
  const [stompClient, setStompClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);

  // WebSocket 연결 및 메시지 수신 설정
  useEffect(() => {
    if (!user || connected) {
      return;
    }

    const socket = new SockJS("http://localhost:8080/ws");
    const client = Stomp.over(socket);

    client.connect(
      { Authorization: `Bearer ${token}` }, // Authorization 헤더에 토큰 추가
      (frame) => {
        console.log("WebSocket 연결 성공:", frame);  // 디버깅 로그
        setConnected(true);
        setStompClient(client);

        // 수신한 메시지 처리
        client.subscribe(
          `/user/${user.user.id}/queue/messages`,
          (messageOutput) => {
            const notification = JSON.parse(messageOutput.body);
            // console.log("수신한 메시지:", notification);  // 디버깅 로그

            if (notification.recipientId === user.user.id) {
              setMessages((prevMessages) => {
                // 중복 메시지 처리
                if (!prevMessages.some((prevMsg) => prevMsg.id === notification.id)) {
                  return [
                    ...prevMessages,
                    { ...notification, isSender: notification.senderId === user.user.id },
                  ];
                }
                return prevMessages;
              });
            }
          }
        );
      },
      (error) => {
        console.error("WebSocket 연결 실패:", error);
      }
    );

    // 컴포넌트 언마운트 시 WebSocket 연결 해제
    return () => {
      if (client && connected) {
        client.disconnect(() => {
          console.log("WebSocket 연결 해제");  // 디버깅 로그
          setConnected(false);
        });
      }
    };
  }, [connected, user, senderId, recipientId, token]);

  // 메시지 보내기
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

      console.log("메시지 전송:", message);  // 디버깅 로그
      setMessage("");  // 메시지 입력창 비우기
    } else {
      console.error("WebSocket 연결이 되어 있지 않거나 메시지가 비어 있습니다.");
    }
  };

  // WebSocket 연결 해제 및 페이지 이동
  const disconnectAndGoBack = () => {
    if (stompClient && connected) {
      stompClient.disconnect(() => {
        console.log("WebSocket 연결 해제");  // 디버깅 로그
        setConnected(false);
        navigate(`/users/${recipientId}`);
      });
    } else {
      console.error("WebSocket 연결이 되어 있지 않습니다.");
    }
  };

  return (
    <div>
      <Navbar />
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
