import React from "react";
const VerificationPage: React.FC = () => {
  return (
    <div className="min-h-screen  bg-black/30 backdrop-blur-sm flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold mb-4">
        You have verified successfully!
      </h1>
      <p className="text-lg text-gray-700">
        Your account is now active. Thank you for verifying.
      </p>
    </div>
  );
};

export default VerificationPage;
