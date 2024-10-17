import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';


// Context 생성
const AuthContext = createContext();

// 사용자 정보를 가져오는 함수를 별도로 추출
const fetchUser = async (token) => {
    try {
        const response = await axios.get('/api/mypostpage', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data; // 사용자 정보 반환
    } catch (error) {
        console.error('Failed to fetch user info:', error);
        throw error; // 오류를 호출한 함수로 전달
    }
};

// AuthProvider 컴포넌트
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('jwtToken');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        const initializeUser = async () => {
            const token = localStorage.getItem('jwtToken');
            if (token) {
                try {
                    const userInfo = await fetchUser(token); // 사용자 정보 가져오기
                    setUser(userInfo); // 상태 업데이트
                } catch {
                    setUser(null);
                    localStorage.removeItem('jwtToken');
                }
            }
            setLoading(false);
        };

        initializeUser();
    }, []);

    const login = async (loginData) => {
        try {
            const response = await axios.post('/api/login', loginData);
            const token = response.data.token;
            localStorage.setItem('jwtToken', token);

            // 로그인 후 사용자 정보를 가져옴
            const userInfo = await fetchUser(token);
            setUser(userInfo);
        } catch (error) {
            console.error('Failed to log in:', error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('likedPosts');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// AuthContext에서 제공하는 user 정보를 어디서든 사용할 수 있음
export const useAuth = () => useContext(AuthContext);
