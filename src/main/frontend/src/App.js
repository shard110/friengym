import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import NavBar from './components/NavBar'; // NavBar 컴포넌트 임포트

import CategoryProductsPage from './components/CategoryProductsPage';
import CreatePost from "./components/CreatePostForm";
import Customer from './components/Customer';
import EditPost from './components/EditPost';
import EditProfilePage from './components/EditProfilePage';
import HashtagPosts from './components/HashtagPosts';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import Mypage from './components/Mypage';
import NewProducts from './components/NewProducts';
import Notifications from './components/Notification';
import PopularProductsPage from './components/PopularProductsPage';
import PostSearch from './components/PostSearch';
import ProductHome from './components/ProductHome';
import RegisterPage from './components/RegisterPage';
import UpdateAsk from './components/UpdateAsk';
import ViewAsk from './components/ViewAsk';
import AskPage from './page/AskPage';
import Cart from './page/Cart';
import Gallery from './page/Gallery'; // 게시물 갤러리 컴포넌트 임포트
import MastersList from './page/MastersList';
import Mypostpage from './page/Mypostpage';
import PostDetail from './page/PostDetail';
import ProductDetail from './page/ProductDetail';
import ProductList from './page/ProductList';
import QnaPage from './page/QnaPage';
import Recommendations from './page/Recommendations'; // 새로운 추천 페이지 임포트
import ReviewPage from './page/ReviewPage';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <NavBar /> {/* NavBar 컴포넌트 추가 */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/posts" element={<Gallery />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/posts/:poNum" element={<PostDetail />} />
            <Route path="/edit-post/:poNum" element={<EditPost />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/hashtag/:tag" element={<HashtagPosts />} />
            <Route path="/post-search" element={<PostSearch />} />
            <Route path="/notifications" element={<Notifications />} />


            <Route path="/products" element={<ProductHome />} />
            <Route path="/categories/:catenum" element={<CategoryProductsPage />} />
            <Route path="/products/popular" element={<PopularProductsPage />} />
            <Route path="/products/new" element={<NewProducts />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/productslist/:pNum" element={<ProductDetail />} />
            <Route path="/productslist" element={<ProductList />} />
            <Route path="/reviews" element={<ReviewPage />} />

            <Route path="/masters" element={<MastersList />} />
       
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/mypage" element={<Mypage />} />
            <Route path="/totalmypage" element={<Mypostpage />} />
            <Route path="/edit-profile" element={<EditProfilePage />} />
      
            <Route path="/qna" element={<QnaPage />} />
            <Route path="/asks" element={<AskPage />} />
            <Route path="/asks/view/:anum" element={<ViewAsk />} />
            <Route path="/asks/update/:anum" element={<UpdateAsk />} />
            <Route path="/customer" element={<Customer />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}
