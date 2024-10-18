import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PopularProducts from './PopularProducts';
import './ProductHome.css';
import ShopLnb from './ShopLnb';
import FloatingMenu from './FloatingMenu';
import Footer from './Footer';
import { ChevronLeft, ChevronRight } from 'react-feather';
import replace from "../img/product_replace.png";
import Navbar from './NavBar';

function ProductHome() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [recentProducts, setRecentProducts] = useState([]);
    const [reviews, setReviews] = useState([]); // 리뷰 상태 추가
    const [currentReviewIndex, setCurrentReviewIndex] = useState(0); // 현재 리뷰 인덱스

    const images = [
        'http://localhost:8080/images/banner1.jpg',
        'http://localhost:8080/images/banner2.jpg',
        'http://localhost:8080/images/banner3.jpg'
    ];

    useEffect(() => {
        axios.get('http://localhost:8080/product')
            .then(response => {
                setRecentProducts(response.data);
            })
            .catch(error => {
                console.error('Error fetching recent products:', error);
            });

        // 리뷰 목록 가져오기
        axios.get('http://localhost:8080/reviews')
            .then(response => {
                setReviews(response.data);
            })
            .catch(error => {
                console.error('Error fetching reviews:', error);
            });

        const interval = setInterval(() => {
            setCurrentImageIndex(prevIndex =>
                prevIndex === images.length - 1 ? 0 : prevIndex + 1
            );
        }, 2000);

        // 리뷰 슬라이드
        const reviewInterval = setInterval(() => {
            setCurrentReviewIndex(prevIndex =>
                prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
            );
        }, 1000); // 1초마다 리뷰가 변경되도록 설정

        return () => {
            clearInterval(interval);
            clearInterval(reviewInterval);
        };
    }, [images.length, reviews.length]);

    const onErrorImg = (e) => {
        e.target.src = replace;
      };
    
    return (
        <div className="product-home">
            <Navbar />
            <ShopLnb />
            <FloatingMenu />
            <div className="banner">
                <img
                    src={images[currentImageIndex]}
                    alt="배너 이미지"
                    className="banner-image"
                />
                <button className="prev-button" onClick={() => setCurrentImageIndex(currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1)}>
                    <ChevronLeft size={48}/>
                </button>
                <button className="next-button" onClick={() => setCurrentImageIndex(currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1)}>
                    <ChevronRight size={48}/>
                </button>
            </div>
            <div className='prod-wrap' >
            <section id='shop_cont'>
                <div className="section popular-products">
                    <h2>Best</h2>
                    <div className='flex_box'>
                        <p className='etc'>frengym에서 최고 인기! Best 상품들을 만나보세요.</p>
                        <Link to="/products/popular">more</Link>
                    </div>
                </div>
                <PopularProducts limit={4} />
            </section>

                <div className="ad">
                    <p>영양제, 뭘 선택해야할지 고민이시죠?</p>
                    <p>각종 영양제 종류부터 효과까지 frengym에서 자세히 알려드려요</p>
                    <a href="#">click →</a>
                </div>

            <section id='shop_cont'>
                <div className="section new-products">
                    <h2>이 달의 신규상품</h2>
                    <div className='flex_box'>
                        <p className='etc'>트레이너들이 엄선한 신규 상품, 당신에게 꼭 맞는 상품을 찾아보세요.</p>
                        <Link to="/products/new">more</Link>
                    </div>
                    <div className="product-list">
                        {recentProducts.length > 0 ? (
                            recentProducts.slice(0, 3).map(product => (  // 3개만 표시
                                <div key={product.pNum} className="product-item">
                                    <Link to={`/productslist/${product.pNum}`}>
                                        <img src={product.pImgUrl} alt={`상품명: ${product.pName}`} onError={onErrorImg}/>
                                    </Link>
                                    <p className='prod_name'>{product.pName}</p>
                                    <p className='prod_price'> ₩ {product.pPrice.toLocaleString()}</p>
                                    <p className='prod_count'>재고 : {product.pCount}개</p>
                                </div>
                            ))
                        ) : (
                            <p>No new products available.</p>
                        )}
                    </div>
                </div>
            
            {/* 리뷰 슬라이드 섹션 */}
            <div className="section review-slider">
                <h3>리뷰</h3>
                <div className="review-container">
                    {reviews.length > 0 && (
                        <div className="review-item">
                            <p><strong>상품명:</strong> {reviews[currentReviewIndex].productName}</p>
                            <p><strong>작성자:</strong> {reviews[currentReviewIndex].userId}</p>
                            <p><strong>별점:</strong> {reviews[currentReviewIndex].star}/5</p>
                            <p><strong>리뷰 내용:</strong> {reviews[currentReviewIndex].rvContents}</p>
                        </div>
                    )}
                </div>
                </div>
            </section>
            </div>
            <Footer />
        </div>
    );
}

export default ProductHome;
