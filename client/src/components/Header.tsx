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
    <header className="bg-transparent text-white p-2 sm:p-4  flex items-center sticky top-0 ">
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
          to="/profile"
          className="text-2xl hidden sm:flex  items-center gap-1 hover:text-gray-500 transition-colors "
        >
          <FaUser />
        </Link>
      </nav>

      <div className="flex-1 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto absolute left-1/2 transform -translate-x-1/2  ">
        <form onSubmit={handleSearchSubmit} className="relative">
          <FaSearch className="absolute top-1/2 left-2 sm:left-3 transform -translate-y-1/2 text-gray-50 text-sm sm:text-base" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 border rounded-full bg-neutral-900 focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-white text-sm sm:text-base"
          />
        </form>
      </div>

      <div className="flex items-center">
        <Link
          to="/profile"
          className="sm:hidden flex items-center mr-2 hover:text-gray-500 transition-colors absolute right-10 "
        >
          <FaUser />
        </Link>
        <Link
          to="/checkout"
          className="flex items-center gap-1 hover:text-gray-500 transition-colors absolute right-4 lg:mr-2"
        >
          <CartIcon />
        </Link>
      </div>
    </header>
  );
};

export default Header;
