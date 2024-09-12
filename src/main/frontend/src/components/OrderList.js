import axios from 'axios';
import React, { useEffect, useState } from 'react';

function OrderList() {
    const [orders, setOrders] = useState([]);

    // 주문 목록을 서버에서 가져오기
    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:8080/admin/orders');
            setOrders(response.data);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        }
    };

    return (
        <div>
            <h1>주문 목록</h1>
            <table>
                <thead>
                    <tr>
                        <th>주문 번호</th>
                        <th>주문 날짜</th>
                        <th>사용자 ID</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.onum}>
                            <td>{order.onum}</td>
                            <td>{new Date(order.oDate).toLocaleDateString()}</td>
                            <td>{order.user.id}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default OrderList;
