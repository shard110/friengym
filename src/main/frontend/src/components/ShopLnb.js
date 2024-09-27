import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './ShopLnb.css';

function ShopLnb() {
    const [categories, setCategories] = useState([]);
    const [showCategories, setShowCategories] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');

    useEffect(() => {
        axios.get('/api/categories')
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
    }, []);

    const handleSearch = () => {
        window.location.href = `/productslist?keyword=${searchKeyword}`;
    };

    return (
        <nav className="navbar">
            <ul>
                <li><Link to="/posts">쇼핑홈</Link></li>
                <li className="category-menu"
                    onMouseEnter={() => setShowCategories(true)}
                    onMouseLeave={() => setShowCategories(false)}>
                    <div className="category-toggle">카테고리</div>
                    <ul className={`category-list ${showCategories ? 'show' : ''}`}>
                        {categories.map(category => (
                            <li key={category.catenum}>
                                <Link to={`/categories/${category.catenum}`}
                                    onClick={() => setShowCategories(false)}>{category.catename}</Link>
                            </li>
                        ))}
                    </ul>
                </li>
                <li><Link to="/products/new">신상품</Link></li>
                <li><Link to="/products/popular">베스트</Link></li>
                <li><Link to="/order-history">주문내역</Link></li>
            </ul>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="쇼핑몰 상품 검색"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                />
                <button onClick={handleSearch}>🔍︎</button>
            </div>
        </nav>
    );
}

export default ShopLnb;
