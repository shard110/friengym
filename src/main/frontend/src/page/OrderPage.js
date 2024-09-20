import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../components/AuthContext';
import * as PortOne from "@portone/browser-sdk/v2";

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
            <button>구매하기</button>
        </div>
    );
};

export default OrderPage;
