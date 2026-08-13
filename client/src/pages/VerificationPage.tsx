import React from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";

const VerificationPage: React.FC = () => {
  return (
    <>
      <Header />
      <div className="min-h-[70vh] flex flex-col justify-center items-center px-4">
        <div className="w-full max-w-md p-8 bg-black/30 backdrop-blur-sm rounded-xl border border-white/40 shadow-lg text-center">
          <h1 className="text-2xl font-bold mb-4 text-white glow-text">
            Email verified!
          </h1>
          <p className="text-lg text-gray-300 mb-6">
            Your account is active. You're ready to grab tickets.
          </p>
          <Link
            to="/login"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Log in
          </Link>
        </div>
      </div>
    </>
  );
};

export default VerificationPage;
