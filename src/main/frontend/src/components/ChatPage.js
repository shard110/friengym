import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import Chat from "./Chat"; // 방금 작성한 Chat 컴포넌트

const ChatPage = () => {
    const { userId } = useParams();
    const { user } = useAuth();

    return (
        <div>
            <h2>DM with User ID: {userId}</h2>
            <Chat selectedUserId={userId} />
        </div>
    );
};

export default ChatPage;