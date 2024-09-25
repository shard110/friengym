import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../components/AuthContext';
import PortOne from "@portone/browser-sdk/v2";

//import './OrderPage.css';

const OrderPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        const fetchCartItems = async () => {
            const token = user?.token || localStorage.getItem('jwtToken');
            if (!token) {
                console.error('토큰을 찾을 수 없습니다.');
                alert('로그인이 필요합니다.');
                return;
            }

            try {
                const response = await axios.get(`/api/cart/${user.id}`, {
                    headers: {
                        'Authorization': `${token}` // 요청 헤더에 JWT 토큰 추가
                    }
                });
                setCartItems(response.data);
                const total = response.data.reduce((acc, item) => acc + item.product.pPrice * item.cCount, 0);
                setTotalPrice(total);
            } catch (error) {
                console.error('장바구니 아이템을 불러오는 동안 오류 발생:', error);
            }
        };

        if (user) {
            fetchCartItems();
        }
    }, [user]);

    async function handlePaymentToss() {
        const customer = {
            phoneNumber: user.phone,
            fullName: user.name,
        };

        const orderName = cartItems.map(item => item.product.pName).join(', ');
        const paymentId = `payment-${crypto.randomUUID()}`;
        const totalAmount = cartItems.reduce((total, item) => total + item.product.pPrice * item.cCount, 0);

        const response = await PortOne.requestPayment({
            storeId: process.env.REACT_APP_PORTONE_STORE_ID,
            channelKey: process.env.REACT_APP_PORTONE_TOSS,
            paymentId: paymentId,
            orderName: orderName,
            totalAmount: totalAmount,
            currency: "CURRENCY_KRW",
            payMethod: "CARD",
            customer: customer,
        });

        if (response.code != null) {
            console.error('결제 요청 중 오류 발생');
            return alert(response.message);
        } else{
            const notified = await fetch("/payment/complete",{
                method: "POST",
                headers: { "Content-Type": "application/json" },
                // paymentId와 주문 정보를 서버에 전달합니다
                body: JSON.stringify({
                    storeId: process.env.REACT_APP_PORTONE_STORE_ID,
                    channelKey: process.env.REACT_APP_PORTONE_TOSS,
                    paymentId: paymentId,
                    orderName: orderName,
                    totalAmount: cartItems.reduce((total, item) => total + item.product.pPrice * item.cCount, 0),
                    currency: "CURRENCY_KRW",
                    payMethod: "CARD",
                    customer: customer,
                }),
            });
            console.log('결제 성공: ', response);
            navigate('/payment-success', {state: {
                orderName: orderName,
                totalAmount: totalAmount,
            }}); 
        }        
    };

    const handlePaymentPayco = async () => {
        const customer = {
            phoneNumber: user.phone,
            fullName: user.name,
        };

        const orderName = cartItems.map(item => item.product.pName).join(', ');

        try {
            const response = await PortOne.requestPayment({
                storeId: process.env.REACT_APP_PORTONE_STORE_ID,
                paymentId: `payment-${crypto.randomUUID()}`,
                orderName: orderName,
                totalAmount: cartItems.reduce((total, item) => total + item.product.pPrice * item.cCount, 0),
                currency: "CURRENCY_KRW",
                payMethod: "EASY_PAY",
                channelKey: process.env.REACT_APP_PORTONE_TOSS,
                customer: customer,
                easyPay: {
                    easyPayProvider: "PAYCO",
                },
            });
    
            if (response.code != null) {
                alert(response.message);
            } else {
                console.log('결제 성공:', response);
            }
        } catch (error) {
            console.error('결제 요청 중 오류 발생:', error);
            alert('결제 요청 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    };

    const handlePaymentToss2 = async () => {
        const customer = {
            phoneNumber: user.phone,
            fullName: user.name,
        };

        const orderName = cartItems.map(item => item.product.pName).join(', ');

        try {
            const response = await PortOne.requestPayment({
                storeId: process.env.REACT_APP_PORTONE_STORE_ID,
                channelKey: process.env.REACT_APP_PORTONE_TOSS,
                paymentId: `payment-${crypto.randomUUID()}`,
                orderName: orderName,
                totalAmount: cartItems.reduce((total, item) => total + item.product.pPrice * item.cCount, 0),
                currency: "CURRENCY_KRW",
                payMethod: "CARD",
                customer: customer,
            });

            if (response.code != null) {
                alert(response.message);
            } else {
                console.log('결제 성공:', response);
            }
        } catch (error) {
            console.error('결제 요청 중 오류 발생:', error);
            alert('결제 요청 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    };

    const handlePaymentKG = async () => {
        const customer = {
            email: "test@gmail.com",    // to-do user테이블에 메일 추가해야 함
            phoneNumber: user.phone,
            fullName: user.name,
        };

        const orderName = cartItems.map(item => item.product.pName).join(', ');

        try {
            const response = await PortOne.requestPayment({
                storeId: process.env.REACT_APP_PORTONE_STORE_ID,
                channelKey: process.env.REACT_APP_PORTONE_KG,
                paymentId: `${crypto.randomUUID()}`,    // uuid 수정
                orderName: orderName,
                totalAmount: cartItems.reduce((total, item) => total + item.product.pPrice * item.cCount, 0),
                currency: "CURRENCY_KRW",
                payMethod: "CARD",
                customer: customer,
            });

            if (response.code != null) {
                alert(response.message);
            } else {
                console.log('결제 성공:', response);
            }
        } catch (error) {
            console.error('결제 요청 중 오류 발생:', error);
            alert('결제 요청 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    };

    return (
        <div className="cart">
            <h2>주문서</h2>
            <h2>배송지</h2>
            <div>
                <p>{user.name}</p>
                <p>{user.phone}</p>
            </div>
                <table>
                    <thead>
                        <tr>
                            <th>이미지</th>
                            <th>상품명</th>
                            <th>가격</th>
                            <th>수량</th>
                            <th>합계</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(cartItems) && cartItems.map(item => (
                            <tr key={item.cnum}>
                                <td>
                                        <img src={item.product.pImgUrl} alt={item.product.pName} className="cart-img" />

                                </td>
                                <td>

                                        {item.product.pName}

                                </td>
                                <td>{item.product.pPrice.toLocaleString()}원</td>
                                <td>
                                    {item.cCount}
                                </td>
                                <td>{(item.product.pPrice * item.cCount).toLocaleString()}원</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={5}>총계</td>
                        </tr>
                        <tr>
                            <td colSpan={5}>{totalPrice.toLocaleString()} 원</td>
                        </tr>
                    </tfoot>
                </table>

            <h2>결제수단</h2>
            <p>신용카드</p>
            <p>무통장입금</p>
            <p>만나서 결제</p>
            <button onClick={handlePaymentToss}>토스페이</button>
            <button onClick={handlePaymentPayco}>페이코 간편결제</button>
            <button onClick={handlePaymentKG}>신용카드 결제</button>
        </div>
    );
};

export default OrderPage;
