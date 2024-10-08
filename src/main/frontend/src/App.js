import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import NavBar from './components/NavBar'; // NavBar 컴포넌트 임포트

import CategoryProductsPage from './components/CategoryProductsPage';
import CommentCreate from './components/CommentCreate';
import CommentEdit from './components/CommentEdit';
import CommentList from './components/CommentList';
import CreatePost from "./components/CreatePost";
import Customer from './components/Customer';
import EditPost from './components/EditPost';
import EditProfilePage from './components/EditProfilePage';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import Mypage from './components/Mypage';
import NewProducts from './components/NewProducts';
import PopularProductsPage from './components/PopularProductsPage';
import PostDetail from './components/PostDetail';
import PostsList from './components/PostsList';
import ProductHome from './components/ProductHome';
import RegisterPage from './components/RegisterPage';
import UpdateAsk from './components/UpdateAsk';
import ViewAsk from './components/ViewAsk';
import Chat from './components/Chat'; //Chat 컴포넌트 임포트
import AskPage from './page/AskPage';
import Board from './page/Board';
import Cart from './page/Cart';
import MastersList from './page/MastersList';
import ProductDetail from './page/ProductDetail';
import ProductList from './page/ProductList';
import QnaPage from './page/QnaPage';
import ReviewPage from './page/ReviewPage';
import OrderPage from './page/OrderPage';
import PaymentSuccess from './page/PaymentSuccess';
import OrderHistoryPage from './page/OrderHistoryPage';

//관리자용 import
import AdminHome from './admin/AdminHome';


export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          {/* <NavBar /> NavBar 컴포넌트 추가 */}
          <Routes>
            <Route path="/chat" element={<Chat />} /> {/* Chat 라우트 추가 */}
            <Route path="/" element={<HomePage />} />
            <Route path="/posts" element={<PostsList />} />
            <Route path="/products" element={<ProductHome />} />
            <Route path="/categories/:catenum" element={<CategoryProductsPage />} />
            <Route path="/products/popular" element={<PopularProductsPage />} />
            <Route path="/products/new" element={<NewProducts />} />
            <Route path="/masters" element={<MastersList />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/board" element={<Board />} />
            <Route path="/productslist/:pNum" element={<ProductDetail />} />
            <Route path="/productslist" element={<ProductList />} />
            <Route path="/post/:poNum" element={<PostDetail />} />
            <Route path="/order" element={<OrderPage />} />
            <Route path="/order-history" element={<OrderHistoryPage />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/edit/:poNum" element={<EditPost />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/mypage" element={<Mypage />} />
            <Route path="/edit-profile" element={<EditProfilePage />} />
            <Route path="/post/:poNum/comments" element={<CommentList />} />
            <Route path="/post/:poNum/comments/create" element={<CommentCreate />} />
            <Route path="/post/:poNum/comments/:commentNo/edit" element={<CommentEdit />} />
            <Route path="/qna" element={<QnaPage />} />
            <Route path="/asks" element={<AskPage />} />
            <Route path="/asks/view/:anum" element={<ViewAsk />} />
            <Route path="/asks/update/:anum" element={<UpdateAsk />} />
            <Route path="/reviews" element={<ReviewPage />} />
            <Route path="/customer" element={<Customer />} />

            {/* 관리자용 */}
            <Route path="/adminHome/*" element={<AdminHome />} />

          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}
