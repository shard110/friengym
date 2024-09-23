import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';


// Context 생성
const AuthContext = createContext();

// AuthContext Provider를 사용하여 로그인 상태 관리
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('jwtToken');
            if (token) {
                try {
                    const response = await axios.get('/api/mypage', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    console.log('User fetched in AuthProvider:', response.data);
                    setUser(response.data);
                } catch (error) {
                    console.error('Failed to fetch user info in AuthProvider:', error);
                    setUser(null);
                    localStorage.removeItem('jwtToken');
                }
            }
            setLoading(false);
        };

        fetchUser();
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('jwtToken', userData.token);
        // 로그인 시, 이전 사용자의 좋아요 데이터를 초기화
        localStorage.setItem('likedPosts', JSON.stringify({}));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('jwtToken');
        // 로그아웃 시, likedPosts 초기화
        localStorage.removeItem('likedPosts');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
