import React, { useState, useEffect } from 'react';
import { FaBars, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './HomePage.css';
import Navbar from './NavBar';
import Footer from './Footer'; // Footer 컴포넌트 import



// 슬라이드 데이터
const slides = [
  { id: 1, content: '슬라이드 1', img: '/images/banner1.jpg' },
  { id: 2, content: '슬라이드 2', img: '/images/banner3.jpg' },
  { id: 3, content: '슬라이드 3', img: '/images/banner4.jpg' },
];

// 트렌드 숏츠 비디오 데이터
const videos = [
  { id: 1, src: '/video/v1.mp4', description: '트렌트 숏츠 설명 문구 1' },
  { id: 2, src: '/video/v1.mp4', description: '트렌트 숏츠 설명 문구 2' },
  { id: 3, src: '/video/v1.mp4', description: '트렌트 숏츠 설명 문구 3' },
  { id: 4, src: '/video/v1.mp4', description: '트렌트 숏츠 설명 문구 4' },
  { id: 5, src: '/video/v1.mp4', description: '트렌트 숏츠 설명 문구 5' },
  { id: 6, src: '/video/v1.mp4', description: '트렌트 숏츠 설명 문구 6' },
  { id: 7, src: '/video/v1.mp4', description: '트렌트 숏츠 설명 문구 7' },
  { id: 8, src: '/video/v1.mp4', description: '트렌트 숏츠 설명 문구 8' },
  { id: 9, src: '/video/v1.mp4', description: '트렌트 숏츠 설명 문구 9' },
  { id: 10, src: '/video/v1.mp4', description: '트렌트 숏츠 설명 문구 10' },
];

// 베스트 게시물 데이터
const bestPosts = [
  { id: 1, img: '/images/p1.jpg', alt: '베스트 이미지 1' },
  { id: 2, img: '/images/p2.jpg', alt: '베스트 이미지 2' },
  { id: 3, img: '/images/p3.jpg', alt: '베스트 이미지 3' },
  { id: 4, img: '/images/p1.jpg', alt: '베스트 이미지 4' },
  { id: 5, img: '/images/p2.jpg', alt: '베스트 이미지 5' },
  { id: 6, img: '/images/p3.jpg', alt: '베스트 이미지 6' },
  { id: 7, img: '/images/p1.jpg', alt: '베스트 이미지 7' },
  { id: 8, img: '/images/p2.jpg', alt: '베스트 이미지 8' },
  { id: 9, img: '/images/p3.jpg', alt: '베스트 이미지 9' },
];

// 인기 상품 데이터
const popularProducts = [
  {
    id: 1,
    img: '/images/p1.jpg',
    description: '[2+1] 매일 먹는 종합 비타민',
    discount: '20%',
    price: '26,500원',
    rating: '4.3',
    reviews: '320',
  },
  {
    id: 2,
    img: '/images/p2.jpg',
    description: '[2+1] 매일 먹는 종합 비타민',
    discount: '20%',
    price: '39,500원',
    rating: '4.3',
    reviews: '320',
  },
  {
    id: 3,
    img: '/images/p3.jpg',
    description: '[2+1] 매일 먹는 종합 비타민',
    discount: '20%',
    price: '39,500원',
    rating: '4.3',
    reviews: '320',
  },
  {
    id: 4,
    img: '/images/p4.jpg',
    description: '[2+1] 매일 먹는 종합 비타민',
    discount: '20%',
    price: '39,500원',
    rating: '4.3',
    reviews: '320',
  },
  {
    id: 5,
    img: '/images/p5.jpg',
    description: '랄랄',
    discount: '20%',
    price: '39,500원',
    rating: '4.3',
    reviews: '320',
  },
  {
    id: 6,
    img: '/images/p6.jpg',
    description: '[2+1] 매일 먹는 종합 비타민',
    discount: '20%',
    price: '39,500원',
    rating: '4.3',
    reviews: '320',
  },
  {
    id: 7,
    img: '/images/p7.jpg',
    description: '[2+1] 매일 먹는 종합 비타민',
    discount: '20%',
    price: '39,500원',
    rating: '4.3',
    reviews: '320',
  },
  {
    id: 8,
    img: '/images/p8.jpg',
    description: '[2+1] 매일 먹는 종합 비타민',
    discount: '20%',
    price: '39,500원',
    rating: '4.3',
    reviews: '320',
  },
];

// 신상품 데이터
const newProducts = [
  {
    id: 1,
    img: '/images/p1.jpg',
    description: '[신상품] 비타민 C 1000mg',
    price: '25,000원',
    rating: '4.8',
    reviews: '150',
  },
  {
    id: 2,
    img: '/images/p2.jpg',
    description: '[신상품] 유산균 10종',
    price: '28,000원',
    rating: '4.7',
    reviews: '120',
  },
  {
    id: 3,
    img: '/images/p3.jpg',
    description: '[신상품] 오메가3 1000mg',
    price: '30,000원',
    rating: '4.9',
    reviews: '200',
  },
  {
    id: 4,
    img: '/images/p4.jpg',
    description: '[신상품] 마그네슘 500mg',
    price: '22,000원',
    rating: '4.5',
    reviews: '100',
  },
];

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentProductSlide, setCurrentProductSlide] = useState(0);
  const [currentNewProductSlide, setCurrentNewProductSlide] = useState(0);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // 슬라이드 변경 함수
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
    const interval = setInterval(nextSlide, 3000);
    return () => clearInterval(interval);
  }, []);

  // 인기 상품 슬라이드 변경
  const nextProductSlide = () => {
    setCurrentProductSlide((prev) => (prev + 1 < Math.ceil(popularProducts.length / 4) ? prev + 1 : 0));
  };

  const prevProductSlide = () => {
    setCurrentProductSlide((prev) => (prev > 0 ? prev - 1 : Math.ceil(popularProducts.length / 4) - 1));
  };

  // 현재 상품 그룹에 따라 상품을 선택
  const displayedProducts = popularProducts.slice(currentProductSlide * 4, currentProductSlide * 4 + 4);

  // 신상품 슬라이드 변경
  const nextNewProductSlide = () => {
    setCurrentNewProductSlide((prev) => (prev + 1 < Math.ceil(newProducts.length / 4) ? prev + 1 : 0));
  };

  const prevNewProductSlide = () => {
    setCurrentNewProductSlide((prev) => (prev > 0 ? prev - 1 : Math.ceil(newProducts.length / 4) - 1));
  };

  // 현재 신상품 그룹에 따라 상품을 선택
  const displayedNewProducts = newProducts.slice(currentNewProductSlide * 4, currentNewProductSlide * 4 + 4);

  return (
    <>
      <Navbar />

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
        <FaChevronLeft className="slider-button" onClick={prevSlide} />
        <FaChevronRight className="slider-button" onClick={nextSlide} />
      </div>

      {/* 트렌드 숏츠 부분 */}
      <h2 className="section-title1">트렌드 숏츠</h2>
      <div className="trend-shorts" style={{ margin: '0 20px', display: 'flex', justifyContent: 'center' }}>
        <div className="scroll-container">
          {videos.map((video, index) => (
            index < 10 && ( // 1번부터 10번까지 비디오 출력
              <div key={video.id} className="video-item">
                <video width="100%" height="auto" controls loop>
                  <source src={video.src} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <p>{video.description}</p>
              </div>
            )
          ))}
        </div>
      </div>

      {/* 베스트 게시물 부분 */}
      <h2 className="section-title">베스트 게시물</h2>
      <div className="Hbest-posts">
        {bestPosts.map((post) => (
          <Link to={`/post/${post.id}`} key={post.id} className="Hpost-item">
            <img src={post.img} alt={post.alt} className="Hpost-image" />
          </Link>
        ))}
      </div>

      {/* 인기 상품 슬라이드 부분 */}
      <h2 className="section-title2">인기 상품</h2>
      <div className="popular-products-slider">
        <FaChevronLeft className="slider-button" onClick={prevProductSlide} />
        <div className="product-items" style={{ display: 'flex', transform: `translateX(-${currentProductSlide * (100 / 4)}%)` }}>
          {displayedProducts.map((product) => (
            <div key={product.id} className="product-item">
              <img src={product.img} alt={product.description} className="product-image" />
              <div className="product-info">
                <p>{product.description}</p>
                <p>{product.discount} {product.price}</p>
                <p>★ {product.rating} 리뷰 {product.reviews}</p>
              </div>
            </div>
          ))}
        </div>
        <FaChevronRight className="slider-button" onClick={nextProductSlide} />
      </div>

      {/* 신상품 슬라이드 부분 */}
      <h2 className="section-title2">신상품</h2>
      <div className="popular-products-slider">
        <FaChevronLeft className="slider-button" onClick={prevNewProductSlide} />
        <div className="product-items" style={{ display: 'flex', transform: `translateX(-${currentNewProductSlide * (100 / 4)}%)` }}>
          {displayedNewProducts.map((product) => (
            <div key={product.id} className="product-item">
              <img src={product.img} alt={product.description} className="product-image" />
              <div className="product-info">
                <p>{product.description}</p>
                <p>{product.price}</p>
                <p>★ {product.rating} 리뷰 {product.reviews}</p>
              </div>
            </div>
          ))}
        </div>
        <FaChevronRight className="slider-button" onClick={nextNewProductSlide} />
      </div>

      <Footer/>
      
    </>
  );
};

export default HomePage;
