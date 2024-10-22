import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ListStyles.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [selectedMonths, setSelectedMonths] = useState({});

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
    const confirm = window.confirm("정말로 이 사용자를 삭제하시겠습니까?");
    if (!confirm) {
      return; // 사용자가 취소하면 함수 종료
    }

    try {
      await axios.delete(`http://localhost:8080/api/admin/users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      setUsers(users.filter(user => user.id !== id));
    } catch (err) {
      setError('유저 삭제 중 오류가 발생했습니다.');
      console.error(err);
    }
  };

  const handleAddMonths = async (id) => {
    const months = selectedMonths[id];
    if (months) {
      const confirm = window.confirm(`${months}개월을 추가하시겠습니까?`);
      if (!confirm) {
        return; // 사용자가 취소하면 함수 종료
      }

      try {
        await axios.patch(`http://localhost:8080/api/admin/users/${id}/addMonths`, { months }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          },
        });
        const response = await axios.get('http://localhost:8080/api/admin/users', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          },
        });
        setUsers(response.data);
      } catch (err) {
        setError('개월 수 추가 중 오류가 발생했습니다.');
        console.error(err);
      }
    } else {
      setError('개월 수를 선택하세요.');
    }
  };

  return (
    <div>
      <h2>사용자 목록</h2>
      {error && <p>{error}</p>}
      <table className="common-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>이름</th>
            <th>전화번호</th>
            <th>이메일</th> {/* 이메일 열 추가 */}
            <th>성별</th>
            <th>생일</th>
            <th>등록일자</th>
            <th>남은 일수</th>            
            <th>개월 추가</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.phone}</td>
              <td>{user.email}</td> {/* 이메일 값 표시 */}
              <td>{user.sex}</td>
              <td>{user.birth}</td>
              <td>{user.firstday}</td>
              <td>{user.restday}</td>
              <td>
                <select
                  onChange={(e) => setSelectedMonths({ ...selectedMonths, [user.id]: e.target.value })}
                  defaultValue=""
                >
                  <option value="" disabled>개월 추가</option>
                  <option value="1">1개월</option>
                  <option value="3">3개월</option>
                  <option value="6">6개월</option>
                  <option value="12">1년</option>
                </select>
                <button onClick={() => handleAddMonths(user.id)}>등록</button>
              </td>
              <td>
                <button onClick={() => handleDelete(user.id)}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;