import {
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  Shield,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { logout } from "../../app/slices/authSlice";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  const closeSidebar = () => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/claims-history", label: "Claims History", icon: History },
    { path: "/submit-claim", label: "Submit Claim", icon: PlusCircle },
  ];

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
      isActive
        ? "bg-red-600 text-white hover:bg-red-700"
        : "text-gray-600 hover:bg-red-50 hover:text-red-600"
    }`;

  return (
    <>
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 px-4 flex items-center justify-between z-30">
        <div className="flex items-center gap-2">
          <Shield data-testid="shield-icon" className="h-6 w-6 text-red-600" />
          <span className="font-semibold text-gray-900">Insurance Portal</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg hover:bg-gray-100"
          aria-label="Toggle navigation"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-gray-600" />
          ) : (
            <Menu className="w-6 h-6 text-gray-600" />
          )}
        </button>
      </div>

      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-gray-800/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 h-full w-80 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out z-40 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="h-16 flex-shrink-0 flex items-center gap-2 px-6 border-b border-gray-200">
            <Shield
              data-testid="shield-icon"
              className="h-6 w-6 text-red-600"
            />
            <h1 className="text-xl font-bold text-gray-900">
              Insurance Portal
            </h1>
          </div>

          <div className="flex flex-col h-full">
            <nav className="flex-none p-4 space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={navLinkClass}
                  onClick={closeSidebar}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex-grow" />

            <div className="flex-none p-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </aside>

      <div className="h-16 md:hidden" />
    </>
  );
};

export default Sidebar;
