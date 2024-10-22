import React, { useEffect, useState } from 'react';
import './PopularProducts.css';
import { Link } from 'react-router-dom';
import ShopLnb from './ShopLnb';
import Footer from './Footer';
import FloatingMenu from './FloatingMenu';
import Navbar from './NavBar';
import replace from "../img/product_replace.png";

function PopularProducts({ limit, showFooter = true }) {
    const [popularProducts, setPopularProducts] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:8080/product/popular${limit ? `?limit=${limit}` : ''}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    setPopularProducts(data);
                } else {
                    console.error('Expected an array but got:', data);
                    setPopularProducts([]);
                }
            })
            .catch(error => console.error('Error fetching popular products:', error));
    }, [limit]);

    const onErrorImg = (e) => {
        e.target.src = replace;
    };

    return (
        <div className='popular-products'>
            <Navbar />
            <ShopLnb />
            <FloatingMenu />
            <h2 style={{ margin: '64px', color: '#333' }}>Best</h2>
            <div className="product-list">
                {popularProducts.map(product => (
                    <div key={product.pNum} className="product-item">
                        <Link to={`/productslist/${product.pNum}`}>
                            <img src={product.pImgUrl} alt={`상품명: ${product.pName}`} onError={onErrorImg}/>
                        </Link>
                        <p className='prod_name'>{product.pName}</p>
                        <p className='prod_price'> ₩ {product.pPrice.toLocaleString()}</p>
                        <p className='prod_count'>재고 : {product.pCount}개</p>
                    </div>
                ))}
            </div>
            {showFooter && <Footer />}
        </div>
    );
}

export default PopularProducts;
