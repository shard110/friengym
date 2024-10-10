import React from 'react';
import { Link } from 'react-router-dom';
import './ManagerBar.css';

const ManagerBar = ({ onLogout }) => {
  return (
    <div>
      <h2>관리 메뉴</h2>
      <ul className="manager-menu">
        <li><Link to="/adminHome/user">User</Link></li>
        <li><Link to="/adminHome/post">Post</Link></li>
        <li><Link to="/adminHome/shop">Shop</Link></li>
        <li><Link to="/adminHome/order">Order</Link></li>
        <li><Link to="/adminHome/ask">Ask</Link></li>
        <li><Link to="/adminHome/master">Master</Link></li>
        <li><button onClick={onLogout}>로그아웃</button></li> {/* 로그아웃 버튼 추가 */}
      </ul>
    </div>
  );
};

export default ManagerBar;
