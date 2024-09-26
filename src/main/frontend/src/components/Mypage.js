import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Footer from './Footer'; // Footer 컴포넌트 import
import './Mypage.css';

const Mypage = () => {
    const { user, loading: authLoading } = useAuth();  // useAuth에서 user와 loading을 가져옴
    const [userInfo, setUserInfo] = useState(null);  // 사용자 정보
    const [loading, setLoading] = useState(true);  // 페이지 로딩 상태
    const [error, setError] = useState('');  // 에러 메시지
    const [image, setImage] = useState("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png");
    const fileInput = useRef(null);  // 파일 입력 참조

    const fetchUserInfo = useCallback(async () => {
        const token = user?.token || localStorage.getItem('jwtToken');
        if (!token) {
            setError('No user token found.');
            setLoading(false);  // 로딩 상태를 false로 변경
            return;
        }

        try {
            const response = await axios.get('/api/mypage', {
                headers: { 
                    Authorization: `Bearer ${token}`  // 토큰을 헤더에 포함
                }
            });
            setUserInfo(response.data);
            setImage(response.data.photo || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png");
        } catch (error) {
            console.error(error);
            setError('Failed to fetch user info.');
        } finally {
            setLoading(false);  // 로딩 상태를 false로 설정
        }
    }, [user]);

    useEffect(() => {
        if (!authLoading) {  // authLoading이 끝나면 사용자 정보를 불러옴
            fetchUserInfo();
        }
    }, [authLoading, user, fetchUserInfo]);

    const onChange = async (e) => {
        if (e.target.files[0]) {
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append('file', file);

            try {
                await axios.put('/api/user/update-photo', formData, {
                    headers: {
                        'Authorization': `Bearer ${user?.token || localStorage.getItem('jwtToken')}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                // 사진 업로드 후 사용자 정보 갱신
                fetchUserInfo();
            } catch (error) {
                console.error(error);
                setError('Failed to upload photo.');
            }
        } else {
            setImage("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png");
        }
    };

    const calculateBMI = () => {
        if (userInfo && userInfo.height && userInfo.weight) {
            const heightInMeters = userInfo.height / 100;  // 신장을 m 단위로 변환
            const bmi = (userInfo.weight / (heightInMeters * heightInMeters)).toFixed(2);  // BMI 계산
            return bmi;
        }
        return null;
    };

    const getBMICategory = (bmi) => {
        if (bmi < 18.5) return "저체중";
        if (bmi >= 18.5 && bmi < 23) return "정상";
        if (bmi >= 23 && bmi < 25) return "과체중";
        return "비만";
    };

    if (authLoading || loading) {
        return <p>Loading...</p>;  // 인증 상태 또는 페이지 로딩 중일 때 표시
    }

    if (error) {
        return <p className="error">{error}</p>;  // 에러가 있을 때 표시
    }

    const bmi = calculateBMI();  // BMI 계산
    const bmiCategory = bmi !== null ? getBMICategory(bmi) : null;  // BMI 범주 계산

    return (
        <div className="page-wrapper">
            <div className="Mypage">
                {userInfo ? (
                    <div>
                        <h2>회원 정보</h2>
                        <div className="avatar-container">
                            <Avatar 
                                src={image + `?t=${new Date().getTime()}`}  // 캐시 무효화
                                sx={{ width: 200, height: 200 }} 
                                onClick={() => fileInput.current.click()} 
                            />
                            <input 
                                type='file' 
                                style={{ display: 'none' }} 
                                accept='image/jpg,image/png,image/jpeg' 
                                name='profile_img' 
                                onChange={onChange} 
                                ref={fileInput}
                            />
                        </div>
                        <div className="user-info">
                            <p><span>ID:</span> {userInfo.id}</p>
                            <p><span>Name:</span> {userInfo.name}</p>
                            <p><span>Phone:</span> {userInfo.phone}</p>
                            <p><span>Sex:</span> {userInfo.sex}</p>
                            <p><span>Height:</span> {userInfo.height} cm</p>
                            <p><span>Weight:</span> {userInfo.weight} kg</p>
                            {bmi !== null && <p><span>BMI:</span> {bmi} ({bmiCategory})</p>}  {/* BMI와 범주 표시 */}
                            <p><span>Birth:</span> {userInfo.birth}</p>
                            <p><span>Firstday:</span> {userInfo.firstday}</p>
                            <p><span>Restday:</span> {userInfo.restday}</p>
                        </div>

                        <Button variant="contained" color="primary" component={Link} to="/edit-profile">
                            회원정보 수정
                        </Button>
                    </div>
                ) : (
                    <p>No user info available.</p>
                )}
            </div>
            <Footer />  {/* Footer 추가 */}
        </div>
    );
};

export default Mypage;
