import React from "react";
import { FaTrash } from "react-icons/fa";
import { useAppSelector, useAppDispatch } from "../features/store.hooks";
import {
  selectCart,
  selectTotalPrice,
  incrementQuantity,
  decrementQuantity,
  removeItem,
  clearCart,
} from "../features/CartSlice";
import type { CartItem } from "../features/CartSlice";
import { purchaseTickets } from "../features/EventSlice";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Cart: React.FC = () => {
  const cartItems = useAppSelector(selectCart);
  const totalPrice = useAppSelector(selectTotalPrice);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleIncrement = (item: CartItem) => {
    dispatch(
      incrementQuantity({ eventId: item.eventId, ticketType: item.ticketType })
    );
  };

  const handleDecrement = (item: CartItem) => {
    dispatch(
      decrementQuantity({ eventId: item.eventId, ticketType: item.ticketType })
    );
  };

  const handleRemove = (item: CartItem) => {
    if (
      window.confirm(
        `Are you sure you want to remove all ${item.ticketType} tickets for ${item.eventName}?`
      )
    ) {
      dispatch(
        removeItem({ eventId: item.eventId, ticketType: item.ticketType })
      );
    }
  };

  const handlePurchase = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    if (
      window.confirm(
        `You are about to purchase tickets for a total of $${totalPrice.toFixed(2)}. Proceed?`
      )
    ) {
      dispatch(purchaseTickets(cartItems));

      dispatch(clearCart());

      alert("Purchase successful! Thank you for buying tickets.");
      navigate("/");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg mt-10">
      <div className="p-6 sm:p-8">
        {/* --- Header --- */}
        <div className="flex justify-between items-baseline border-b border-gray-200 pb-4 mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            Shopping Cart
          </h2>
          <div className="text-right">
            <span className="text-sm text-gray-500">Total</span>
            <p className="text-2xl sm:text-3xl font-bold text-blue-600">
              ${totalPrice.toFixed(2)}
            </p>
          </div>
        </div>

        {/* --- Conditional Cart Content --- */}
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            {/* Replace with an actual SVG icon for a nicer look */}
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              Your cart is empty
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Browse events and add tickets to get started.
            </p>
            <div className="mt-6">
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Find Events
              </Link>
            </div>
          </div>
        ) : (
          <>
            <ul role="list" className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <li
                  key={`${item.eventId}-${item.ticketType}`}
                  className="flex py-6"
                >
                  {/* --- Item Image --- */}
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border bg-gray-50">
                    <img
                      src={item.imageUrl} // Assumes you have an image URL
                      alt={item.eventName}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>{item.eventName}</h3>
                        <p className="ml-4 font-semibold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        {item.ticketType}
                      </p>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm mt-4">
                      {/* --- Counter --- */}
                      <div className="flex items-center border rounded-md">
                        <button
                          onClick={() => handleDecrement(item)}
                          className="px-2 py-1 font-mono text-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 rounded-l-md"
                        >
                          -
                        </button>
                        <span className="px-4 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleIncrement(item)}
                          className="px-2 py-1 font-mono text-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 rounded-r-md"
                        >
                          +
                        </button>
                      </div>
                      {/* --- Remove Button --- */}
                      <div className="flex">
                        <button
                          onClick={() => handleRemove(item)}
                          type="button"
                          className="font-medium text-red-600 hover:text-red-500 flex items-center gap-1"
                        >
                          <FaTrash />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* --- Footer Actions --- */}
            <div className="border-t border-gray-200 pt-6 mt-6">
              <button
                onClick={handlePurchase}
                className="w-full bg-blue-600 text-white font-semibold text-lg rounded-lg hover:bg-blue-700 transition py-3"
              >
                Proceed to Checkout
              </button>
              <div className="mt-4 flex justify-center text-center text-sm">
                <button
                  onClick={() => dispatch(clearCart())}
                  className="font-medium text-gray-500 hover:text-red-600 transition-colors"
                >
                  Clear Entire Cart
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
