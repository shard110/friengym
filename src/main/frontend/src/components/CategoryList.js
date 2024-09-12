import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CategoryList.css';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/api/categories')
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.error('카테고리를 불러오는 중 오류가 발생했습니다.', error);
            });
    }, []);

    return (
        <div className="category-list">
            <h2 className='category-tit'>카테고리</h2>
            {categories.map(category => (
                <div className="category-item" key={category.cateNum}>
                    {category.cateName}
                </div>
            ))}
        </div>
    );
};

export default CategoryList;
