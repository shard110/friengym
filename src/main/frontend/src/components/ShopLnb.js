import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './ShopLnb.css';
import { Search, X } from 'react-feather';

function ShopLnb() {
  const [categories, setCategories] = useState([]);
  const [showCategories, setShowCategories] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isOpen, setIsOpen] = useState(false);

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
    setIsOpen(false);
    window.location.href = `/productslist?keyword=${searchKeyword}`;
  };

  const toggleSearchMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleKeySearch = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const closeSearch =()=>{
    setIsOpen(false);
  }

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
          <li><NavLink to="/cart" activeclassname='active'>장바구니</NavLink></li>
          <li><NavLink to="/order-history" activeclassname='active'>주문내역</NavLink></li>
        </ul>
        <div className="search-bar">
          <input
            className='search-input'
            type="text"
            placeholder="쇼핑몰 상품 검색"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={handleKeySearch}
          />
          <button onClick={handleSearch} className="search-action-button"><Search /></button>
        </div>
          {/* 모바일용 */}
          <div className="search-bar-moblie">
            <div className="search-toggle-button" onClick={toggleSearchMenu}><Search /></div>
                <div className={`sliding-search ${isOpen ? 'sliding-search--open':''}`}>
                    <input
                        className='search-input-moblie'
                        type="text"
                        placeholder="쇼핑몰 상품 검색"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        onKeyDown={handleKeySearch}
                    />
                    <button onClick={handleSearch} className="search-action-button-moblie"><Search /></button>
                    <button onClick={closeSearch} className="search-close"><X /></button>
                </div>
            </div>
      </div>
    </nav>
  );
}

export default ShopLnb;
