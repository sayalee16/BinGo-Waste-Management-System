import React from 'react';

const Footer = () => {
    return (
        <footer style={{ textAlign: 'center', padding: '1rem', background: '#f1f1f1' }}>
            <p>&copy; {new Date().getFullYear()} BinGo. All rights reserved.</p>
        </footer>
    );
};

export default Footer;