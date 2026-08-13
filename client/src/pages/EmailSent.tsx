import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";

const EmailSent: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="flex items-center justify-center min-h-[70vh] px-4">
        <div className="w-full max-w-md p-8 bg-black/30 backdrop-blur-sm rounded-xl border border-white/40 shadow-lg text-center">
          <h2 className="mb-4 text-2xl font-bold text-white glow-text">
            Check your inbox
          </h2>
          <p className="mb-6 text-gray-300">
            We sent a verification link to your email. Click it to activate your
            RavePass account.
          </p>
          <button
            type="button"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        </div>
      </div>
    </>
  );
};

export default EmailSent;
