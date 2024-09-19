import React from 'react';
import { Link } from 'react-router-dom';
import './ManagerBar.css'; // CSS 파일 import

const ManagerBar = () => {
  return (
    <div>
      <h2>관리 메뉴</h2>
      <ul className="manager-menu">
        <li><Link to="/user">User</Link></li>
        <li><Link to="/post">Post</Link></li>
        <li><Link to="/shop">Shop</Link></li>
        <li><Link to="/ask">Ask</Link></li>
        <li><Link to="/master">Master</Link></li>
      </ul>
    </div>
  );
};

export default ManagerBar;
