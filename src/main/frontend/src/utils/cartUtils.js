// utils/cartUtils.js
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export const addToCart = async (product) => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        console.error('토큰을 찾을 수 없습니다.');
        alert("로그인이 필요합니다.");
        return;
    }

    console.log('토큰:', token); // 토큰 확인용 콘솔 로그 추가

    try {
        // 토큰 형식 검사
        if (token.split('.').length !== 3) {
            throw new Error('유효하지 않은 토큰 형식입니다.');
        }

        const decodedToken = jwtDecode(token);
        console.log('디코딩된 토큰:', decodedToken);
        const userId = decodedToken.sub;
        console.log('userId:', userId);

        const cartItem = {
            product: product,
            cCount: 1, // 기본 수량 1
            user: { id: userId }
        };

        axios.post('/api/cart', cartItem, {
            headers: {
                'Authorization': `${token}` // Bearer 추가 시 오류
            }
        })
        .then(response => {
            console.log('아이템이 장바구니에 추가됨:', response.data);
            alert('장바구니에 상품이 추가되었습니다.');
        })
        .catch(error => console.error('장바구니에 상품 추가 오류:', error));
    } catch (error) {
        console.error('토큰 오류:', error);
    }
};
