import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from './AuthContext'; // 사용자 인증 정보를 가져오는 훅
import './Navbar.css'; // 스타일을 적용하기 위한 CSS 파일
import logo from '../img/logo_friengym.svg';
import { Menu } from "react-feather";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbarH">
      <div className="navbar-container">
        <div className="navbar-logo-container">
          <Link to="/">
            <img src={logo} alt="friengym Logo" className="navbar-logo" />
          </Link>
        </div>

        <div className="navbar-main-menu">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/posts">커뮤니티</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/products">쇼핑</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/qna">고객센터</Link>
            </li>
          </ul>
        </div>

        <div className="navbar-user-menu">
          {user ? (
            <div className="user-menu-logged-in">
              {/* <span className="nav-link">환영합니다! {user.name}님</span> */}
              <button onClick={handleLogout} className="nav-link">로그아웃</button>
              <button onClick={() => navigate('/mypage')} className="nav-link">마이페이지</button>
            </div>
          ) : (
            <div className="user-menu-logged-out">
              <Link className="nav-link" to="/login">로그인</Link>
              <Link className="nav-link" to="/register">회원가입</Link>
            </div>
          )}
        </div>
        <div className="hamburger-menu" onClick={toggleMenu}>
          <div className={`hamburger ${isOpen ? 'menu-opened':''}`}>
          </div>
        </div>
        <nav className={`sliding-navbar ${isOpen ? 'sliding-navbar--open':''}`}>
          <div className="navbar-user-menu">
            {user ? (
              <div className="user-menu-logged-in">
                {/* <span className="nav-link">환영합니다! {user.name}님</span> */}
                <button onClick={handleLogout} className="nav-link">로그아웃</button>
                <button onClick={() => navigate('/mypage')} className="nav-link">마이페이지</button>
              </div>
            ) : (
              <div className="user-menu-logged-out">
                <Link className="nav-link" to="/login">로그인</Link>
                <Link className="nav-link" to="/register">회원가입</Link>
              </div>
            )}
          </div>
          <ul className="navbar--items">
            <li className="navbar--item">
              <Link className="nav-link" to="/posts">커뮤니티</Link>
            </li>
            <li className="navbar--item">
              <Link className="nav-link" to="/products">쇼핑</Link>
            </li>
            <li className="navbar--item">
              <Link className="nav-link" to="/qna">고객센터</Link>
            </li>
          </ul>
        </nav>
        <div className={`mask ${isOpen ? 'show':''}`} onClick={closeMenu}></div>
      </div>
    </nav>
  );
}
