import { FaHome, FaSearch, FaUser } from "react-icons/fa";
import React from "react";
import { Link } from "react-router-dom";
import CartIcon from "./CartIcon";

const Header: React.FC = () => {

  return (

    
    

    <header className="bg-white text-gray-800 p-4
    width-full flex justify-between items-center">
      <nav className="flex gap-4 justify-end">
        <Link to="/" className="flex items-center gap-1 hover:text-gray-300">
          <FaHome /> Home
        </Link>
        <a href="#" className="flex items-center gap-1 hover:text-gray-300">
          <FaSearch /> Search
        </a>
        <a href="#" className="flex items-center gap-1 hover:text-gray-300">
          <FaUser /> Profile
        </a>
      </nav>
    <Link to="/checkout" className="flex items-center gap-1 hover:text-gray-300">
        <CartIcon />
      </Link>
    </header>
  );
};

export default Header;