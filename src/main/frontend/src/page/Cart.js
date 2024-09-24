import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import './Cart.css';

const Cart = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        if (!user) {
            navigate('/login'); // 로그인되지 않은 경우 로그인 페이지로 이동
            return;
        }

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
                        'Authorization': `${token}`
                    }
                });
                setCartItems(response.data);
            } catch (error) {
                console.error('장바구니 아이템을 불러오는 동안 오류 발생:', error);
            }
        };

        fetchCartItems();
    }, [user, navigate]);

    const updateCartItemCount = async (cnum, newCount) => {
        const token = user?.token || localStorage.getItem('jwtToken');
        if (!token) {
            console.error('토큰을 찾을 수 없습니다.');
            return;
        }

        try {
            await axios.put(`/api/cart/${cnum}`, { cCount: newCount }, {
                headers: {
                    'Authorization': `${token}`
                }
            });
            setCartItems(cartItems.map(item => item.cnum === cnum ? { ...item, cCount: newCount } : item));
        } catch (error) {
            console.error('장바구니 아이템 수량 변경 중 오류 발생:', error);
        }
    };

    const removeCartItem = async (cnum) => {
        const token = user?.token || localStorage.getItem('jwtToken');
        if (!token) {
            console.error('토큰을 찾을 수 없습니다.');
            return;
        }

        try {
            await axios.delete(`/api/cart/${cnum}`, {
                headers: {
                    'Authorization': `${token}`
                }
            });
            setCartItems(cartItems.filter(item => item.cnum !== cnum));
        } catch (error) {
            console.error('장바구니 아이템 삭제 중 오류 발생:', error);
        }
    };

    const handleBuyNow = () => {
        navigate('/order');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="cart">
            <h2>장바구니</h2>
            {Array.isArray(cartItems) && cartItems.length === 0 ? (
                <p>장바구니가 비어 있습니다.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>이미지</th>
                            <th>상품명</th>
                            <th>가격</th>
                            <th>수량</th>
                            <th>합계</th>
                            <th>삭제</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(cartItems) && cartItems.map(item => (
                            <tr key={item.cnum}>
                                <td>
                                    <Link to={`/productslist/${item.product.pNum}`}>
                                        <img src={item.product.pImgUrl} alt={item.product.pName} className="cart-img" />
                                    </Link>
                                </td>
                                <td>
                                    <Link to={`/productslist/${item.product.pNum}`}>
                                        {item.product.pName}
                                    </Link>
                                </td>
                                <td>{item.product.pPrice.toLocaleString()}원</td>
                                <td>
                                    <button onClick={() => updateCartItemCount(item.cnum, item.cCount - 1)} disabled={item.cCount <= 1}>-</button>
                                    {item.cCount}
                                    <button onClick={() => updateCartItemCount(item.cnum, item.cCount + 1)}>+</button>
                                </td>
                                <td>{(item.product.pPrice * item.cCount).toLocaleString()}원</td>
                                <td>
                                    <button className='btn_del' onClick={() => removeCartItem(item.cnum)}>삭제</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <button onClick={handleBuyNow}>구매하기</button>
        </div>
    );
};

export default Cart;
