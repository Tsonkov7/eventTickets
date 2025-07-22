import React from 'react';
import { useAppSelector, useAppDispatch } from '../features/store.hooks';
import { 
  selectCart, 
  removeFromCart, 
  selectTotalPrice, 
  clearCart // Good to have a clear cart button
} from '../features/CartSlice';
import type { CartItem } from '../features/CartSlice'; // 1. Import the CartItem type

const Cart: React.FC = () => {
    const cartItems = useAppSelector(selectCart);
    const totalPrice = useAppSelector(selectTotalPrice);
    const dispatch = useAppDispatch();

    // Handler for removing an item from the cart
    const handleRemove = (item: CartItem) => {
        // 4. Dispatch with the required payload: { eventId, ticketType }
        dispatch(removeFromCart({ eventId: item.eventId, ticketType: item.ticketType }));
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
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
                        {/* 2. Update the map to use CartItem properties */}
                        {cartItems.map(item => (
                            // 3. Use a composite key for uniqueness
                            <li key={`${item.eventId}-${item.ticketType}`} className="flex items-center justify-between py-4">
                                <div className="flex-1">
                                    <p className="font-semibold text-lg text-gray-900">{item.eventName}</p>
                                    <p className="text-sm text-gray-600">{item.ticketType}</p>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-gray-800 font-medium w-32 text-center">
                                        ${item.price.toFixed(2)} x {item.quantity}
                                    </span>
                                    <button
                                        className="ml-4 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full hover:bg-red-600 transition-transform transform hover:scale-110"
                                        onClick={() => handleRemove(item)}
                                        aria-label={`Remove ${item.ticketType} for ${item.eventName}`}
                                    >
                                        X
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
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;