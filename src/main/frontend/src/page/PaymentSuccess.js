import React, { useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../components/AuthContext';

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
            <h1>결제가 완료되었습니다</h1>
            <div style={{textAlign:'center'}}>
                <p>주문명: {orderName}</p>
                <p>총 결제 금액: {totalAmount.toLocaleString()}원</p>
                <p>주문해주셔서 감사합니다.</p>
                <br/>
                <Link to="/">홈으로 돌아가기</Link>
                <Link to="/products">쇼핑을 계속하기</Link>
            </div>
        </div>
    );
};

export default PaymentSuccess;
