import React from "react";
import Cart from "../components/Cart";
import Header from "../components/Header";

const CheckOut: React.FC = () => {
  return (
    <div>
      <Header />
      <h1 className="text-3xl font-bold text-center my-6">Checkout</h1>
      <Cart />
    </div>
  );
};

export default CheckOut;
