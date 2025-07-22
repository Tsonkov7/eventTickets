import React from 'react';
import Cart from '../components/Cart';
import Header from '../components/Header';

const CheckOut: React.FC = () => {
    return (
        <div>
            <Header />
            <h1>Checkout</h1>
            <Cart />
        </div>
    );
};

export default CheckOut;