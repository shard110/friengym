import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WarningList = () => {
  const [warnings, setWarnings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWarnings = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/admin/warnings');
        setWarnings(response.data);
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
            <th>Post ID</th>
            <th>User ID</th>
            <th>Reason</th>
          </tr>
        </thead>
        <tbody>
          {warnings.map(warning => (
            <tr key={warning.id}>
              <td>{warning.id}</td>
              <td>{warning.postId}</td> {/* 수정: warning.post?.poNum에서 warning.postId로 변경 */}
              <td>{warning.userId}</td> {/* 수정: warning.user?.id에서 warning.userId로 변경 */}
              <td>{warning.reason}</td>
            </tr>
          ))} 
        </tbody>
      </table>
    </div>
  );
};

export default WarningList;
