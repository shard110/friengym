import { React, useState } from 'react';

const PostCard = ({ post }) => {
  const [likes, setLikes] = useState(post.likes);

  const handleLike = () => {
      fetch(`/api/posts/${post.id}/like`, { method: 'POST' })
          .then(response => response.json())
          .then(data => setLikes(data.likes));
  };

  return (
      <div className="post-card">
          <img src={post.imageUrl} alt={post.title} />
          <div className="post-info">
              <h3>{post.title}</h3>
              <p>{post.description}</p>
              <button onClick={handleLike}>👍 {likes}</button>
          </div>
      </div>
  );
};
