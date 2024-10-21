import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Bell, MessageCircle, Package, ShoppingCart, User } from 'react-feather';
import './FloatingMenu.css';

function FloatingMenu() {
    const [bottomOffset, setBottomOffset] = useState('5%');

    useEffect(() => {
        const handleScroll = () => {
            const footer = document.querySelector('footer');
            if (footer) { // footer 요소가 존재하는지 확인
                const footerRect = footer.getBoundingClientRect();
                if (footerRect.top < window.innerHeight) {
                    setBottomOffset(`${window.innerHeight - footerRect.top + 16}px`);
                } else {
                    setBottomOffset('5%');
                }
            } else {
                setBottomOffset('5%');
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <nav className="float-menu" style={{ bottom: bottomOffset }}>
            <ul>
                <li>
                    <NavLink to="/#" activeclassname="active">
                        <MessageCircle />
                        <span>커뮤니티</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/" activeclassname="active">
                        <Bell />
                        <span>알림</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/cart" activeclassname="active">
                        <ShoppingCart />
                        <span>장바구니</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/order-history" activeclassname="active">
                        <Package />
                        <span>주문내역</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/mypage" activeclassname="active">
                        <User />
                        <span>내정보</span>
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}

export default FloatingMenu;
