import React from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";

const OrderSuccessPage: React.FC = () => {
  return (
    <>
      <Header />
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="w-full max-w-lg bg-black/30 backdrop-blur-sm rounded-xl p-8 border border-white/40 shadow-lg shadow-white/20 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-white mb-3 glow-text">
            Order confirmed!
          </h1>
          <p className="text-gray-300 mb-6">
            Your tickets are secured. A confirmation email is on its way.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/profile"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              View order history
            </Link>
            <Link
              to="/"
              className="px-6 py-3 border border-white/40 text-white rounded-lg hover:bg-white/10 transition font-semibold"
            >
              Browse more events
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderSuccessPage;
