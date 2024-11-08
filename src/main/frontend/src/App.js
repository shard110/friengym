import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import NavBar from './components/NavBar'; // NavBar 컴포넌트 임포트

import CategoryProductsPage from './components/CategoryProductsPage';
import Chat from './components/Chat';  //Chat
import DirectMessage from './components/DirectMessage'; // DirectMessage 컴포넌트 추가
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
import AskPage from './page/AskPage';
import Cart from './page/Cart';
import FollowerList from './page/FollowerList';
import FollowingList from './page/FollowingList';
import Gallery from './page/Gallery'; // 게시물 갤러리 컴포넌트 임포트
import LikedPostsPage from "./page/LikedPostsPage";
import MastersList from './page/MastersList';
import Mypostpage from './page/Mypostpage';
import OrderHistoryPage from './page/OrderHistoryPage';
import OrderPage from './page/OrderPage';
import PaymentSuccess from './page/PaymentSuccess';
import PostDetail from './page/PostDetail';
import ProductDetail from './page/ProductDetail';
import ProductList from './page/ProductList';
import QnaPage from './page/QnaPage';
import Recommendations from './page/Recommendations'; // 새로운 추천 페이지 임포트
import ReviewPage from './page/ReviewPage';
import UserPostPage from './page/UserPostPage';

//ChatPage추가
import ChatPage from "./page/ChatPage"; 

//관리자용 import
import AdminHome from './admin/AdminHome';
//아이디 찾기
import FindIdPage from './components/FindIdPage'; 

//고객
import CreateAsk from './components/CreateAsk'; // 경로에 맞게 수정
import UpdateAsk from './components/UpdateAsk';
import ViewAsk from './components/ViewAsk';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          {/* <NavBar /> NavBar 컴포넌트 추가 */}
          <Routes>
            <Route path="/chat" element={<Chat />} /> {/* Chat 라우트 추가 */}
            <Route path="/chat/:userId" element={<DirectMessage />} /> {/* DirectMessage 라우트 추가 */}
            <Route path="/" element={<HomePage />} />
            <Route path="/posts" element={<Gallery />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/posts/:poNum" element={<PostDetail />} />
            <Route path="/edit-post/:poNum" element={<EditPost />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/hashtag/:tag" element={<HashtagPosts />} />
            <Route path="/post-search" element={<PostSearch />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/users/:id" element={<UserPostPage />} />
            <Route path="/liked-posts" element={<LikedPostsPage />} />


            <Route path="/products" element={<ProductHome />} />
            <Route path="/categories/:catenum" element={<CategoryProductsPage />} />
            <Route path="/products/popular" element={<PopularProductsPage />} />
            <Route path="/products/new" element={<NewProducts />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/productslist/:pNum" element={<ProductDetail />} />
            <Route path="/productslist" element={<ProductList />} />
            <Route path="/reviews" element={<ReviewPage />} />
            <Route path="/order" element={<OrderPage />} />
            <Route path="/order-history" element={<OrderHistoryPage />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />

            <Route path="/masters" element={<MastersList />} />
       
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/mypage" element={<Mypage />} />
            <Route path="/totalmypage" element={<Mypostpage />} />
            <Route path="/edit-profile" element={<EditProfilePage />} />
            <Route path="/following" element={<FollowingList />} />
            <Route path="/followers" element={<FollowerList />} />

            <Route path="/qna" element={<QnaPage />} />
            <Route path="/asks/update/:anum" element={<UpdateAsk />} />
            <Route path="/customer" element={<Customer />} />

            <Route path="/createa" element={<CreateAsk onAskCreated={() => {/* Refresh Logic */}} />} />
            <Route path="/asks" element={<AskPage />} />
            <Route path="/asks/view/:anum" element={<ViewAsk />} /> 

            {/* 관리자용 */}
            <Route path="/adminHome/*" element={<AdminHome />} />


          {/*아이디 찾기 */}
          <Route path="/find-id" element={<FindIdPage />} />
          {/*ChatPage 추가 */}
          <Route path="/chat/:senderId/:recipientId" element={<ChatPage />} /> {/* 새로 추가된 라우트 */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}
