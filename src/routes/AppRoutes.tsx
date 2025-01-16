// src/routes/AppRoutes.tsx
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";
import Sidebar from "../components/common/Sidebar";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import PolicyDetails from "../pages/PolicyDetails";
import SubmitClaim from "../pages/SubmitClaim";
import About from "../pages/about";
import Home from "../pages/home";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/dashboard"
            element={
              <div className="flex">
                <Sidebar />
                <div className="flex-1 p-4">
                  <Dashboard />
                </div>
              </div>
            }
          />
          <Route
            path="/about"
            element={
              <div className="flex">
                <Sidebar />
                <div className="flex-1 p-4">
                  <About />
                </div>
              </div>
            }
          />
          <Route
            path="/policies/:id"
            element={
              <div className="flex">
                <Sidebar />
                <div className="flex-1 p-4">
                  <PolicyDetails />
                </div>
              </div>
            }
          />
          <Route
            path="/submit-claim"
            element={
              <div className="flex">
                <Sidebar />
                <div className="flex-1 p-4">
                  <SubmitClaim />
                </div>
              </div>
            }
          />
        </Route>

        {/* Fallback Route */}
        <Route
          path="*"
          element={
            <h1 className="text-center mt-10 text-3xl">404 - Not Found</h1>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
