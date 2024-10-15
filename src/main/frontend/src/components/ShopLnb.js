import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './ShopLnb.css';
import { Search } from 'react-feather';

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
            <div className='wrap'>
                <ul>
                    <li><NavLink to="/products" activeclassname='active'>쇼핑홈</NavLink></li>
                    <li><NavLink to="/productslist" activeclassname='active'>전체상품</NavLink></li>
                    <li className="category-menu"
                        onMouseEnter={() => setShowCategories(true)}
                        onMouseLeave={() => setShowCategories(false)}>
                        <NavLink to="/categories/1" activeclassname='active'>카테고리</NavLink>
                        <ul className={`category-list ${showCategories ? 'show' : ''}`}>
                            {categories.map(category => (
                                <li key={category.catenum}>
                                    <Link to={`/categories/${category.catenum}`}
                                        onClick={() => setShowCategories(false)}>{category.catename}</Link>
                                </li>
                            ))}
                        </ul>
                    </li>
                    <li><NavLink to="/products/new" activeclassname='active'>신상품</NavLink></li>
                    <li><NavLink to="/products/popular" activeclassname='active'>베스트</NavLink></li>
                </ul>
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="쇼핑몰 상품 검색"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                    />
                    <button onClick={handleSearch}><Search /></button>
                </div>
            </div>
        </nav>
    );
}

export default ShopLnb;
