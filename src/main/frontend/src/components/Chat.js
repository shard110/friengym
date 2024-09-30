import React, { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { useAuth } from "./AuthContext"; 
import "./Chat.css";

function Chat() {
    const { user } = useAuth();
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [stompClient, setStompClient] = useState(null);
    const [messageInput, setMessageInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // 사용자가 클릭했을 때 대화 내용을 가져오는 함수
    const fetchAndDisplayUserChat = async (userId) => {
        try {
            const response = await fetch(`http://localhost:8080/messages/${user.id}/${userId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const chatHistory = await response.json();
            setMessages(chatHistory);
        } catch (error) {
            console.error("Error fetching chat history:", error);
        }
    };

    const handleUserClick = async (userId) => {
        setSelectedUserId(userId);
        console.log("Selected user ID:", userId);
        await fetchAndDisplayUserChat(userId); // 대화 내용 불러오기
    };

    useEffect(() => {
        console.log("Current user:", user); // 사용자 정보를 로그로 출력
    }, [user]);

    useEffect(() => {
        if (user && user.id) {
            const connect = () => {
                const socket = new SockJS("http://localhost:8080/ws");
                const client = Stomp.over(socket);

                client.connect({}, (frame) => {
                    setStompClient(client);
                    onConnected(client);
                }, onError);
            };

            connect();
        }
    }, [user?.id]); 

    const onConnected = (client) => {
        client.subscribe(`/user/${user.id}/queue/messages`, onMessageReceived);
        fetchConnectedUsers();
    };

    const fetchConnectedUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:8080/users");
            const data = await response.json();
            console.log("Fetched users:", data);
            setConnectedUsers(data.filter((u) => u.id !== user.id)); // 현재 사용자 제외
        } catch (error) {
            console.error("Error fetching connected users:", error);
        } finally {
            setLoading(false);
        }
    };

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
            setMessages((prevMessages) => [...prevMessages, chatMessage]);
            stompClient.send("/app/chat", {}, JSON.stringify(chatMessage));
            setMessageInput("");
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const onError = (error) => {
        console.error("WebSocket error:", error);
        alert("WebSocket connection error. Please try again later.");
    };

    if (!user || !user.id) {
        return <div>Loading...</div>;
    }

    return (
        <div className="chat-container">
            <div className="chat-area">
                <div className="user-info">
                    <p>Welcome, {user.name}!</p>
                </div>
                {selectedUserId && (
                    <div className="current-chat">
                        <p>
                            대화 중인 사용자:{" "}
                            {connectedUsers.find((u) => u.id === selectedUserId)?.name || "사용자를 선택하세요."}
                        </p>
                    </div>
                )}
                <div className="users-list">
                    <h2>Online Users</h2>
                    {loading ? (
                        <p>Loading...</p>
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
                            .filter((msg) => msg.senderId === selectedUserId || msg.recipientId === selectedUserId)
                            .map((msg, index) => (
                                <div key={index} className={msg.senderId === user.id ? "sender" : "receiver"}>
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
    );
}

export default Chat;
