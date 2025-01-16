import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MinusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAppDispatch } from "../../app/hooks";
import { logout } from "../../app/slices/authSlice";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      {/* Mobile Hamburger Menu */}
      <div className="md:hidden flex items-center p-4 bg-blue-500">
        <button onClick={toggleSidebar}>
          {isOpen ? (
            <XMarkIcon className="w-6 h-6 text-white" />
          ) : (
            <MinusIcon className="w-6 h-6 text-white" />
          )}
        </button>
        <span className="ml-2 text-white font-semibold">
          Insurance Dashboard
        </span>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto bg-blue-500 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:inset-0`}
      >
        <div className="flex items-center justify-center h-16">
          <h1 className="text-white text-xl font-bold">Dashboard</h1>
        </div>
        <nav className="px-2 space-y-1">
          <Link
            to="/dashboard"
            className="block px-4 py-2 mt-2 text-sm font-semibold text-white bg-blue-700 rounded"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="block px-4 py-2 mt-2 text-sm font-semibold text-white rounded hover:bg-blue-600"
          >
            About
          </Link>
          {/* Add more navigation links here */}
          <button
            onClick={handleLogout}
            className="w-full text-left block px-4 py-2 mt-2 text-sm font-semibold text-white rounded hover:bg-blue-600"
          >
            Logout
          </button>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
