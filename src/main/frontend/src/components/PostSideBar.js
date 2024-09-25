import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'; // 사이드바 관련 CSS 파일 임포트

const PostSideBar = () => {
  return (
    <div className="sidebar">
    <Link to="/posts">게시글</Link>
    <Link to="/post-search">검색</Link>
    <Link to="/recommendations">추천</Link>
    <Link to="/messages">메시지</Link>
    <Link to="/notifications">알림</Link>
    <Link to="/create-post">만들기</Link> {/* "만들기" 버튼을 Link로 변경 */}
    <Link to="/mypage">프로필</Link>
    </div>
  );
};

export default PostSideBar;