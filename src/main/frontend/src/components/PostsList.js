import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './PostsList.module.css'; // CSS 모듈 import
import Footer from './Footer'; // Footer 컴포넌트 import

export default function PostsList() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1); // 현재 페이지 상태
  const [size] = useState(10); // 페이지당 항목 수
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/posts?page=${page}&size=${size}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data.posts); // 게시글 목록 설정
        setTotalPages(Math.ceil(data.pageInfo.total / size)); // 전체 페이지 수 계산
      } catch (error) {
        console.error(error);
      }
    };

    fetchPosts();
  }, [page, size]); // 페이지, 페이지 크기 변경 시 데이터 새로 가져오기

  // 날짜 포맷 함수
  const formatDate = (dateString) => {
    if (!dateString) return "No Date";
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // 페이지 변경 핸들러
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.tableWrapper}>
        <h2 className={styles.heading}>게시글 목록</h2>
        <Link className={styles.createPostBtn} to="/create-post">
          게시글 등록
        </Link>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className="number">번호</th>
              <th className="title">제목</th>
              <th className="user-name">작성자</th>
              <th className="date">작성 날짜</th>
              <th className="view-count">조회수</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.poNum}>
                <td>{post.poNum}</td>
                <td>
                  <Link to={`/post/${post.poNum}`}>{post.poTitle}</Link>
                  <span className="comment-count-badge">
                    {post.commentCount} comments
                  </span>
                </td>
                <td>{post.name}</td>
                <td>{formatDate(post.createdDate)}</td>
                <td>{post.viewCnt}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={styles.paginationContainer}>
          <nav>
            <ul className={styles.pagination}>
              <li className={`${styles.pageItem} ${page === 1 ? styles.disabled : ""}`}>
                <button
                  className={`${styles.navButton} ${page === 1 ? styles.disabled : ""}`}
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                >
                  이전
                </button>
              </li>
              {[...Array(totalPages)].map((_, index) => (
                <li
                  key={index}
                  className={`${styles.pageItem} ${page === index + 1 ? styles.active : ""}`}
                >
                  <button
                    className={styles.pageLink}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
              <li className={`${styles.pageItem} ${page === totalPages ? styles.disabled : ""}`}>
                <button
                  className={`${styles.navButton} ${page === totalPages ? styles.disabled : ""}`}
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                >
                  다음
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

    </div>
  );
}
