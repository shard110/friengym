import React from 'react';
import logo from '../img/logo.png';
import './Gnb.css';

const Gnb = () => {
    return (
        <nav className="gnb">
            <div className="gnb-wrap">
                <div className="gnb-logo">
                    <img src={logo} alt="frienGym"/>
                </div>
                <ul className="gnb-menu">
                    <li><a href="/">About frienGym</a></li>
                    <li><a href="/qna">자주 묻는 질문</a></li>
                    <li><a href="/asks">1:1문의 게시판</a></li>
                    <li><a href="/customer">약관 및 정책</a></li>
                </ul>
            </div>
        </nav>
    );
};

export default Gnb;
