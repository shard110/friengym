import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // useNavigate 훅 추가
import axios from 'axios';
import { useAuth } from '../components/AuthContext'; // useAuth 훅 추가
import { addToCart } from '../utils/cartUtils.js'; // addToCart 함수 임포트

import './ProductDetail.css';
import Gnb from '../components/Gnb';
import ShopLnb from '../components/ShopLnb.js';
import Navbar from '../components/NavBar.js';
import FloatingMenu from '../components/FloatingMenu.js';

const ProductDetail = () => {
    const { pNum } = useParams();
    const navigate = useNavigate(); // useNavigate 훅 사용
    const { user, loading } = useAuth(); // useAuth 훅 사용
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/products/${pNum}`);
                setProduct(response.data);
            } catch (error) {
                console.error('상품을 불러오는 동안 오류 발생:', error);
            }
        };
        fetchProduct();
    }, [pNum]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!product) {
        return <div>Loading...</div>;
    }
    
    const formattedDate = new Date(product.pDate).toLocaleString();

    const handleBuyNow = () => {
        navigate('/order');
    };

    return (
        <div className="product-detail">
            <div className="product-detail-header">
                <Navbar />
                <ShopLnb />
                <FloatingMenu />
            </div>
            <div className='sec'>
                <img src={product.pImgUrl} alt={product.pName} className='prodImg'/>
                <div className='detail'>
                    <h3 className="title">{product.pName}</h3>
                    <div className="price">{product.pPrice.toLocaleString()}원</div>
                    <div className="count">재고 수량: {product.pCount}개</div>
                    <div className="date">업데이트: {formattedDate}</div>
                    <button type="submit" className='cartBtn' onClick={() => addToCart(product)}>장바구니</button>
                    <button type="submit" className='buyBtn' onClick={handleBuyNow}>구매하기</button>
                </div>
            </div>
            {product.pDetailImgUrl ? (
                <img src={product.pDetailImgUrl} alt="상세 이미지" className='prodDetail'/>
            ) : (
                <p>상세 이미지 파일이 없습니다.</p>
            )}
            <div className="product-detail-footer">
                footer
            </div>
        </div>
    );
};

export default ProductDetail;
