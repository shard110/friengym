import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../components/AuthContext";

const Recommendations = () => {
    const [recommendedPosts, setRecommendedPosts] = useState([]);
    const { user } = useAuth(); // 인증된 사용자 정보 가져오기
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecommendations = async () => {
        const token = user?.token || localStorage.getItem('jwtToken');
        if (!token) {
            console.error('인증 토큰이 없습니다. 로그인 후 이용해주세요.');
            navigate('/login'); // 로그인 페이지로 이동
            return;
        }
        try {
            const response = await fetch('/api/recommendations', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.ok) {
            const data = await response.json();
            setRecommendedPosts(data);
          } else {
            const errorText = await response.text();
            console.error('추천 게시글을 가져오는 중 오류 발생:', errorText);
            // 필요에 따라 사용자에게 오류 메시지를 표시할 수 있습니다.
          }
        } catch (error) {
          console.error('네트워크 오류:', error);
          // 네트워크 오류 처리
        }
      };
  
     fetchRecommendations();
  }, [user, navigate]);

    return (
        <div className="recommendations">
            <h2>Recommended for you</h2>
            <div className="gallery-container">
                {recommendedPosts.map((post) => (
                    <div className="post-card" key={post.poNum}>
                        <Link to={`/post/${post.poNum}`}>
                            {/* 이미지나 동영상이 있으면 출력, 없으면 텍스트만 출력 */}
                            {post.fileUrl ? (
                                post.fileUrl.endsWith('.mp4') ? (
                                    <video src={post.fileUrl} controls className="post-video"></video>
                                ) : (
                                    <img src={post.fileUrl} alt={post.poContents} className="post-image" />
                                )
                            ) : (
                                <div className="text-only">
                                    <p>{post.poContents}</p>
                                </div>
                            )}
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Recommendations;
