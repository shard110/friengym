import React, { useEffect, useState } from 'react';

function Board() {
  const [posts, setPosts] = useState([]);
  const [currentPost, setCurrentPost] = useState({ title: '', username: '', content: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editPostId, setEditPostId] = useState(null);
  const [hashtags, setHashtags] = useState([]);

  // 서버에서 모든 게시글을 가져오는 함수
  const fetchPosts = async () => {
    const response = await fetch('http://localhost:8080/posts');
    const data = await response.json();
    setPosts(data);
  };

  // 게시글을 추가하거나 수정하는 함수
  const savePost = async () => {
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `http://localhost:8080/post/${editPostId}` : 'http://localhost:8080/post';

    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(currentPost),
    });

    if (response.ok) {
      fetchPosts();
      setCurrentPost({ title: '', username: '', content: '' });
      const handleAddHashtag = (tag) => {
        setHashtags([...hashtags, tag]);
    }
      setIsEditing(false);
      setEditPostId(null);
    }
  };

  // 게시글을 삭제하는 함수
  const deletePost = async (id) => {
    const response = await fetch(`http://localhost:8080/post/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      fetchPosts();
    }
  };

  // 게시글 수정 시작
  const startEdit = (post) => {
    setCurrentPost(post);
    setIsEditing(true);
    setEditPostId(post.id);
  };

  // 컴포넌트가 마운트될 때 게시글을 가져옴
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div>
      <h1>게시판</h1>

      {/* 게시글 목록 */}
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.username}</p>
            <p>{post.content}</p>
            <button onClick={() => startEdit(post)}>수정</button>
            <button onClick={() => deletePost(post.id)}>삭제</button>
          </li>
        ))}
      </ul>

      {/* 게시글 추가/수정 폼 */}
      <div>
        <h2>{isEditing ? '게시글 수정' : '새 게시글'}</h2>
        <input
          type="text"
          placeholder="제목"
          value={currentPost.title}
          onChange={(e) => setCurrentPost({ ...currentPost, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="작성자"
          value={currentPost.username}
          onChange={(e) => setCurrentPost({ ...currentPost, username: e.target.value })}
        />
        <textarea
          placeholder="내용"
          value={currentPost.content}
          onChange={(e) => setCurrentPost({ ...currentPost, content: e.target.value })}
        ></textarea>
        <button onClick={savePost}>{isEditing ? '수정 완료' : '게시글 추가'}</button>
      </div>
    </div>
  );
}

export default Board;