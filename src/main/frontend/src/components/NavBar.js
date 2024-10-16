import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from '../img/logo.png'; // 이미지 파일을 import
import { useAuth } from './AuthContext'; // 사용자 인증 정보를 가져오는 훅
import './Navbar.css'; // 스타일을 적용하기 위한 CSS 파일

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

 // 토큰 확인 및 로그인 페이지로 이동 로직을 useEffect로 관리
  useEffect(() => {
  const token = localStorage.getItem('jwtToken');
  if (!token) {
    navigate('/login');
  }
}, [navigate]); // navigate가 변경될 때마다 실행

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  console.log("Navbar user state:", user); // user 상태 확인
  
  if (loading) {
    // 로딩 중일 때 로딩 메시지 표시
    return <div>로딩 중...</div>;
  }

  if (!user) {
    // 사용자 정보가 없을 때 표시
    return <div>사용자 정보를 불러오지 못했습니다.</div>;
  }

  // user 객체가 중첩된 구조일 경우 올바르게 접근
  const userName = user.user?.name || "사용자"; // name을 중첩된 구조에서 가져오기

  return (
    <nav className="navbarH">
      <div className="navbar-container">
        <div className="navbar-logo-container">
          <Link to="/">
            <img src={logo} alt="Logo" className="navbar-logo" />
          </Link>
        </div>

        <div className="navbar-main-menu">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/posts">Posts</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/products">Products</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/productslist">상품 목록</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/cart">장바구니</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/qna">고객센터</Link>
            </li>
          </ul>
        </div>

        <div className="navbar-user-menu">
          {user ? (
            <div className="user-menu-logged-in">
              <span className="nav-link">환영합니다! {userName}님</span>
              <button onClick={handleLogout} className="nav-link">로그아웃</button>
              <button onClick={() => navigate('/totalmypage')} className="nav-link">마이페이지</button>
            </div>
          ) : (
            <div className="user-menu-logged-out">
              <Link className="nav-link" to="/login">로그인</Link>
              <Link className="nav-link" to="/register">회원가입</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
