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
    <header className="bg-white text-gray-800 p-4 border-b flex justify-between items-center sticky top-0 z-50">
      <nav className="flex gap-4 items-center">
        <Link
          to="/"
          className="flex items-center gap-1 hover:text-blue-500 transition-colors"
        >
          <img src={rpLogoUrl} alt="RP Logo" className="h-12 w-12" />
        </Link>
        <Link
          to="/profile"
          className="flex items-center gap-1 hover:text-blue-500 transition-colors"
        >
          <FaUser /> Profile
        </Link>
      </nav>

      <div className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl px-4">
        <form onSubmit={handleSearchSubmit} className="relative">
          <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search for events..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border rounded-full bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          />
        </form>
      </div>

      <div className="flex items-center">
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
