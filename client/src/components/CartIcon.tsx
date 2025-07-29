import React from "react";
import { useSelector } from "react-redux";
import { amountInCart } from "../features/CartSlice";
import { FaShoppingCart } from "react-icons/fa";

const CartIcon: React.FC = () => {
  const totalItems = useSelector(amountInCart);

  return (
    <div className="relative">
      <FaShoppingCart className="text-2xl" />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
          {totalItems}
        </span>
      )}
    </div>
  );
};

export default CartIcon;
