import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../components/AuthContext';
import { Link } from 'react-router-dom';
import './OrderHistoryPage.css'; // CSS 파일을 import 합니다.
import ShopLnb from '../components/ShopLnb';
import FloatingMenu from '../components/FloatingMenu';
import replace from "../img/product_replace.png";
import Navbar from '../components/NavBar';

const OrderHistoryPage = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            const token = user?.token || localStorage.getItem('jwtToken');
            if (!token) {
                console.error('토큰을 찾을 수 없습니다.');
                alert('로그인이 필요합니다.');
                return;
            }

            try {
                const response = await axios.get(`/api/payment/orders/${user.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setOrders(response.data);
            } catch (error) {
                console.error('주문 내역을 불러오는 동안 오류 발생:', error);
            }
        };

        if (user) {
            fetchOrders();
        }
    }, [user]);
    
    const onErrorImg = (e) => {
        e.target.src = replace;
      };

    return (
        <div className="order-history">
            <Navbar />
            <ShopLnb />
            <FloatingMenu />
            <div className='order-wrap'>
            <h2>결제 내역</h2>
            <table>
                <thead>
                    <tr>
                        <th>주문 번호</th>
                        <th>상품 이미지</th>
                        <th>상품명</th>
                        <th>수량</th>
                        <th>상태</th>
                        <th>결제 날짜</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(orders) && orders.map(order => (
                        <React.Fragment key={order.onum}>
                            {order.dorders.map((dorder, index) => (
                                <tr key={dorder.doNum}>
                                    {index === 0 && (
                                        <td rowSpan={order.dorders.length}>{order.onum}</td>
                                    )}
                                    <td>
                                        <Link to={`/productslist/${dorder.product.pNum}`}>
                                            <img src={dorder.product.pImgUrl} alt={dorder.product.pName} className="cart-img" onError={onErrorImg}/>
                                        </Link>
                                    </td>
                                    <td>{dorder.product.pName}</td>
                                    <td>{dorder.doCount}개</td>
                                    {index === 0 && (
                                        <>
                                            <td rowSpan={order.dorders.length}>{order.status}</td>
                                            <td rowSpan={order.dorders.length}>{new Date(order.odate).toLocaleString()}</td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
            </div>
        </div>
    );
};

export default OrderHistoryPage;
