import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', pcate: '', count: '' });
  const [editingProduct, setEditingProduct] = useState(null);
  const [message, setMessage] = useState('');
  const [imageFile, setImageFile] = useState(null); // 이미지 파일 상태

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
    let imgUrl = '';

    // 이미지 파일이 선택된 경우
    if (imageFile) {
      const formData = new FormData();
      formData.append('file', imageFile);
      await axios.post(`http://localhost:8080/api/products/${newProduct.pcate}/uploadImage`, formData);
      imgUrl = `/images/${imageFile.name}`; // 이미지 URL 설정
    }

    try {
      const response = await axios.post('http://localhost:8080/api/products', { ...newProduct, pImgUrl: imgUrl });
      setProducts([...products, response.data]);
      setNewProduct({ name: '', price: '', pcate: '', count: '' });
      setImageFile(null);
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
      pcate: product.pcate,
      count: product.pCount
    });
    setImageFile(null); // 파일 초기화
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    let imgUrl = editingProduct.pImgUrl; // 기존 이미지 URL 사용

    // 이미지 파일이 선택된 경우
    if (imageFile) {
      const formData = new FormData();
      formData.append('file', imageFile);
      await axios.post(`http://localhost:8080/api/products/${editingProduct.pNum}/uploadImage`, formData);
      imgUrl = `/images/${imageFile.name}`; // 새로운 이미지 URL 설정
    }

    try {
      const updatedProduct = {
        pNum: editingProduct.pNum,
        pName: newProduct.name,
        pPrice: newProduct.price,
        pImgUrl: imgUrl, // 이미지 URL을 업데이트
        pcate: newProduct.pcate,
        pCount: newProduct.count
      };
      const response = await axios.put(`http://localhost:8080/api/products/${editingProduct.pNum}`, updatedProduct);
      setProducts(products.map((prod) => (prod.pNum === editingProduct.pNum ? response.data : prod)));
      setEditingProduct(null);
      setNewProduct({ name: '', price: '', pcate: '', count: '' });
      setImageFile(null);
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
            <img src={product.pImgUrl} alt={product.pName} style={{ width: '100px', height: '100px' }} />
            {product.pName} - {product.pPrice} 원 - 재고: {product.pCount}개
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
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])} // 파일 선택 시 상태 업데이트
        />
        <input
          type="number"
          placeholder="재고 수량"
          value={newProduct.count}
          onChange={(e) => setNewProduct({ ...newProduct, count: e.target.value })}
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
              {category.cateName}
            </option>
          ))}
        </select>
        <button type="submit">{editingProduct ? '수정하기' : '등록하기'}</button>
      </form>
    </div>
  );
};

export default Shop;
