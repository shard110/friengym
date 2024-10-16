import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

const ChatPage = () => {
  const { senderId, recipientId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [message, setMessage] = useState(""); // 메시지 상태
  const [stompClient, setStompClient] = useState(null); // STOMP 클라이언트 상태
  const [connected, setConnected] = useState(false); // 연결 상태
  const [messages, setMessages] = useState([]); // 메시지 리스트

  // 메시지 상태가 변경될 때마다 확인
  useEffect(() => {
    console.log("메시지 리스트 업데이트:", messages);
  }, [messages]);

  useEffect(() => {
    if (connected) {
      console.log("WebSocket 이미 연결됨");
      return;
    }

    const socket = new SockJS("http://localhost:8080/ws");
    const client = Stomp.over(socket);

    client.connect(
      { Authorization: `Bearer ${localStorage.getItem("token")}` },
      (frame) => {
        console.log("WebSocket 연결 성공", frame);
        setConnected(true); // 연결 상태 업데이트

        client.subscribe(
          `/user/${user.user.id}/queue/messages`,
          (messageOutput) => {
            const notification = JSON.parse(messageOutput.body);
            console.log("수신한 메시지:", notification);

            // 메시지가 수신자의 ID 또는 발신자의 ID와 일치하는지 확인
            if (notification.recipientId === senderId || notification.senderId === senderId) {
              console.log("메시지를 추가합니다:", notification.content);

              // 메시지 상태 업데이트
              setMessages((prevMessages) => [
                ...prevMessages,
                { ...notification, isSender: notification.senderId === senderId },
              ]);
            }
          }
        );
      },
      (error) => {
        console.error("WebSocket 연결 실패:", error);
      }
    );

    setStompClient(client);

    return () => {
      if (client && connected) {
        client.disconnect(() => {
          console.log("WebSocket 연결 해제");
          setConnected(false);
        });
      }
    };
  }, [connected, senderId, recipientId, user.user.id]);

  const sendMessage = () => {
    if (stompClient && connected && message) {
      // 메시지 전송
      stompClient.send(
        "/app/chat",
        {},
        JSON.stringify({
          senderId: senderId, // 현재 로그인한 사용자의 ID
          recipientId: recipientId, // 메시지 수신자의 ID
          content: message,
        })
      );

      // 메시지 전송 후 로컬 메시지 리스트에 추가
      setMessages((prevMessages) => [
        ...prevMessages,
        { senderId: senderId, content: message, isSender: true },
      ]);

      setMessage(""); // 메시지 전송 후 입력창 비우기
    } else {
      console.error("WebSocket 연결이 되어 있지 않거나 메시지가 비어 있습니다.");
    }
  };

  const disconnectAndGoBack = () => {
    if (stompClient && connected) {
      stompClient.disconnect(() => {
        console.log("WebSocket 연결 해제");
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

      {/* 메시지 리스트를 표시 */}
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
            <strong>{msg.isSender ? "나" : msg.senderId}:</strong> {msg.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatPage;
