import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserList.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/admin/users', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          },
        });
        setUsers(response.data);
      } catch (err) {
        setError('유저 정보를 가져오는 데 오류가 발생했습니다.');
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/admin/users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      // 삭제 후 사용자 목록을 갱신
      setUsers(users.filter(user => user.id !== id));
    } catch (err) {
      setError('유저 삭제 중 오류가 발생했습니다.');
      console.error(err);
    }
  };

  return (
    <div>
      <h2>사용자 목록</h2>
      {error && <p>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>이름</th>
            <th>전화번호</th>
            <th>성별</th>
            <th>신장</th>
            <th>체중</th>
            <th>생일</th>
            <th>작업</th> {/* 작업 열 추가 */}
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.phone}</td>
              <td>{user.sex}</td>
              <td>{user.height}</td>
              <td>{user.weight}</td>
              <td>{user.birth}</td>
              <td>
                <button onClick={() => handleDelete(user.id)}>삭제</button> {/* 삭제 버튼 추가 */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
