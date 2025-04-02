import React from 'react';

const Footer = () => {
    return (
        <footer style={{ textAlign: 'center', background: '#f1f1f1', position: 'fixed', width: '100%', bottom: 0, zIndex:10000 }}>
            <p>&copy; {new Date().getFullYear()} BinGo. All rights reserved.</p>
        </footer>
    );
};

export default Footer;