import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import './Cart.css';
import ShopLnb from '../components/ShopLnb';
import FloatingMenu from '../components/FloatingMenu';
import replace from "../img/product_replace.png";
import { Loader, Minus, Plus, Trash2, Truck } from 'react-feather';
import Navbar from '../components/NavBar';


const Cart = () => {
    const { user, loading:authLoading } = useAuth();
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);  // 페이지 로딩 상태

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
                setLoading(false);
                return;
            }

            try {
                console.log("토큰 확인", `${token}`);
                const response = await axios.get(`/api/cart/${user.user.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
                console.log('카트 아이템:', response.data); // 로그 추가
                setCartItems(response.data);
            } catch (error) {
                console.error('장바구니 아이템을 불러오는 동안 오류 발생:', error);
                if (error.response) {
                    // 서버가 응답을 보낸 경우
                    console.error('응답 데이터:', error.response.data);
                    console.error('응답 상태:', error.response.status);
                    console.error('응답 헤더:', error.response.headers);
                } else if (error.request) {
                    // 요청이 전송되었으나 응답을 받지 못한 경우
                    console.error('요청 데이터:', error.request);
                } else {
                    // 오류가 발생한 요청 설정
                    console.error('오류 메시지:', error.message);
                }
            } finally {
                setLoading(false);  // 로딩 상태를 false로 설정
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

    const onErrorImg = (e) => {
        e.target.src = replace;
      };

    const calculateTotalPrice = () => {
        return cartItems.reduce((total, item) => total + item.product.pPrice * item.cCount, 0).toLocaleString();
    }

    return (
        <div className="cart">
            <Navbar />
            <ShopLnb/>
            <FloatingMenu />
            <div className='cart-wrap'>
            <h2>장바구니</h2>
            {Array.isArray(cartItems) && cartItems.length === 0 ? (
                <div className='cart-empty'><Loader color="#ddd" strokeWidth={"1.5"} stroke-linecap="none" size={"160"}/><br /><span>장바구니가 비어 있습니다.</span></div>
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
                                        <img src={item.product.pImgUrl} alt={item.product.pName} className="cart-img" onError={onErrorImg}/>
                                    </Link>
                                </td>
                                <td>
                                    <Link to={`/productslist/${item.product.pNum}`}>
                                        {item.product.pName}
                                    </Link>
                                </td>
                                <td>{item.product.pPrice.toLocaleString()}원</td>
                                <td>
                                    <button onClick={() => updateCartItemCount(item.cnum, item.cCount - 1)} disabled={item.cCount <= 1}><Minus /></button>
                                    {item.cCount}
                                    <button onClick={() => updateCartItemCount(item.cnum, item.cCount + 1)}><Plus /></button>
                                </td>
                                <td>{(item.product.pPrice * item.cCount).toLocaleString()}원</td>
                                <td>
                                    <button className='btn_del' onClick={() => removeCartItem(item.cnum)}><Trash2 /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <div className='buy'>
                <span>총 결제 금액: <span>{calculateTotalPrice()}원</span></span>
                <button onClick={handleBuyNow}>결제하기 <Truck /></button>
            </div>
            </div>
        </div>
    );
};

export default Cart;
