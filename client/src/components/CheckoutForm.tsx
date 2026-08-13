import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";

interface CheckoutFormProps {
  onSuccessfulPayment: (paymentIntentId: string) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSuccessfulPayment }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message || "An unexpected error occurred.");
      } else {
        setMessage("An unexpected error occurred.");
      }
      setIsLoading(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      onSuccessfulPayment(paymentIntent.id);
    }
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <h3 className="text-lg font-medium text-white mb-4">Payment Details</h3>
      <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
      <Button
        type="submit"
        disabled={isLoading || !stripe || !elements}
        className="w-full mt-6 bg-blue-600 text-white font-semibold text-lg rounded-lg hover:bg-blue-700 transition py-3 shadow-md shadow-blue-500/40 hover:shadow-lg hover:shadow-blue-500/60 disabled:bg-gray-600 disabled:shadow-none"
      >
        {isLoading ? "Processing..." : "Pay now"}
      </Button>
      {message && (
        <div className="p-2 mt-2 text-sm text-red-300 bg-red-900/50 border border-red-500/30 rounded">
          {message}
        </div>
      )}
    </form>
  );
};

export default CheckoutForm;
