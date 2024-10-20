import React, { useState, useEffect } from 'react';
import { FaBars, FaSearch } from 'react-icons/fa';
import './HomePage.css';
import logo from '../img/logo.png';

// 슬라이드 데이터
const slides = [
  { id: 1, content: '슬라이드 1', img: '/images/banner1.jpg' },
  { id: 2, content: '슬라이드 2', img: '/images/banner3.jpg' },
  { id: 3, content: '슬라이드 3', img: '/images/banner4.jpg' },
];

// 트렌드 숏츠 비디오 데이터 (1번~10번)
const videos = [
  { id: 1, src: '/video/video1.mp4', description: '트렌트 숏츠 설명 문구 1' },
  { id: 2, src: '/video/video2.mp4', description: '트렌트 숏츠 설명 문구 2' },
  { id: 3, src: '/video/video3.mp4', description: '트렌트 숏츠 설명 문구 3' },
  { id: 4, src: '/video/video4.mp4', description: '트렌트 숏츠 설명 문구 4' },
  { id: 5, src: '/video/video5.mp4', description: '트렌트 숏츠 설명 문구 5' }, 
  { id: 6, src: '/video/video6.mp4', description: '트렌트 숏츠 설명 문구 6' }, 
  { id: 7, src: '/video/video7.mp4', description: '트렌트 숏츠 설명 문구 7' },
  { id: 8, src: '/video/video8.mp4', description: '트렌트 숏츠 설명 문구 8' },
  { id: 9, src: '/video/video9.mp4', description: '트렌트 숏츠 설명 문구 9' },
  { id: 10, src: '/video/video10.mp4', description: '트렌트 숏츠 설명 문구 10' },
];

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentVideoGroup, setCurrentVideoGroup] = useState(0); // 현재 비디오 그룹 인덱스

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleSlideClick = (index) => {
    setCurrentSlide(index);
  };

  // 슬라이드 자동 전환
  useEffect(() => {
    const interval = setInterval(nextSlide, 3000); // 3초마다 슬라이드 변경
    return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 정리
  }, []);

  // 비디오 그룹 자동 순환
  useEffect(() => {
    const groupInterval = setInterval(() => {
      setCurrentVideoGroup((prevGroup) => (prevGroup + 1) % 2); // 0, 1 두 그룹을 순환
    }, 5000); // 5초마다 그룹 변경

    return () => clearInterval(groupInterval); // 컴포넌트 언마운트 시 인터벌 정리
  }, []);

  // 현재 그룹에 따라 비디오를 선택
  const displayedVideos = currentVideoGroup === 0 ? videos.slice(0, 5) : videos.slice(5); // 그룹 0은 1~5번, 그룹 1은 6~10번

  return (
    <>
      <nav className="navbarH">
        <div className="menu-icon" onClick={toggleMenu}>
          <FaBars />
        </div>
        <div className="logo">
          <img src={logo} alt="My Logo" />
        </div>
        <div className="search-icon">
          <FaSearch />
        </div>
      </nav>
      <div className={`homepage-menu ${isMenuOpen ? 'open' : ''}`}>
        <ul>
          <li>Home</li>
          <li>About</li>
          <li>Services</li>
          <li>Contact</li>
        </ul>
      </div>

      {/* 슬라이드 부분 */}
      <div className="slider">
        <div className="slides" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {slides.map((slide, index) => (
            <div key={slide.id} className="slide" onClick={() => handleSlideClick(index)}>
              <img src={slide.img} alt={slide.content} className="slide-image" />
              <div className="slide-content">{slide.content}</div>
            </div>
          ))}
        </div>
        <div className="indicators">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`indicator ${currentSlide === index ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>

      {/* 트렌트 숏츠 부분 */}
      <h2>트렌트 숏츠</h2>
      <div className="trend-shorts">
        <div className="video-slider">
          <div className="video-group">
            {displayedVideos.map((video) => (
              <div key={video.id} className="video-item">
                <video width="150" height="100" controls loop>
                  <source src={video.src} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <p>{video.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
