import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Link, useNavigate } from "react-router-dom";

import { api } from "../lib/api";
import { useAppSelector, useAppDispatch } from "../features/store.hooks";
import { selectCart, selectTotalPrice, clearCart } from "../features/CartSlice";
import { useToast } from "../hooks/useToast";

import Header from "../components/Header";
import Cart from "../components/Cart";
import CheckoutForm from "../components/CheckoutForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckOut: React.FC = () => {
  const [clientSecret, setClientSecret] = useState("");
  const cart = useAppSelector(selectCart);
  const totalPrice = useAppSelector(selectTotalPrice);
  const dispatch = useAppDispatch();
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (cart.length === 0 || totalPrice <= 0) return;

    const createPaymentIntent = async () => {
      try {
        const items = cart.map((item) => ({
          eventId: item.eventId,
          ticketType: item.ticketType,
          quantity: item.quantity,
        }));

        const response = await api.post("/payments/create-payment-intent", {
          items,
        });
        setClientSecret(response.data.clientSecret);
      } catch (error) {
        const message =
          error &&
          typeof error === "object" &&
          "response" in error &&
          error.response &&
          typeof error.response === "object" &&
          "data" in error.response &&
          error.response.data &&
          typeof error.response.data === "object" &&
          "error" in error.response.data
            ? String(error.response.data.error)
            : "Could not initialize payment.";
        addToast(message, "error");
      }
    };

    createPaymentIntent();
  }, [cart, totalPrice, addToast]);

  const handleSuccessfulPayment = async (paymentIntentId: string) => {
    try {
      await api.post("/payments/confirm", { paymentIntentId });
      dispatch(clearCart());
      addToast("Purchase successful! Thank you for your order.", "success");
      navigate("/order-success");
    } catch {
      addToast("Payment succeeded but order confirmation failed.", "error");
    }
  };

  const appearance = { theme: "night" as const, labels: "floating" as const };
  const options = { clientSecret, appearance };

  if (cart.length === 0) {
    return (
      <div>
        <Header />
        <div className="max-w-2xl mx-auto p-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-4 glow-text">
            Your cart is empty
          </h1>
          <p className="text-gray-400 mb-6">
            Add tickets to an event before checking out.
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Browse events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto p-4 md:p-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-6 glow-text">
            Review Your Order
          </h1>
          <Cart />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-white mb-6 glow-text">
            Complete Payment
          </h1>
          <div className="bg-black/30 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-white/40">
            {clientSecret ? (
              <Elements options={options} stripe={stripePromise}>
                <CheckoutForm onSuccessfulPayment={handleSuccessfulPayment} />
              </Elements>
            ) : (
              <p className="text-center text-gray-400">
                Loading payment form...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
