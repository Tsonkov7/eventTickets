import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaUser } from "react-icons/fa";
import CartIcon from "./CartIcon";
import { useAppDispatch, useAppSelector } from "../features/store.hooks";
import { setSearchTerm, selectSearchTerm } from "../features/EventSlice";
import rpLogoUrl from "../assets/rp-logo.svg";
const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const searchTerm = useAppSelector(selectSearchTerm);
  const navigate = useNavigate();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <header className="bg-white text-gray-800 p-2 sm:p-4 border-b flex justify-between items-center sticky top-0 z-50">
      <nav className="flex gap-2 sm:gap-4 items-center">
        <Link
          to="/"
          className="flex items-center gap-1 hover:text-blue-500 transition-colors"
        >
          <img
            src={rpLogoUrl}
            alt="RP Logo"
            className="h-8 w-8 sm:h-12 sm:w-12"
          />
        </Link>
        <Link
          to="/register"
          className="hidden sm:flex items-center gap-1 hover:text-blue-500 transition-colors"
        >
          <FaUser />
        </Link>
      </nav>

      <div className="flex-1 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto">
        <form onSubmit={handleSearchSubmit} className="relative">
          <FaSearch className="absolute top-1/2 left-2 sm:left-3 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 border rounded-full bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          />
        </form>
      </div>

      <div className="flex items-center">
        <Link
          to="/register"
          className="sm:hidden flex items-center mr-2 hover:text-blue-500 transition-colors"
        >
          <FaUser />
        </Link>
        <Link
          to="/checkout"
          className="flex items-center gap-1 hover:text-blue-500 transition-colors"
        >
          <CartIcon />
        </Link>
      </div>
    </header>
  );
};

export default Header;
