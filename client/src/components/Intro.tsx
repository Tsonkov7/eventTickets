import React from "react";
import rpLogoUrl from "../assets/rp-logo.svg";

const Intro: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-transparent to-black text-white text-center p-4">
      <img
        src={rpLogoUrl}
        alt="RP Logo"
        className="w-32 h-32 mb-6 animate-bounce"
      />
      <h1 className="text-4xl sm:text-5xl font-bold mb-4">Get Your RavePass</h1>

      <p className="text-lg sm:text-xl mb-8 max-w-2xl">
        The best moment of your life is just a click away. Discover and book
        tickets for the hottest events!
      </p>
    </div>
  );
};

export default Intro;
