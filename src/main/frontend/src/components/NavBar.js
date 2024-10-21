import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from './AuthContext'; // 사용자 인증 정보를 가져오는 훅
import './Navbar.css';
import logo from '../img/logo_friengym.svg';
import { LogOut, User } from "react-feather";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
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

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const closeMenu = () => {
    setIsOpen(false);
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
              <button onClick={() => navigate('/totalmypage')} className="nav-link">마이페이지</button>
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
                <span className="nav-link">환영합니다!<br /> {user.name}님</span>
                <button onClick={() => navigate('/mypage')} className="nav-link"><User /></button>
                <button onClick={handleLogout} className="nav-link"><LogOut /></button>
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
              <Link className="nav-link" to="/posts" onClick={closeMenu}>커뮤니티</Link>
            </li>
            <li className="navbar--item">
              <Link className="nav-link" to="/products" onClick={closeMenu}>쇼핑</Link>
              <ul className="navbar--item">
                <li><Link to="/productslist" activeclassname='active' onClick={closeMenu}>전체상품</Link></li>
                <Link to="/categories/1" activeclassname='active' onClick={closeMenu}>카테고리</Link>
                <li><Link to="/products/new" activeclassname='active' onClick={closeMenu}>신상품</Link></li>
                <li><Link to="/products/popular" activeclassname='active' onClick={closeMenu}>베스트</Link></li>
              </ul>
            </li>
            <li className="navbar--item">
              <Link className="nav-link" to="/qna" onClick={closeMenu}>고객센터</Link>
              <ul className="navbar--item">
                    <li><Link href="/qna" onClick={closeMenu}>자주 묻는 질문</Link></li>
                    <li><Link href="/asks" onClick={closeMenu}>1:1문의 게시판</Link></li>
                    <li><Link href="/customer" onClick={closeMenu}>약관 및 정책</Link></li>
                </ul>
            </li>
          </ul>
        </nav>
        <div className={`mask ${isOpen ? 'show':''}`} onClick={closeMenu}></div>
      </div>
    </nav>
  );
}
