import React from "react";

import { useNavigate } from "react-router-dom";

const EmailSent: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded shadow-md text-center">
        <h2 className="mb-6 text-2xl font-bold text-gray-800">Email Sent</h2>
        <p className="mb-4 text-gray-600">
          Please check your inbox for further instructions.
        </p>
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => navigate("/login")}
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default EmailSent;
