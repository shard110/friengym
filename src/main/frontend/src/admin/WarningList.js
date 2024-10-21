import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ListStyles.css';

const WarningList = () => {
  const [warnings, setWarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState({});

  useEffect(() => {
    const fetchWarnings = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/admin/warnings');
        setWarnings(response.data);

        const postIds = response.data.map(warning => warning.postId);
        const uniquePostIds = [...new Set(postIds)];

        const postPromises = uniquePostIds.map(id => 
          axios.get(`http://localhost:8080/api/posts/${id}`)
        );

        const postResponses = await Promise.all(postPromises);
        const postTitles = postResponses.reduce((acc, postResponse) => {
          acc[postResponse.data.poNum] = postResponse.data.poContents;
          return acc;
        }, {});

        setPosts(postTitles);
      } catch (error) {
        console.error("Error fetching warnings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWarnings();
  }, []);

  const checkPostExists = async (postId) => {
    try {
      await axios.get(`http://localhost:8080/api/posts/${postId}`);
      return true;
    } catch {
      return false;
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      console.log(`Deleting post with ID: ${postId}`);
  
      const postExists = await checkPostExists(postId);
      if (!postExists) {
        alert('Post not found. Cannot delete.');
        return;
      }
  
      // 게시물 삭제 요청
      await axios.delete(`http://localhost:8080/api/admin/posts/${postId}`);
      setWarnings(prevWarnings => prevWarnings.filter(warning => warning.postId !== postId));
      alert('Post deleted successfully.');
    } catch (error) {
      console.error("Error deleting post:", error.response ? error.response.data : error.message);
      alert('Failed to delete post. Please check the console for details.');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Warning List</h2>
      <table className="common-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Post Title</th>
            <th>User ID</th>
            <th>Reason</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {warnings.map(warning => (
            <tr key={warning.id}>
              <td>{warning.id}</td>
              <td>
                <Link to={`/posts/${warning.postId}`}>
                  {posts[warning.postId] || 'Unknown Post'}
                </Link>
              </td>
              <td>{warning.userId}</td>
              <td>{warning.reason}</td>
              <td>
                <button onClick={() => handleDeletePost(warning.postId)}>Delete Post</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WarningList;
