import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ListStyles.css';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', pcate: null, count: '' });
  const [editingProduct, setEditingProduct] = useState(null);
  const [message, setMessage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [detailImageFile, setDetailImageFile] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      await fetchProducts();
      await fetchCategories();
      loadLocalData();
    };
    loadData();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/products');
      setProducts(response.data);
      console.log('Fetched Products:', response.data);
    } catch (error) {
      console.error(error);
      setMessage('상품 목록을 가져오는 데 실패했습니다.');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/categories');
      setCategories(response.data);
      console.log('Fetched Categories:', response.data);
    } catch (error) {
      console.error(error);
      setMessage('카테고리 목록을 가져오는 데 실패했습니다.');
    }
  };

  const loadLocalData = () => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
  };

  const saveLocalData = (products) => {
    localStorage.setItem('products', JSON.stringify(products));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    let imgUrl = '';
    let detailImgUrl = '';

    if (imageFile) {
      const formData = new FormData();
      formData.append('file', imageFile);
      await axios.post(`http://localhost:8080/api/products/${newProduct.pcate}/uploadImage`, formData);
      imgUrl = `/images/${imageFile.name}?t=${Date.now()}`;
    }

    if (detailImageFile) {
      const formDataDetail = new FormData();
      formDataDetail.append('file', detailImageFile);
      await axios.post(`http://localhost:8080/api/products/${newProduct.pcate}/uploadDetailImage`, formDataDetail);
      detailImgUrl = `/images/${detailImageFile.name}?t=${Date.now()}`;
    }

    const productData = {
      pName: newProduct.name,
      pPrice: parseInt(newProduct.price),
      pCount: parseInt(newProduct.count),
      pImgUrl: imgUrl,
      pDetailImgUrl: detailImgUrl,
      pcate: parseInt(newProduct.pcate),
    };

    try {
      const response = await axios.post('http://localhost:8080/api/products', productData);
      const updatedProducts = [...products, response.data];
      setProducts(updatedProducts);
      saveLocalData(updatedProducts);
      setNewProduct({ name: '', price: '', pcate: null, count: '' });
      setImageFile(null);
      setDetailImageFile(null);
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
      count: product.pCount,
    });
    setImageFile(null);
    setDetailImageFile(null);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    let imgUrl = editingProduct.pImgUrl;
    let detailImgUrl = editingProduct.pDetailImgUrl;

    if (imageFile) {
      const formData = new FormData();
      formData.append('file', imageFile);
      await axios.post(`http://localhost:8080/api/products/${editingProduct.pNum}/uploadImage`, formData);
      imgUrl = `/images/${imageFile.name}?t=${Date.now()}`;
    }

    if (detailImageFile) {
      const formDataDetail = new FormData();
      formDataDetail.append('file', detailImageFile);
      await axios.post(`http://localhost:8080/api/products/${editingProduct.pNum}/uploadDetailImage`, formDataDetail);
      detailImgUrl = `/images/${detailImageFile.name}?t=${Date.now()}`;
    }

    const updatedProduct = {
      pNum: editingProduct.pNum,
      pName: newProduct.name,
      pPrice: parseInt(newProduct.price),
      pCount: parseInt(newProduct.count),
      pImgUrl: imgUrl,
      pDetailImgUrl: detailImgUrl,
      pcate: parseInt(newProduct.pcate),
    };

    try {
      const response = await axios.put(`http://localhost:8080/api/products/${editingProduct.pNum}`, updatedProduct);
      const updatedProducts = products.map(prod =>
        prod.pNum === updatedProduct.pNum ? { ...response.data, pImgUrl: imgUrl, pDetailImgUrl: detailImgUrl } : prod
      );
      setProducts(updatedProducts);
      saveLocalData(updatedProducts);
      setEditingProduct(null);
      setNewProduct({ name: '', price: '', pcate: null, count: '' });
      setImageFile(null);
      setDetailImageFile(null);
      setMessage('상품이 수정되었습니다.');
    } catch (error) {
      console.error(error.response.data);
      setMessage('상품 수정에 실패했습니다.');
    }
  };

  const handleDeleteProduct = async (pNum) => {
    try {
      await axios.delete(`http://localhost:8080/api/products/${pNum}`);
      const updatedProducts = products.filter((prod) => prod.pNum !== pNum);
      setProducts(updatedProducts);
      saveLocalData(updatedProducts);
      setMessage('상품이 삭제되었습니다.');
    } catch (error) {
      console.error(error.response.data);
      setMessage('상품 삭제에 실패했습니다.');
    }
  };

  const getCategoryName = (pcate) => {
    if (pcate === null || pcate === undefined) return '미지정';
    const category = categories.find(category => category.catenum === pcate);
    return category ? category.catename : '미지정';
  };

  const filteredProducts = products.filter(product => 
    selectedCategory ? product.pcate === parseInt(selectedCategory) : true
  );

  return (
    <div className="shop-container">
      <h1 className="shop-title">쇼핑몰 상품 관리</h1>

      {/* 카테고리 선택 기능 */}
      <div>
        <select onChange={(e) => setSelectedCategory(e.target.value)} value={selectedCategory}>
          <option value="">모든 카테고리</option>
          {categories.map(category => (
            <option key={category.catenum} value={category.catenum}>{category.catename}</option>
          ))}
        </select>
      </div>

      {/* 상품 목록을 표 형식으로 표시 */}
      <table className="common-table">
        <thead>
          <tr>
            <th>상품명</th>
            <th>가격</th>
            <th>재고</th>
            <th>카테고리</th>
            <th>등록일</th>
            <th>이미지</th>
            <th>상세 이미지</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.pNum}>
              <td>{product.pName}</td>
              <td>{product.pPrice} 원</td>
              <td>{product.pCount}개</td>
              <td>{getCategoryName(product.pcate)}</td>
              <td>{product.pDate ? new Date(product.pDate).toLocaleDateString() : '날짜 없음'}</td>
              <td>
                <img src={product.pImgUrl} alt={product.pName} />
              </td>
              <td>
                <img src={product.pDetailImgUrl} alt={`${product.pName} 상세`} />
              </td>
              <td>
                <button onClick={() => handleEditProduct(product)}>수정</button>
                <button onClick={() => handleDeleteProduct(product.pNum)}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 상품 등록 및 수정 폼 */}
      <form className="shop-form" onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}>
        <input type="text" placeholder="상품명" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} required />
        <input type="number" placeholder="가격" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} required />
        <select value={newProduct.pcate} onChange={(e) => setNewProduct({ ...newProduct, pcate: e.target.value })} required>
          <option value="">카테고리 선택</option>
          {categories.map(category => (
            <option key={category.catenum} value={category.catenum}>{category.catename}</option>
          ))}
        </select>
        <input type="number" placeholder="재고" value={newProduct.count} onChange={(e) => setNewProduct({ ...newProduct, count: e.target.value })} required />
        <input type="file" onChange={(e) => setImageFile(e.target.files[0])} />
        <input type="file" onChange={(e) => setDetailImageFile(e.target.files[0])} />
        <button type="submit">{editingProduct ? '수정하기' : '등록하기'}</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default Shop;
