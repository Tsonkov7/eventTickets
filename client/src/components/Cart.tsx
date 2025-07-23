import React from 'react';
import { FaTrash } from 'react-icons/fa'; // A trash icon is great for the remove button
import { useAppSelector, useAppDispatch } from '../features/store.hooks';
import {
  selectCart,
  selectTotalPrice,
  incrementQuantity, // Import new actions
  decrementQuantity,
  removeItem,
  clearCart
   
} from '../features/CartSlice';
import type { CartItem } from '../features/CartSlice';
import { purchaseTickets } from '../features/EventSlice';
import { useNavigate } from 'react-router-dom';

const Cart: React.FC = () => {
  const cartItems = useAppSelector(selectCart);
  const totalPrice = useAppSelector(selectTotalPrice);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();


  // Handlers to dispatch the new actions
  const handleIncrement = (item: CartItem) => {
    dispatch(incrementQuantity({ eventId: item.eventId, ticketType: item.ticketType }));
  };

  const handleDecrement = (item: CartItem) => {
    dispatch(decrementQuantity({ eventId: item.eventId, ticketType: item.ticketType }));
  };
  
const handleRemove = (item: CartItem) => {
    if(window.confirm(`Are you sure you want to remove all ${item.ticketType} tickets for ${item.eventName}?`)) {
        dispatch(removeItem({ eventId: item.eventId, ticketType: item.ticketType }));
    }
};

 const handlePurchase = () => {
    // Basic validation
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    if(window.confirm(`You are about to purchase tickets for a total of $${totalPrice.toFixed(2)}. Proceed?`)) {
      // Step 1: Dispatch the action to decrement ticket counts
      dispatch(purchaseTickets(cartItems));

      // Step 2: Dispatch the action to clear the cart
      dispatch(clearCart());

      // Step 3: Provide feedback and navigate the user
      alert("Purchase successful! Thank you for buying tickets.");
      navigate('/'); // Navigate to the home page (or a success page)
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <div className="flex justify-between items-center border-b pb-4 mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Shopping Cart</h2>
        <h5 className="text-xl font-semibold text-gray-700">
          Total: <span className="text-blue-600">${totalPrice.toFixed(2)}</span>
        </h5>
      </div>

      {cartItems.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Your cart is empty.</p>
      ) : (
        <>
          <ul className="divide-y divide-gray-200">
            {cartItems.map(item => (
              <li key={`${item.eventId}-${item.ticketType}`} className="flex flex-col sm:flex-row items-center justify-between py-4">
                
                {/* Item Details */}
                <div className="flex-1 mb-4 sm:mb-0">
                  <p className="font-semibold text-lg text-gray-900">{item.eventName}</p>
                  <p className="text-sm text-gray-600">{item.ticketType}</p>
                  <p className="text-sm font-bold text-blue-500">${item.price.toFixed(2)} each</p>
                </div>

                {/* --- KEY CHANGE: Interactive Counter --- */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => handleDecrement(item)}
                      className="px-3 py-1 font-bold text-lg text-gray-700 hover:bg-gray-200 rounded-l-lg"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-5 py-1 font-semibold text-gray-800" aria-live="polite">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleIncrement(item)}
                      className="px-3 py-1 font-bold text-lg text-gray-700 hover:bg-gray-200 rounded-r-lg"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemove(item)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors"
                    aria-label={`Remove all ${item.ticketType} tickets for ${item.eventName}`}
                  >
                    <FaTrash />
                  </button>
                </div>

              </li>
            ))}
          </ul>
          <div className="flex justify-end mt-6">
            <button
              onClick={() => dispatch(clearCart())}
              className="px-6 py-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800 transition"
            >
              Clear Cart
            </button>
            <button
              onClick={handlePurchase}
              className="ml-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Purchase Tickets
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;