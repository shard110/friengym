import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const HashtagPosts = () => {
    const { tag } = useParams();
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch(`/posts/hashtag/${tag}`)
            .then((response) => response.json())
            .then((data) => setPosts(data))
            .catch((error) => console.error('Error fetching posts:', error));
    }, [tag]);

    return (
        <div className="hashtag-posts">
            <h2>#{tag} 관련 게시글</h2>
            {posts.length > 0 ? (
                posts.map((post) => (
                    <div key={post.poNum} className="post-card">
                        {/* 게시글 내용 표시 */}
                        <Link to={`/posts/${post.poNum}`}>
                        {post.fileUrl && (
                            <div className="post-media">
                            {post.fileUrl.endsWith(".mp4") ? (
                                <video controls>
                                <source src={post.fileUrl} type="video/mp4" />
                                </video>
                            ) : (
                                <img src={post.fileUrl} alt="Uploaded" />
                            )}
                            </div>
                        )}
                        <p>{post.poContents}</p>
                        </Link>
                    </div>
                ))
            ) : (
                <p>게시글이 없습니다.</p>
            )}
        </div>
    );
};

export default HashtagPosts;
