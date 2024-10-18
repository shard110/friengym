import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, NavLink, useParams } from 'react-router-dom';
import './CategoryProductsPage.css';
import ShopLnb from './ShopLnb';
import replace from "../img/product_replace.png";
import FloatingMenu from "../components/FloatingMenu";
import Footer from './Footer';

function CategoryProductsPage() {
    const [categories, setCategories] = useState([]);
    const { catenum } = useParams();
    const [products, setProducts] = useState([]);
    const [sortType, setSortType] = useState("name");

    useEffect(() => {
        axios.get('/api/categories')
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });

        axios.get(`/product/category/${catenum}`)
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });
    }, [catenum]);

    const onErrorImg = (e) => {
        console.log('Image error:', e);
        e.target.src = replace;
    };

    const handleSort = (type) => {
      setSortType(type);
      let sortedProducts = [...products];
      if (type === "name") {
        sortedProducts.sort((a, b) => a.pName.localeCompare(b.pName));
      } else if (type === "lowPrice") {
        sortedProducts.sort((a, b) => a.pPrice - b.pPrice);
      } else if (type === "highPrice") {
        sortedProducts.sort((a, b) => b.pPrice - a.pPrice);
      } else if (type === "count") {
        sortedProducts.sort((a, b) => b.pCount - a.pCount);
      }
      setProducts(sortedProducts);
    };

    return (
        <div className="category-products">
            <ShopLnb />
            <FloatingMenu />
            <div className='cate-wrap'>
            <h2>카테고리별 상품 목록</h2>
            <div className="category-menu">
                <p>카테고리 목록</p>
                <ul className='cate-list'>
                    {categories.map(category => (
                        <li key={category.catenum}>
                            <Link to={`/categories/${category.catenum}`}>{category.catename}</Link>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="sort-container">
            <select onChange={(e) => handleSort(e.target.value)}>
              <option value="name">이름순 정렬</option>
              <option value="lowPrice">낮은 가격순 정렬</option>
              <option value="highPrice">높은 가격순 정렬</option>
              <option value="count">재고순 정렬</option>
            </select>
          </div>
            {products.length === 0 ? (
                <p>해당 카테고리에 상품이 없습니다.</p>
            ) : (
                <ul>
                    {products.map(product => (
                        <li key={product.pNum}>
                            <img src={product.pImgUrl} alt={product.pName} onError={onErrorImg} />
                            <h3>{product.pName}</h3>
                            <p>가격: {product.pPrice}원</p>
                        </li>
                    ))}
                </ul>
            )}
            </div>
            <Footer />
        </div>
    );
}

export default CategoryProductsPage;
