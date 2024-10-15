import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { addToCart } from '../utils/cartUtils'; // addToCart 함수 임포트
import './ProductList.css';
import Footer from '../components/Footer';
import icon_cart from '../img/icon_cart.png';
import ShopLnb from '../components/ShopLnb';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [sortType, setSortType] = useState('name');
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const keyword = query.get('keyword') || '';

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = keyword
                    ? await axios.get(`http://localhost:8080/api/products/search?keyword=${keyword}`)
                    : await axios.get('http://localhost:8080/api/products');
                setProducts(response.data);
            } catch (error) {
                console.error('상품을 가져오는 중 오류가 발생했습니다.', error);
            }
        };
        fetchProducts();
    }, [keyword]);

    const handleSort = (type) => {
        setSortType(type);
        let sortedProducts = [...products];
        if (type === 'name') {
            sortedProducts.sort((a, b) => a.pName.localeCompare(b.pName));
        } else if (type === 'lowPrice') {
            sortedProducts.sort((a, b) => a.pPrice - b.pPrice);
        } else if (type === 'highPrice') {
            sortedProducts.sort((a, b) => b.pPrice - a.pPrice);
        } else if (type === 'count') {
            sortedProducts.sort((a, b) => b.pCount - a.pCount);
        }
        setProducts(sortedProducts);
    };

    return (
        <div>
            <ShopLnb />
            <div id='grand-wrap'>
                <div className="product-section">
                    <div className="sort-container">
                        <select onChange={(e) => handleSort(e.target.value)}>
                            <option value="name">이름순 정렬</option>
                            <option value="lowPrice">낮은 가격순 정렬</option>
                            <option value="highPrice">높은 가격순 정렬</option>
                            <option value="count">재고순 정렬</option>
                        </select>
                    </div>
                    <section className="product-grid">
                        {products.map(product => (
                            <div className="product-card" key={product.pNum}>
                                <div className="product-img-container">
                                    <Link to={`/productslist/${product.pNum}`}>
                                        <img className='product-img' src={product.pImgUrl} alt={product.pName} />
                                    </Link>
                                    <button className='cartIconBtn' onClick={() => addToCart(product)}>
                                        <img src={icon_cart} alt='장바구니'></img>
                                    </button>
                                </div>
                                <Link to={`/productslist/${product.pNum}`}>
                                    <h3>{product.pName}</h3>
                                </Link>
                                <p className='product-price'> ₩ {product.pPrice.toLocaleString()}</p>
                                <p className='product-conut'>재고: {product.pCount}개 남음</p>
                            </div>
                        ))}
                    </section>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ProductList;
