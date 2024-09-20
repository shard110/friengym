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

    const handlePayment = async () => {
        try {
            const response = await axios.post('/api/payment/request', {
                amount: totalPrice,
                orderId: `order_${new Date().getTime()}`,
                // 기타 결제 정보 추가
            });
            const paymentResponse = response.data;

            const portone = new PortOne('your_api_key'); // 포트원 API 키를 입력하세요

            portone.requestPayment({
                amount: totalPrice,
                order_id: `order_${new Date().getTime()}`, // 고유한 주문 ID 생성
                // 기타 결제 정보 추가
            }, (response) => {
                if (response.success) {
                    // 결제 성공 처리
                    alert('결제가 성공적으로 완료되었습니다.');
                    navigate('/order-success'); // 결제 성공 페이지로 이동
                } else {
                    // 결제 실패 처리
                    alert(`결제 실패: ${response.error_msg}`);
                }
            });
        } catch (error) {
            console.error('결제 요청 중 오류 발생:', error);
            alert('결제 요청 중 오류가 발생했습니다.');
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
            <button onClick={handlePayment}>구매하기</button>
        </div>
    );
};

export default OrderPage;
