import React from 'react';
import { Link } from 'react-router-dom'; // React Router의 Link를 사용합니다.
import logo from '../img/logo.svg';
import './Gnb.css';

const Gnb = () => {
    return (
        <nav className="gnb">
            <div className="gnb-wrap">
                <div className="gnb-logo">
                    <img src={logo} alt="frienGym"/>
                </div>
                <ul className="gnb-menu">
                    <li><Link to="#">About frienGym</Link></li>
                    <li><Link to="/board">게시판</Link></li>
                    <li><Link to="/products">쇼핑몰</Link></li>
                    <li><Link to="#">고객센터</Link></li>
                </ul>
                <ul className="gnb-sign">
                    <li><Link to="/login">회원가입</Link></li>
                    <li><Link to="/register">로그인</Link></li>
                </ul>
            </div>
        </nav>
    );
};

export default Gnb;
