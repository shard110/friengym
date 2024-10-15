import React, { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { useAuth } from "./AuthContext";
import "./Chat.css";

function Chat() {
    const { user } = useAuth();
    const token = localStorage.getItem("jwtToken");
    const [inChatUsers, setInChatUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [stompClient, setStompClient] = useState(null);
    const [messageInput, setMessageInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState({});
    const messagesEndRef = useRef(null);

    // 대화 상대의 채팅 기록을 가져옵니다.
    const fetchAndDisplayUserChat = async (userId) => {
        try {
            const response = await fetch(
                `http://localhost:8080/messages/${user.user.id}/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
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

    // 사용자 클릭 시 해당 사용자와의 채팅을 표시합니다.
    const handleUserClick = async (userId) => {
        setSelectedUserId(userId);
        await fetchAndDisplayUserChat(userId);
        setNotifications((prev) => ({
            ...prev,
            [userId]: 0,
        }));
    };

    useEffect(() => {
        console.log("Current user:", user?.user);
    }, [user]);

    // WebSocket 연결 및 사용자 목록을 가져옵니다.
    useEffect(() => {
        if (user && user.user && user.user.id && token) {
            const socket = new SockJS("http://localhost:8080/ws");
            const client = Stomp.over(socket);

            client.connect(
                { Authorization: `Bearer ${token}` },
                (frame) => {
                    console.log("WebSocket connected:", frame);
                    setStompClient(client);
                    client.subscribe(`/user/${user.user.id}/queue/messages`, onMessageReceived);
                    fetchInChatUsers();
                },
                onError
            );

            return () => {
                if (client.connected) {
                    client.disconnect(() => {
                        console.log("WebSocket disconnected.");
                    });
                }
            };
        }
    }, [user?.user?.id, token]);

    // 대화 중인 사용자 목록을 가져옵니다.
    const fetchInChatUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `http://localhost:8080/in-chat?userId=${user.user.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log("Fetched in-chat users:", data); // 디버깅용 로그
    
            // 사용자 목록을 객체 형태로 변환
            const usersWithNames = data.map((userId) => ({
                id: userId,
                name: userId, // 이름도 userId로 설정, 필요에 따라 변경
            }));
    
            setInChatUsers(usersWithNames);
        } catch (error) {
            console.error("Error fetching in-chat users:", error);
        } finally {
            setLoading(false);
        }
    };

    // 메시지를 수신할 때 호출되는 함수입니다.
    const onMessageReceived = (payload) => {
        const message = JSON.parse(payload.body);
        setMessages((prevMessages) => [...prevMessages, message]);

        if (message.senderId !== user.user.id) {
            setNotifications((prev) => ({
                ...prev,
                [message.senderId]: (prev[message.senderId] || 0) + 1,
            }));
        }
    };

    // 메시지를 전송합니다.
    const sendMessage = () => {
        if (messageInput && selectedUserId && stompClient) {
            const chatMessage = {
                senderId: user.user.id,
                recipientId: selectedUserId,
                content: messageInput,
                timestamp: new Date(),
            };
            setMessages((prevMessages) => [...prevMessages, chatMessage]);
            stompClient.send("/app/chat", {}, JSON.stringify(chatMessage));
            setMessageInput("");
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // WebSocket 오류 처리
    const onError = (error) => {
        console.error("WebSocket error:", error);
        alert("WebSocket connection error. Please try again later.");
    };

    if (!user || !user.user || !user.user.id) {
        return <div>Loading...</div>;
    }

    return (
        <div className="chat-container">
            <div className="chat-wrapper">
                <div className="users-list">
                    <h2>In-Chat Users</h2>
                    {loading ? (
    <p>Loading...</p>
) : inChatUsers.length > 0 ? (
    <ul>
        {inChatUsers.map((u, index) => (
            <li key={index} onClick={() => handleUserClick(u.id)}>
                {u.name} {/* 이제 u.name이 존재함 */}
                {notifications[u.id] > 0 && (
                    <span className="notification-badge">
                        {notifications[u.id]}
                    </span>
                )}
            </li>
        ))}
    </ul>
) : (
    <p>현재 채팅 중인 사용자가 없습니다.</p>
)}
                </div>
                <div className="chat-area">
                    <div className="user-info">
                        <p>Welcome, {user.user.name}!</p>
                    </div>
                    {selectedUserId && (
                        <div className="current-chat">
                            <p>
                                대화 중인 사용자:{" "}
                                {inChatUsers.find((u) => u.id === selectedUserId)?.name || "사용자를 선택하세요."}
                            </p>
                        </div>
                    )}
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
                                        className={msg.senderId === user.user.id ? "sender" : "receiver"}
                                    >
                                        <p>{msg.content}</p>
                                    </div>
                                ))}
                        <div ref={messagesEndRef} />
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
        </div>
    );
}

export default Chat;
