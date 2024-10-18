import { NavLink } from 'react-router-dom';
import './FloatingMenu.css';
import { Bell, MessageCircle, Package, ShoppingCart, User } from 'react-feather';

function FloatingMenu() {
    return (
        <nav className="float-menu">
                <ul>
                    <li><NavLink to="/#" activeclassname='active'>
                        <MessageCircle />
                        <span>커뮤니티</span>
                    </NavLink></li>
                    {/* <li><NavLink to="/" activeclassname='active'>
                        <Bell />
                        <span>알림</span>
                    </NavLink></li> */}
                    <li><NavLink to="/cart" activeclassname='active'>
                        <ShoppingCart />
                        <span>장바구니</span>
                    </NavLink></li>
                    <li><NavLink to="/order-history" activeclassname='active'>
                        <Package />
                        <span>주문내역</span>
                    </NavLink></li>
                    <li><NavLink to="/mypage" activeclassname='active'>
                        <User />
                        <span>내정보</span>
                    </NavLink></li>
                </ul>
        </nav>
    );
}

export default FloatingMenu;
