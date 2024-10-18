import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { addToCart } from "../utils/cartUtils"; // addToCart 함수 임포트
import "./ProductList.css";
import Footer from "../components/Footer";
import { ShoppingCart } from "react-feather";
import ShopLnb from "../components/ShopLnb";
import replace from "../img/product_replace.png";
import FloatingMenu from "../components/FloatingMenu";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [sortType, setSortType] = useState("name");
  const [title, setTitle] = useState('전체 상품'); // 상태 추가
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const keyword = query.get("keyword") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = keyword
          ? await axios.get(`http://localhost:8080/api/products/search?keyword=${keyword}`)
          : await axios.get("http://localhost:8080/api/products");
        setProducts(response.data);
        setTitle(keyword ? `'${keyword}'(으)로 검색한 결과입니다.` : '전체 상품'); // 검색어에 따라 제목 설정
      } catch (error) {
        console.error("상품을 가져오는 중 오류가 발생했습니다.", error);
      }
    };

    fetchProducts();
  }, [keyword]);

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

  const onErrorImg = (e) => {
    e.target.src = replace;
  };

  return (
    <div>
      <ShopLnb />
      <FloatingMenu />
      <div id="productlist-wrap">
        <div className="product-section">
          <h2 className="list-tit">{title}</h2> {/* 상태를 사용해 제목을 렌더링 */}
          <div className="sort-container">
            <select onChange={(e) => handleSort(e.target.value)}>
              <option value="name">이름순 정렬</option>
              <option value="lowPrice">낮은 가격순 정렬</option>
              <option value="highPrice">높은 가격순 정렬</option>
              <option value="count">재고순 정렬</option>
            </select>
          </div>
          <section className="product-grid">
            {products.map((product) => (
              <div className="product-box" key={product.pNum}>
                <div className="product-img-container">
                  <Link to={`/productslist/${product.pNum}`}>
                    <img
                      className="product-img"
                      src={product.pImgUrl}
                      alt={product.pName}
                      onError={onErrorImg}
                    />
                  </Link>
                  <button
                    className="cartIconBtn"
                    onClick={() => addToCart(product)}
                  >
                    <ShoppingCart />
                  </button>
                </div>
                <Link to={`/productslist/${product.pNum}`}>
                  <div className="product-name">{product.pName}</div>
                  <p className="product-price">{product.pPrice.toLocaleString()}원</p>
                  <p className="product-conut">재고: {product.pCount}개</p>
                </Link>
              </div>
            ))}
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductList;
