import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
      loadLocalData(); // 로컬 스토리지에서 데이터 로드
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
      saveLocalData(updatedProducts); // 로컬 스토리지에 저장
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
      await axios.put(`http://localhost:8080/api/products/${editingProduct.pNum}`, updatedProduct);
      const updatedProducts = products.map(prod => (prod.pNum === updatedProduct.pNum ? updatedProduct : prod));
      setProducts(updatedProducts);
      saveLocalData(updatedProducts); // 로컬 스토리지에 저장
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
      saveLocalData(updatedProducts); // 로컬 스토리지에 저장
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

  const filteredProducts = selectedCategory 
    ? products.filter(product => product.pcate === selectedCategory) 
    : products;

  return (
    <div>
      <h1>상품 목록</h1>
      {message && <p>{message}</p>}

      <div>
        <label>
          카테고리 선택:
          <select
            value={selectedCategory !== null ? selectedCategory : ''}
            onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">모든 상품</option>
            {categories.length > 0 ? (
              categories.map((category) => (
                <option key={category.catenum} value={category.catenum}>
                  {category.catename}
                </option>
              ))
            ) : (
              <option value="" disabled>카테고리가 없습니다.</option>
            )}
          </select>
        </label>
      </div>

      <ul>
        {filteredProducts.map((product) => (
          <li key={product.pNum}>
            <img src={product.pImgUrl} alt={product.pName} style={{ width: '100px', height: '100px' }} />
            {product.pName} - {product.pPrice} 원 - 재고: {product.pCount}개 - 카테고리: {getCategoryName(product.pcate)}
            <img src={product.pDetailImgUrl} alt={`${product.pName} 상세`} style={{ width: '100px', height: '100px' }} />
            <button onClick={() => handleEditProduct(product)}>수정</button>
            <button onClick={() => handleDeleteProduct(product.pNum)}>삭제</button>
          </li>
        ))}
      </ul>

      <h2>{editingProduct ? '상품 수정' : '상품 등록'}</h2>
      <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}>
        <label>
          상품명:
          <input
            type="text"
            placeholder="상품명"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            required
          />
        </label>
        <label>
          가격:
          <input
            type="number"
            placeholder="가격"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            required
          />
        </label>
        <label>
          이미지 업로드:
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </label>
        <label>
          상세 이미지 업로드:
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setDetailImageFile(e.target.files[0])}
          />
        </label>
        <label>
          재고 수량:
          <input
            type="number"
            placeholder="재고 수량"
            value={newProduct.count}
            onChange={(e) => setNewProduct({ ...newProduct, count: e.target.value })}
            required
          />
        </label>
        <label>
          카테고리 선택:
          <select
            value={newProduct.pcate !== null ? newProduct.pcate : ''}
            onChange={(e) => setNewProduct({ ...newProduct, pcate: e.target.value ? Number(e.target.value) : null })}
            required
          >
            <option value="">카테고리 선택</option>
            {categories.length > 0 ? (
              categories.map((category) => (
                <option key={category.catenum} value={category.catenum}>
                  {category.catename}
                </option>
              ))
            ) : (
              <option value="" disabled>카테고리가 없습니다.</option>
            )}
          </select>
        </label>
        <button type="submit">{editingProduct ? '수정하기' : '등록하기'}</button>
      </form>
    </div>
  );
};

export default Shop;
