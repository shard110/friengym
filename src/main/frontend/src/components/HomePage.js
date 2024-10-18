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

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

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

  useEffect(() => {
    const interval = setInterval(nextSlide, 3000); // 3초마다 슬라이드 변경
    return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 정리
  }, []);

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
    </>
  );
};

export default HomePage;
