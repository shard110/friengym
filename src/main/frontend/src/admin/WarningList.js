import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Link 추가
import axios from 'axios';

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

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Warning List</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Post Title</th>
            <th>User ID</th>
            <th>Reason</th>
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
            </tr>
          ))} 
        </tbody>
      </table>
    </div>
  );
};

export default WarningList;
