import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ShopLnb from './ShopLnb';

function NewProducts() {
  const [newProducts, setNewProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/product/new')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log("Fetched new products:", data); // 콘솔에 데이터 출력
        setNewProducts(data);
      })
      .catch(error => console.error('Error fetching new products:', error));
  }, []);

  return (
    <div>
      <style>
        {`
          .navbar .wrap ul li:first-child .active{
            color: #333;
            border-bottom: none;
          }
        `}
      </style>
      <ShopLnb />
      <h2>New Products</h2>
      <div className="product-list">
        {newProducts.length > 0 ? (
          newProducts.map(product => (
            <div key={product.pNum} className="product-item">
              <Link to={`/productslist/${product.pNum}`}>
                <img src={product.pImg} alt={`상품명: ${product.pName}`} />
              </Link>
              <p>{product.pName}</p>
              <p>{product.pPrice}원</p>
            </div>
          ))
        ) : (
          <p>No new products available.</p> 
        )}
      </div>
    </div>
  );
}

export default NewProducts;
