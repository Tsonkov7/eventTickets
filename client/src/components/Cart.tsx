import React, { useState } from "react"; // Import useState
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
import { Link } from "react-router-dom";
import ToastContainer from "./ToastContainer";
import { useToast } from "../hooks/useToast";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Cart: React.FC = () => {
  const cartItems = useAppSelector(selectCart);
  const totalPrice = useAppSelector(selectTotalPrice);
  const dispatch = useAppDispatch();
  const { toasts, addToast, removeToast } = useToast();

  // State for controlling the item removal dialog
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<CartItem | null>(null);

  // State for controlling the purchase confirmation dialog
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);

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

  // --- Logic for Item Removal Dialog ---
  const openRemoveDialog = (item: CartItem) => {
    setItemToRemove(item);
    setIsRemoveDialogOpen(true);
  };

  const confirmRemove = () => {
    if (itemToRemove) {
      dispatch(
        removeItem({
          eventId: itemToRemove.eventId,
          ticketType: itemToRemove.ticketType,
        })
      );
      addToast("Item removed from cart.", "info");
      setItemToRemove(null); // Clear the item after removal
      setIsRemoveDialogOpen(false); // Close dialog
    }
  };
  // --- End Item Removal Dialog Logic ---

  // --- Logic for Purchase Dialog ---
  const openPurchaseDialog = () => {
    if (cartItems.length === 0) {
      addToast("Your cart is empty!", "error"); // Use toast instead of alert
      return;
    }
    setIsPurchaseDialogOpen(true);
  };

  const confirmPurchase = () => {
    dispatch(purchaseTickets(cartItems));
    dispatch(clearCart());
    addToast("Purchase successful! Thank you for your order.", "success");
    setIsPurchaseDialogOpen(false); // Close dialog
  };
  // --- End Purchase Dialog Logic ---

  return (
    <>
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
                        src={item.imageUrl || "/placeholder.png"}
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
                          <span className="px-4 text-center text-black font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleIncrement(item)}
                            className="px-2 py-1 font-mono text-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 rounded-r-md"
                          >
                            +
                          </button>
                        </div>
                        {/* --- Remove Button (Now triggers dialog) --- */}
                        <div className="flex">
                          <button
                            onClick={() => openRemoveDialog(item)} // Open dialog
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
                  onClick={openPurchaseDialog} // Open purchase dialog
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
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />

      {/* --- Item Removal Confirmation Dialog --- */}
      <Dialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
        <DialogContent className="bg-white dark:bg-gray-800 rounded-lg shadow-xl">
          <DialogHeader className="p-6">
            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Confirm Removal
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {itemToRemove &&
                `Are you sure you want to remove all ${itemToRemove.ticketType} tickets for ${itemToRemove.eventName}? This action cannot be undone.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-2 p-6 bg-gray-50 dark:bg-gray-700 rounded-b-lg">
            <Button
              variant="outline"
              className="px-4 py-2 bg-transparent border border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => setIsRemoveDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              onClick={confirmRemove}
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- Purchase Confirmation Dialog --- */}
      <Dialog
        open={isPurchaseDialogOpen}
        onOpenChange={setIsPurchaseDialogOpen}
      >
        <DialogContent className="bg-white dark:bg-gray-800 rounded-lg shadow-xl">
          <DialogHeader className="p-6">
            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Confirm Purchase
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {`You are about to purchase tickets for a total of $${totalPrice.toFixed(2)}. Proceed with this order?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-2 p-6 bg-gray-50 dark:bg-gray-700 rounded-b-lg">
            <Button
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={confirmPurchase}
            >
              Confirm Purchase
            </Button>
            <Button
              variant="outline"
              className="px-4 py-2 bg-transparent border border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => setIsPurchaseDialogOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Cart;
