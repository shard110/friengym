// Chat.js
import React, { useState } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import './Chat.css';

function App() {
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [stompClient, setStompClient] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const connect = (event) => {
        event.preventDefault();
        const socket = new SockJS('http://localhost:8080/ws');
        const client = Stomp.over(socket);

        client.connect({}, (frame) => {
            setStompClient(client);
            onConnected(client);
            setIsLoggedIn(true);
        }, onError);
    };

    const onConnected = (client) => {
        client.subscribe(`/user/${id}/queue/messages`, onMessageReceived);
        fetchConnectedUsers();
    };

    const fetchConnectedUsers = async () => {
        try {
            const response = await fetch('http://localhost:8080/users');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setConnectedUsers(data.filter(user => user.id !== id));
        } catch (error) {
            console.error('Error fetching connected users:', error);
        }
    };

    const onMessageReceived = (payload) => {
        const message = JSON.parse(payload.body);
        setMessages(prevMessages => [...prevMessages, message]);
    };

    const sendMessage = () => {
        if (messageInput && selectedUserId) {
            const chatMessage = {
                senderId: id,
                recipientId: selectedUserId,
                content: messageInput,
                timestamp: new Date(),
            };

            stompClient.send('/app/chat', {}, JSON.stringify(chatMessage));
            setMessageInput('');
        }
    };

    const handleUserClick = async (userId) => {
        setSelectedUserId(userId);
        console.log("Selected user ID:", userId);
        await fetchAndDisplayUserChat(userId); // 대화 내용 불러오기
    };

    const fetchAndDisplayUserChat = async (userId) => {
        try {
            const response = await fetch(`http://localhost:8080/messages/${id}/${userId}`);
            const chatHistory = await response.json();
            setMessages(chatHistory); // 선택된 사용자와의 대화 내역 업데이트
        } catch (error) {
            console.error('Error fetching chat history:', error);
        }
    };

    const onError = (error) => {
        console.error('WebSocket error:', error);
        alert('WebSocket connection error. Please try again later.');
    };

    return (
        <div className="chat-container">
            {!isLoggedIn ? (
                <div className="user-form" id="username-page">
                    <form onSubmit={connect}>
                        <label htmlFor="id">ID:</label>
                        <input
                            type="text"
                            id="id"
                            value={id}
                            onChange={e => setId(e.target.value)}
                            required
                        />
                        <label htmlFor="name">이름:</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                        />
                        <button type="submit">Enter Chatroom</button>
                    </form>
                </div>
            ) : (
                <div className="chat-area">
                    <div className="user-info">
                        <p>Welcome, {name}!</p>
                    </div>
                    {selectedUserId && (
                        <div className="current-chat">
                            <p> 대화 중인 사용자: {connectedUsers.find(user => user.id === selectedUserId)?.name}</p>
                        </div>
                    )}
                    <div className="users-list">
                        <h2>Online Users</h2>
                        <ul>
                            {connectedUsers.map(user => (
                                <li key={user.id} onClick={() => handleUserClick(user.id)}>
                                    {user.name}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="messages">
                        {selectedUserId && messages
                            .filter(msg => (msg.senderId === selectedUserId || msg.recipientId === selectedUserId))
                            .map((msg, index) => (
                                <div key={index} className={msg.senderId === id ? 'sender' : 'receiver'}>
                                    <p>{msg.content}</p>
                                </div>
                            ))}
                    </div>

                    {selectedUserId && (
                        <div className="message-input">
                            <input
                                type="text"
                                placeholder="Type your message..."
                                value={messageInput}
                                onChange={e => setMessageInput(e.target.value)}
                            />
                            <button onClick={sendMessage}>Send</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default App;
