import { ChevronDown, LayoutDashboard } from "lucide-react";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchPolicies, selectPolicies } from "../app/slices/policiesSlice";
import EmptyState from "../components/common/EmptyState";
import SearchInput from "../components/common/SearchInput";
import PolicyList from "../components/policies/PolicyList";
import RenewalReminder from "../components/policies/RenewalReminder";
import PolicyDistributionChart from "../components/visualization/PolicyDistributionChart";
import PremiumTrendsChart from "../components/visualization/PremiumTrendsChart";
import { PolicyStatus, PolicyType } from "../types";

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const policiesState = useAppSelector(selectPolicies);

  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterType, setFilterType] = React.useState<PolicyType | "All">("All");
  const [filterStatus, setFilterStatus] = React.useState<PolicyStatus | "All">(
    "All"
  );
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");

  useEffect(() => {
    if (policiesState.status === "idle") {
      dispatch(fetchPolicies());
    }
  }, [policiesState.status, dispatch]);

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

  const SelectFilter = ({
    id,
    value,
    onChange,
    options,
    label,
  }: {
    id: string;
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    label: string;
  }) => (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
        aria-label={label}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-gray-500 pointer-events-none" />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center gap-3">
        <LayoutDashboard className="w-8 h-8 text-red-600" />
        <h2 className="text-2xl font-bold text-gray-900">
          Insurance Dashboard
        </h2>
      </div>

      {/* Reminder Section */}
      <RenewalReminder />

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            <SearchInput
              placeholder="Search policies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full lg:w-1/3"
            />

            <div className="flex flex-wrap gap-4">
              <SelectFilter
                id="type-filter"
                value={filterType}
                onChange={(value) => setFilterType(value as PolicyType | "All")}
                options={[
                  { value: "All", label: "All Types" },
                  { value: "Health", label: "Health" },
                  { value: "Auto", label: "Auto" },
                  { value: "Home", label: "Home" },
                ]}
                label="Filter by Type"
              />

              <SelectFilter
                id="status-filter"
                value={filterStatus}
                onChange={(value) =>
                  setFilterStatus(value as PolicyStatus | "All")
                }
                options={[
                  { value: "All", label: "All Statuses" },
                  { value: "active", label: "Active" },
                  { value: "expired", label: "Expired" },
                ]}
                label="Filter by Status"
              />

              <SelectFilter
                id="sort-order"
                value={sortOrder}
                onChange={(value) => setSortOrder(value as "asc" | "desc")}
                options={[
                  { value: "asc", label: "Oldest First" },
                  { value: "desc", label: "Newest First" },
                ]}
                label="Sort Order"
              />
            </div>
          </div>

          {/* Policy List */}
          {filteredPolicies.length > 0 ? (
            <PolicyList policies={filteredPolicies} />
          ) : (
            <EmptyState
              type="policies"
              message={
                searchTerm || filterType !== "All" || filterStatus !== "All"
                  ? "Try adjusting your search or filters."
                  : undefined
              }
            />
          )}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Premium Trends
            </h2>
          </div>
          <div className="p-6">
            <PremiumTrendsChart policies={policiesState.policies} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Policy Distribution
            </h2>
          </div>
          <div className="p-6">
            <PolicyDistributionChart policies={policiesState.policies} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
