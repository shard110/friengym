import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WarningList = () => {
  const [warnings, setWarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState({}); // 게시글 제목을 저장할 객체

  useEffect(() => {
    const fetchWarnings = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/admin/warnings');
        setWarnings(response.data);
        
        // 게시글 제목을 가져오는 추가 API 호출
        const postIds = response.data.map(warning => warning.postId);
        const uniquePostIds = [...new Set(postIds)]; // 중복 제거

        const postPromises = uniquePostIds.map(id => 
          axios.get(`http://localhost:8080/api/posts/${id}`) // 게시글 제목을 가져오는 API
        );

        const postResponses = await Promise.all(postPromises);
        const postTitles = postResponses.reduce((acc, postResponse) => {
          acc[postResponse.data.poNum] = postResponse.data.poContents; // poNum을 키로 사용
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
            <th>Post Title</th> {/* 변경된 부분 */}
            <th>User ID</th>
            <th>Reason</th>
          </tr>
        </thead>
        <tbody>
          {warnings.map(warning => (
            <tr key={warning.id}>
              <td>{warning.id}</td>
              <td>{posts[warning.postId] || 'Unknown Post'}</td> {/* 게시글 제목 표시 */}
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
