import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Post = () => {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState({ title: '', content: '', username: '' });
    const [selectedPost, setSelectedPost] = useState(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await axios.get('http://localhost:8080/posts');
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const createPost = async () => {
        try {
            await axios.post('http://localhost:8080/post', newPost);
            fetchPosts();
            setNewPost({ title: '', content: '', username: '' });
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    const updatePost = async (poNum) => {
        try {
            await axios.put(`http://localhost:8080/post/${poNum}`, selectedPost);
            fetchPosts();
            setSelectedPost(null);
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };

    const deletePost = async (poNum) => {
        try {
            await axios.delete(`http://localhost:8080/post/${poNum}`);
            fetchPosts();
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    return (
        <div>
            <h1>Posts</h1>
            <div>
                <h2>Create New Post</h2>
                <input
                    type="text"
                    placeholder="Title"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Content"
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Username"
                    value={newPost.username}
                    onChange={(e) => setNewPost({ ...newPost, username: e.target.value })}
                />
                <button onClick={createPost}>Create Post</button>
            </div>
            <div>
                <h2>All Posts</h2>
                {posts.map((post) => (
                    <div key={post.poNum}>
                        <h3>{post.title}</h3>
                        <p>{post.content}</p>
                        <p>{post.username}</p>
                        <button onClick={() => setSelectedPost(post)}>Edit</button>
                        <button onClick={() => deletePost(post.poNum)}>Delete</button>
                    </div>
                ))}
            </div>
            {selectedPost && (
                <div>
                    <h2>Edit Post</h2>
                    <input
                        type="text"
                        placeholder="Title"
                        value={selectedPost.title}
                        onChange={(e) => setSelectedPost({ ...selectedPost, title: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Content"
                        value={selectedPost.content}
                        onChange={(e) => setSelectedPost({ ...selectedPost, content: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Username"
                        value={selectedPost.username}
                        onChange={(e) => setSelectedPost({ ...selectedPost, username: e.target.value })}
                    />
                    <button onClick={() => updatePost(selectedPost.poNum)}>Update Post</button>
                </div>
            )}
        </div>
    );
};

export default Post;
