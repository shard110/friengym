import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', imgUrl: '', pcate: '' });
  const [editingProduct, setEditingProduct] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error(error);
      setMessage('상품 목록을 가져오는 데 실패했습니다.');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error(error);
      setMessage('카테고리 목록을 가져오는 데 실패했습니다.');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/products', newProduct);
      setProducts([...products, response.data]);
      setNewProduct({ name: '', price: '', imgUrl: '', pcate: '' });
      setMessage('상품이 등록되었습니다.');
    } catch (error) {
      console.error(error.response.data);
      setMessage('상품 등록에 실패했습니다.');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.pName,
      price: product.pPrice,
      imgUrl: product.pImgUrl,
      pcate: product.pcate // 수정된 부분
    });
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
        const updatedProduct = {
            pNum: editingProduct.pNum, // 수정할 제품의 pNum
            pName: newProduct.name,      // 매핑된 필드 이름
            pPrice: newProduct.price,     // 매핑된 필드 이름
            pImgUrl: newProduct.imgUrl,   // 매핑된 필드 이름
            pcate: newProduct.pcate       // 이미 맞는 필드 이름
        };
        const response = await axios.put(`http://localhost:8080/api/products/${editingProduct.pNum}`, updatedProduct);
        setProducts(products.map((prod) => (prod.pNum === editingProduct.pNum ? response.data : prod)));
        setEditingProduct(null);
        setNewProduct({ name: '', price: '', imgUrl: '', pcate: '' });
        setMessage('상품이 수정되었습니다.');
    } catch (error) {
        console.error(error.response.data);
        setMessage('상품 수정에 실패했습니다.');
    }
};

  const handleDeleteProduct = async (pNum) => {
    try {
      await axios.delete(`http://localhost:8080/api/products/${pNum}`);
      setProducts(products.filter((prod) => prod.pNum !== pNum));
      setMessage('상품이 삭제되었습니다.');
    } catch (error) {
      console.error(error.response.data);
      setMessage('상품 삭제에 실패했습니다.');
    }
  };

  return (
    <div>
      <h1>상품 목록</h1>
      {message && <p>{message}</p>}
      <ul>
        {products.map((product) => (
          <li key={product.pNum}>
            {product.pName} - {product.pPrice} 원
            <button onClick={() => handleEditProduct(product)}>수정</button>
            <button onClick={() => handleDeleteProduct(product.pNum)}>삭제</button>
          </li>
        ))}
      </ul>

      <h2>{editingProduct ? '상품 수정' : '상품 등록'}</h2>
      <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}>
        <input
          type="text"
          placeholder="상품명"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="가격"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="이미지 URL"
          value={newProduct.imgUrl}
          onChange={(e) => setNewProduct({ ...newProduct, imgUrl: e.target.value })}
          required
        />
        <select
          value={newProduct.pcate}
          onChange={(e) => setNewProduct({ ...newProduct, pcate: e.target.value })}
          required
        >
          <option value="">카테고리 선택</option>
          {categories.map((category) => (
            <option key={category.catenum} value={category.catenum}>
              {category.name}
            </option>
          ))}
        </select>
        <button type="submit">{editingProduct ? '수정' : '등록'}</button>
      </form>
    </div>
  );
};

export default Shop;
