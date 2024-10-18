import React, { useEffect, useState } from 'react';
import './PopularProducts.css';
import { Link } from 'react-router-dom';
import ShopLnb from './ShopLnb';
import Footer from './Footer';
import FloatingMenu from './FloatingMenu';

function PopularProducts({ limit }) {
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

    return (
        <div className='popular-products'>
            <ShopLnb />
            <FloatingMenu />
            <div className="product-list">
                {popularProducts.map(product => (
                    <div key={product.pNum} className="product-item">
                        <Link to={`/productslist/${product.pNum}`}>
                            <img src={product.pImgUrl} alt={`상품명: ${product.pName}`} />
                        </Link>
                        <p className='prod_name'>{product.pName}</p>
                        <p className='prod_price'> ₩ {product.pPrice.toLocaleString()}</p>
                        <p className='prod_count'>재고 : {product.pCount}개</p>
                    </div>
                ))}
            </div>
            <Footer />
        </div>
    );
}

export default PopularProducts;
