import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Link 컴포넌트 임포트
import './HomePage.css';
import Footer from './Footer';
import FloatingMenu from './FloatingMenu';
import Navbar from './NavBar';

// 슬라이드 데이터
const slidesData = [
  { id: 1, img: 'http://localhost:8080/images/banner2.jpg', title: '', description: '' },
  { id: 2, img: 'http://localhost:8080/images/banner3.jpg', title: '', description: '' },
  { id: 3, img: 'http://localhost:8080/images/banner4.jpg', title: '', description: '' },
];

// 인기 상품 데이터
const productsData = [
  { id: 1, name: 'Product 1', price: '$10', img: 'http://localhost:8080/images/p7.jpg', link: '/productslist/1' },
  { id: 2, name: 'Product 2', price: '$20', img: 'http://localhost:8080/images/banner2.jpg', link :'/productslist/2' },
  { id: 3, name: 'Product 3', price: '$30', img: 'http://localhost:8080/images/banner2.jpg', link: '/productslist/3' },
  { id: 4, name: 'Product 4', price: '$30', img: 'http://localhost:8080/images/banner2.jpg', link: '/productslist/4' },
];

// 인기 게시물 데이터
const postsData = [
  { id: 1, name: 'post 1', price: '$10', img: 'http://localhost:8080/images/p7.jpg', link: '/posts/1' },
  { id: 2, name: 'post 2', price: '$20', img: 'http://localhost:8080/images/p8.jpg', link: '/posts/2' },
  { id: 3, name: 'post 3', price: '$30', img: 'http://localhost:8080/images/p9.jpg', link: '/posts/3' },
  { id: 4, name: 'post 4', price: '$30', img: 'http://localhost:8080/images/p4.jpg', link: '/posts/4' },
];

// 상품 카드 컴포넌트
const ProductCard = ({ product }) => (
  <Link to={product.link || '/'} className="product-card">
    <img src={product.img} alt={product.name} />
    <h3>{product.name}</h3>
    <p>{product.price}</p>
  </Link>
);

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slidesData.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + slidesData.length) % slidesData.length);
  };

  return (
    <div className="homepage">
      <Navbar />
      <FloatingMenu />
      <div className="homepage-inner">
        <section className="slide-container">
          <div className="slides" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {slidesData.map((slide) => (
              <div className="slide" key={slide.id}>
                <img src={slide.img} alt={`Slide ${slide.id}`} />
                <h2>{slide.title}</h2>
                <p>{slide.description}</p>
              </div>
            ))}
          </div>
          <button className="slide-button prev-button" onClick={prevSlide}>Previous</button>
          <button className="slide-button next-button" onClick={nextSlide}>Next</button>
        </section>

        <div className="product-section2">
          <div className="product-header">
            <h2 className="product-title">Best 게시물</h2>
            <Link to="/posts" className="more-products-link">게시물 더보기</Link>
          </div>
          <div className="product-list">
            {postsData.map((post) => (
              <ProductCard key={post.id} product={post} />
            ))}
          </div>
        </div>

        <div className="product-section">
          <div className="product-header">
            <h2 className="product-title">인기 상품</h2>
            <Link to="/products" className="more-products-link2">상품 더보기</Link>
          </div>
          <div className="product-list">
            {productsData.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        <div className="product-section2">
          <div className="product-header">
            <h2 className="product-title">새 상품</h2>
            <Link to="/products" className="more-products-link">상품 더보기</Link>
          </div>
          <div className="product-list">
            {productsData.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
      <Footer /> {/* Footer 컴포넌트 추가 */}
    </div>
  );
};

export default HomePage;
