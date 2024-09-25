import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const PaymentSuccess = () => {
    const location = useLocation();
    const { orderName, totalAmount } = location.state || {};

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