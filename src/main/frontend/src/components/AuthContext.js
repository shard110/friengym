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

    const login = async (loginData) => {
        try {
          const response = await axios.post("/api/login", loginData); // 로그인 요청
          const token = response.data.token; // 서버에서 받은 JWT 토큰
          localStorage.setItem("jwtToken", token); // JWT 토큰 저장
          localStorage.setItem('likedPosts', JSON.stringify({}));
          setUser(response.data.user); // 유저 정보 저장
        } catch (error) {
          console.error("Failed to log in:", error);
          throw error;
        }
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
