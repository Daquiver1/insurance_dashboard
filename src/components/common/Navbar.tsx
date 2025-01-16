import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between">
        <h1 className="text-white text-xl">My React App</h1>
        <div>
          <Link to="/" className="text-white mr-4">
            Home
          </Link>
          <Link to="/about" className="text-white">
            About
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
