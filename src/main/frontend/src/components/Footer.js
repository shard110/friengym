import React from 'react';
import './Footer.css'; 

const Footer = () => {
    return (
        <footer className="footer">
            <div className='footer-wrap'>
                <span className="footer-copy">
                    © 2024 FRIENGYM. All Rights Reserved.
                </span>
                <p></p>
                <span className="footer-tel">
                    Tel. 000-000-0000
                </span>
                <p></p>
                <span className="footer-policy">
                    개인정보처리방침
                </span>
            </div>
        </footer>
    );
};

export default Footer;
