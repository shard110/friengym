import React, { useEffect, useState } from 'react';
import './PopularProducts.css';

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
        <div>
            <div className="product-list">
                {popularProducts.map(product => (
                    <div key={product.pNum} className="product-item">
                        <img src={product.pImg} alt={`상품명: ${product.pName}`} />
                        <p className='prod_name'>{product.pName}</p>
                        <p className='prod_price'> ₩ {product.pPrice.toLocaleString()}</p>
                        <p className='prod_count'>재고 : {product.pCount}개</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PopularProducts;
