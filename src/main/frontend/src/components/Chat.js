// Chat.js
import React, { useState, useEffect } from "react";
import Stomp from "stompjs";
import SockJS from "sockjs-client";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [nickname, setNickname] = useState('');
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const client = Stomp.over(socket);

    client.connect({}, () => {
      console.log("Connected to STOMP server");
      setStompClient(client);
      client.subscribe("/topic/messages", (message) => {
        const receivedMessage = JSON.parse(message.body);
        console.log("Received message:", receivedMessage);
        setMessages((prevMessages) => {
          const isDuplicate = prevMessages.some(
            msg => msg.content === receivedMessage.content && msg.nickname === receivedMessage.nickname
          );
          return isDuplicate ? prevMessages : [...prevMessages, receivedMessage];
        });
      });
    }, (error) => {
      console.error("STOMP connection error: ", error);
    });

    return () => {
      if (client && client.connected) {
        client.disconnect();
      }
    };
  }, []);

  const handleNickNameChange = (e) => {
    setNickname(e.target.value);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const sendMessage = () => {
    if (stompClient && stompClient.connected && message.trim()) {
      const chatMessage = {
        nickname,
        content: message,
      };
      stompClient.send("/app/chat", {}, JSON.stringify(chatMessage));
      setMessage("");
    } else {
      console.error("STOMP client is not connected or message is empty");
    }
  };

  return (
    <div>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>
            <strong>{msg.nickname}</strong>: {msg.content}
          </li>
        ))}
      </ul>
      <div>
        <input
          type="text"
          placeholder="Nickname"
          value={nickname}
          onChange={handleNickNameChange}
        />
        <input
          type="text"
          placeholder="Message"
          value={message}
          onChange={handleMessageChange}
        />
        <button onClick={sendMessage} disabled={!message.trim()}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
