// src/pages/Dashboard.tsx
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchPolicies, selectPolicies } from "../app/slices/policiesSlice";
import PolicyList from "../components/policies/PolicyList";
import { PolicyType, PolicyStatus } from "../app/slices/policiesSlice";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const policiesState = useAppSelector(selectPolicies);

  // Local state for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<PolicyType | "All">("All");
  const [filterStatus, setFilterStatus] = useState<PolicyStatus | "All">("All");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    if (policiesState.status === "idle") {
      dispatch(fetchPolicies());
    }
  }, [policiesState.status, dispatch]);

  // Filter and search logic
  const filteredPolicies = policiesState.policies
    .filter((policy) => {
      const matchesSearch =
        policy.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        policy.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        policy.details.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = filterType === "All" || policy.type === filterType;
      const matchesStatus =
        filterStatus === "All" || policy.status === filterStatus;

      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.startDate).getTime();
      const dateB = new Date(b.startDate).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  if (policiesState.status === "loading") {
    return <p>Loading policies...</p>;
  }

  if (policiesState.status === "failed") {
    return <p className="text-red-500">{policiesState.error}</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Dashboard Overview</h2>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 space-y-4 md:space-y-0">
        {/* Search Bar */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search policies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded w-64"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4">
          {/* Policy Type Filter */}
          <div className="relative">
            <select
              value={filterType}
              onChange={(e) =>
                setFilterType(e.target.value as PolicyType | "All")
              }
              className="px-4 py-2 border rounded appearance-none bg-white"
            >
              <option value="All">All Types</option>
              <option value="Health">Health</option>
              <option value="Auto">Auto</option>
              <option value="Home">Home</option>
            </select>
            <ChevronDownIcon className="w-5 h-5 absolute right-3 top-3 text-gray-500 pointer-events-none" />
          </div>

          {/* Policy Status Filter */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(e.target.value as PolicyStatus | "All")
              }
              className="px-4 py-2 border rounded appearance-none bg-white"
            >
              <option value="All">All Statuses</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="expired">Expired</option>
            </select>
            <ChevronDownIcon className="w-5 h-5 absolute right-3 top-3 text-gray-500 pointer-events-none" />
          </div>

          {/* Sort Order */}
          <div className="relative">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
              className="px-4 py-2 border rounded appearance-none bg-white"
            >
              <option value="asc">Start Date: Ascending</option>
              <option value="desc">Start Date: Descending</option>
            </select>
            <ChevronDownIcon className="w-5 h-5 absolute right-3 top-3 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Policy List */}
      <PolicyList policies={filteredPolicies} />
    </div>
  );
};

export default Dashboard;
