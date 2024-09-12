import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Link 컴포넌트 추가
import './CategoryProductsPage.css';

function CategoryProductsPage() {
    const { catenum } = useParams();
    const [products, setProducts] = useState([]);

    useEffect(() => {
      axios.get(`/product/category/${catenum}`)
          .then(response => {
              setProducts(response.data);
          })
          .catch(error => {
              console.error('Error fetching products:', error);
          });
    }, [catenum]);

    return (
      <div className="category-products">
        <h2>카테고리별 상품 목록</h2>
        {products.length === 0 ? (
          <p>해당 카테고리에 상품이 없습니다.</p>
        ) : (
          <ul>
            {products.map(product => (
              <li key={product.pNum}>
                  <img src={product.pImg} alt={product.pName} />
                  <h3>{product.pName}</h3>
                  <p>가격: {product.pPrice}원</p>
                
              </li>
            ))}
          </ul>
        )}
      </div>
    );
}

export default CategoryProductsPage;
