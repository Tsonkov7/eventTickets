import React from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";

const NotFoundPage: React.FC = () => {
  return (
    <>
      <Header />
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white mb-4 glow-text">404</h1>
          <p className="text-gray-300 mb-6 text-lg">
            This page drifted into the void.
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Back to events
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
