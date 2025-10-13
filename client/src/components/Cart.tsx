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

  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<CartItem | null>(null);

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
      setItemToRemove(null);
      setIsRemoveDialogOpen(false);
    }
  };

  const openPurchaseDialog = () => {
    if (cartItems.length === 0) {
      addToast("Your cart is empty!", "error");
      return;
    }
    setIsPurchaseDialogOpen(true);
  };

  const confirmPurchase = () => {
    dispatch(purchaseTickets(cartItems));
    dispatch(clearCart());
    addToast("Purchase successful! Thank you for your order.", "success");
    setIsPurchaseDialogOpen(false);
  };

  return (
    <>
      <div className="max-w-2xl mx-auto p-8 bg-black rounded-xl shadow-lg mt-10 border border-white/40 shadow-white/40 hover:shadow-white/60 transition-shadow duration-300">
        <div className="p-6 sm:p-8">
          {/* --- Header --- */}
          <div className="flex justify-between items-baseline border-b border-gray-700 pb-4 mb-6">
            <h2
              className="text-2xl sm:text-3xl font-bold tracking-tight text-white"
              style={{ textShadow: "0 0 8px rgba(255, 255, 255, 0.8)" }}
            >
              Shopping Cart
            </h2>
            <div className="text-right">
              <span className="text-sm text-gray-400">Total</span>
              <p
                className="text-2xl sm:text-3xl font-bold text-blue-400"
                style={{ textShadow: "0 0 8px rgba(59, 130, 246, 0.5)" }}
              >
                ${totalPrice.toFixed(2)}
              </p>
            </div>
          </div>

          {/* --- Conditional Cart Content --- */}
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-600"
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
              <h3 className="mt-2 text-lg font-medium text-gray-200">
                Your cart is empty
              </h3>
              <p className="mt-1 text-sm text-gray-400">
                Browse events and add tickets to get started.
              </p>
              <div className="mt-6">
                <Link
                  to="/"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-blue-500 shadow-blue-500/40 hover:shadow-lg hover:shadow-blue-500/60 transition-all duration-300"
                >
                  Find Events
                </Link>
              </div>
            </div>
          ) : (
            <>
              <ul role="list" className="divide-y divide-gray-700">
                {cartItems.map((item) => (
                  <li
                    key={`${item.eventId}-${item.ticketType}`}
                    className="flex py-6"
                  >
                    {/* --- Item Image --- */}
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-700 bg-gray-900">
                      <img
                        src={item.imageUrl || "/placeholder.png"}
                        alt={item.eventName}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-100">
                          <h3>{item.eventName}</h3>
                          <p className="ml-4 font-semibold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        <p className="mt-1 text-sm text-gray-400">
                          {item.ticketType}
                        </p>
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm mt-4">
                        {/* --- Counter --- */}
                        <div className="flex items-center border border-gray-600 rounded-md">
                          <button
                            onClick={() => handleDecrement(item)}
                            className="px-2 py-1 font-mono text-lg text-gray-400 hover:bg-gray-700 disabled:opacity-50 rounded-l-md"
                          >
                            -
                          </button>
                          <span className="px-4 text-center text-white font-semibold ">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleIncrement(item)}
                            className="px-2 py-1 font-mono text-lg text-gray-400 hover:bg-gray-700 disabled:opacity-50 rounded-r-md"
                          >
                            +
                          </button>
                        </div>
                        {/* --- Remove Button --- */}
                        <div className="flex">
                          <button
                            onClick={() => openRemoveDialog(item)}
                            type="button"
                            className="font-medium text-red-500 hover:text-red-400 flex items-center gap-1 transition-colors"
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
              <div className="border-t border-gray-700 pt-6 mt-6">
                <button
                  onClick={openPurchaseDialog}
                  className="w-full bg-blue-600 text-white font-semibold text-lg rounded-lg hover:bg-blue-700 transition py-3 shadow-md shadow-blue-500/40 hover:shadow-lg hover:shadow-blue-500/60 disabled:bg-gray-600 disabled:shadow-none"
                >
                  Proceed to Checkout
                </button>
                <div className="mt-4 flex justify-center text-center text-sm">
                  <button
                    onClick={() => dispatch(clearCart())}
                    className="font-medium text-gray-500 hover:text-red-500 transition-colors"
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
        <DialogContent className="bg-black rounded-lg shadow-xl border border-white/40 shadow-lg shadow-white/40 transition-shadow duration-300">
          <DialogHeader className="p-6">
            <DialogTitle
              className="text-xl font-semibold text-white"
              style={{ textShadow: "0 0 8px rgba(255, 255, 255, 0.7)" }}
            >
              Confirm Removal
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm text-gray-400">
              {itemToRemove &&
                `Are you sure you want to remove all ${itemToRemove.ticketType} tickets for ${itemToRemove.eventName}? This action cannot be undone.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-4 p-6 bg-gray-900/50 border-t border-gray-700 rounded-b-lg">
            <Button
              variant="outline"
              className="px-4 py-2 bg-gray-700 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-gray-500 transition-colors"
              onClick={() => setIsRemoveDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-red-500 shadow-md shadow-red-500/40 hover:shadow-lg hover:shadow-red-500/60 transition-all duration-300"
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
        <DialogContent className="bg-black rounded-lg shadow-xl border border-white/40 shadow-lg shadow-white/40 transition-shadow duration-300">
          <DialogHeader className="p-6">
            <DialogTitle
              className="text-xl font-semibold text-white"
              style={{ textShadow: "0 0 8px rgba(255, 255, 255, 0.7)" }}
            >
              Confirm Purchase
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm text-gray-400">
              {`You are about to purchase tickets for a total of $${totalPrice.toFixed(2)}. Proceed with this order?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-4 p-6 bg-gray-900/50 border-t border-gray-700 rounded-b-lg">
            <Button
              variant="outline"
              className="px-4 py-2 bg-gray-700 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-gray-500 transition-colors"
              onClick={() => setIsPurchaseDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-blue-500 shadow-md shadow-blue-500/40 hover:shadow-lg hover:shadow-blue-500/60 transition-all duration-300"
              onClick={confirmPurchase}
            >
              Confirm Purchase
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Cart;
