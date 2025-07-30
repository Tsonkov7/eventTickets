import React from "react";
import { useSelector } from "react-redux";
import { amountInCart } from "../features/CartSlice";
import { FaShoppingCart } from "react-icons/fa";

const CartIcon: React.FC = () => {
  const totalItems = useSelector(amountInCart);

  return (
    <div className="relative">
      <FaShoppingCart className="text-xl sm:text-2xl lg:text-3xl" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-600 text-white text-xs sm:text-sm font-bold px-1 py-0.5 sm:px-1.5 sm:py-0.5 rounded-full min-w-[1rem] sm:min-w-[1.25rem] flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </div>
  );
};

export default CartIcon;
