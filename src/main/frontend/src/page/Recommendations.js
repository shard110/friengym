import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Link 컴포넌트 임포트

const Recommendations = () => {
    const [recommendedPosts, setRecommendedPosts] = useState([]);

    useEffect(() => {
        fetch('/api/recommendations')
            .then(response => response.json())
            .then(data => setRecommendedPosts(data));
    }, []);

    return (
        <div className="recommendations">
            <h2>Recommended for you</h2>
            <div className="rec-gallery-container">
                {recommendedPosts.map(post => (
                    <div className="rec-post-card" key={post.poNum}>
                        <Link to={`/post/${post.poNum}`}>
                            {/* 이미지나 동영상이 있으면 출력, 없으면 텍스트만 출력 */}
                            {post.fileUrl ? (
                                post.fileUrl.endsWith(".mp4") ? (
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
