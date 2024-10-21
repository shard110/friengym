import React, { useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../components/AuthContext';
import { ShoppingBag } from 'react-feather';
import Navbar from '../components/NavBar';
import ShopLnb from '../components/ShopLnb';
import FloatingMenu from '../components/FloatingMenu';
import Footer from '../components/Footer';
import  './PaymentSuccess.css';

const PaymentSuccess = () => {
    const location = useLocation();
    const { orderName, totalAmount } = location.state || {};
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const clearCart = async () => {
            const token = user?.token || localStorage.getItem('jwtToken');
            if (!token) {
                console.error('토큰을 찾을 수 없습니다.');
                return;
            }

            try {
                await axios.post('/api/payment/complete', { userId: user.id }, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log('장바구니가 비워졌습니다.');
            } catch (error) {
                console.error('장바구니를 비우는 동안 오류 발생:', error);
            }
        };

        if (user) {
            clearCart();
        }
    }, [user]);

    return (
        <div className="payment-success">
            <Navbar />
            <ShopLnb />
            <div className='flex-wrap'>
                <h2>결제가 완료되었습니다.</h2>
                <ShoppingBag color="#ddd" strokeWidth={"1.5"}  size={"160"}/>
                    <p>주문 상품: <span>{orderName}</span></p>
                    <p>총 결제 금액: <span>{totalAmount.toLocaleString()}원<span/></span></p>
                    <p>주문해주셔서 감사합니다.</p>
                    <div className="btn-wrap">
                        <Link to="/products"><span>쇼핑홈</span></Link>
                        <Link to="/order-history"><span>주문 내역</span></Link>
                    </div>
            </div>
            <Footer />
        </div>
    );
};

export default PaymentSuccess;
