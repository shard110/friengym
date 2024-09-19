import React, { useEffect, useState } from 'react';

const Recommendations = () => {
    const [recommendedPosts, setRecommendedPosts] = useState([]);

    useEffect(() => {
        fetch('/api/recommend')
            .then(response => response.json())
            .then(data => setRecommendedPosts(data));
    }, []);

    return (
        <div className="recommendations">
            <h2>Recommended for you</h2>
            <div className="gallery-container">
                {recommendedPosts.map(post => (
                    <div className="post-card" key={post.id}>
                        <div className="user-info">
                            <img src={post.user.photo} alt={post.user.id} className="user-photo" />
                            <span>{post.user.id}</span>
                        </div>
                        <img src={post.fileUrl} alt={post.poContents} className="post-image" />
                        <div className="post-info">
                            <p>{post.poContents}</p>
                            <div className="post-stats">
                                <span>👍 {post.likes}</span>
                                <span>👁 {post.viewCnt}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Recommendations;
