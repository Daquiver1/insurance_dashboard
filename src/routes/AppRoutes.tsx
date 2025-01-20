// src/routes/AppRoutes.tsx
import React, { Suspense, lazy } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Layout from "../components/common/Layout";
import ProtectedRoute from "../components/common/ProtectedRoute";
import ClaimHistory from "../pages/ClaimHistory";
import Login from "../pages/Login";
import PolicyDetails from "../pages/PolicyDetails";
import Signup from "../pages/Signup";
import SubmitClaim from "../pages/SubmitClaim";

const Dashboard = lazy(() => import("../pages/Dashboard"));

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/policies/:id" element={<PolicyDetails />} />
              <Route path="/submit-claim" element={<SubmitClaim />} />
              <Route path="/claims-history" element={<ClaimHistory />} />
            </Route>
          </Route>

          <Route
            path="*"
            element={
              <div className="flex min-h-screen items-center justify-center">
                <h1 className="text-3xl font-bold text-gray-800">
                  404 - Not Found
                </h1>
              </div>
            }
          />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRoutes;
