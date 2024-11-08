import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../components/AuthContext';
import { Link } from 'react-router-dom';
import './ListStyles.css';

const OrderHistoryPage = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            const token = user?.token || localStorage.getItem('adminToken');
            if (!token) {
                console.error('토큰을 찾을 수 없습니다.');
                alert('로그인이 필요합니다.');
                return;
            }

            try {
                const response = await axios.get(`/api/payment/orders`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setOrders(response.data);
            } catch (error) {
                console.error('주문 내역을 불러오는 동안 오류 발생:', error);
            }
        };

          fetchOrders();
    }, [user]);

    return (
        <div>
            <h2>결제 내역</h2>
            <table className="common-table">
                <thead>
                    <tr>
                        <th>주문 번호</th>
                        <th>상품 이미지</th>
                        <th>상품명</th>
                        <th>수량</th>
                        <th>상태</th>
                        <th>결제 날짜</th>
                        <th>결제 아이디</th>
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
                                            <img src={dorder.product.pImgUrl} alt={dorder.product.pName} className="cart-img" />
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
                                    <td>{order.id}</td>
                                </tr>
                            ))}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrderHistoryPage;