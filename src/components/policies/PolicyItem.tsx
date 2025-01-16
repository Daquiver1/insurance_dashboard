// src/components/policies/PolicyItem.tsx
import React from "react";
import { Policy, PolicyStatus } from "../../app/slices/policiesSlice";
import { Link } from "react-router-dom";

interface PolicyItemProps {
  policy: Policy;
}

const statusColors: Record<PolicyStatus, string> = {
  active: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  expired: "bg-red-100 text-red-800",
};

const PolicyItem: React.FC<PolicyItemProps> = ({ policy }) => {
  return (
    <Link to={`/policies/${policy.id}`} className="block">
      <div className="p-4 border rounded shadow-sm bg-white hover:bg-gray-50 transition">
        <h4 className="text-lg font-semibold mb-2">{policy.type} Policy</h4>
        <p className="mb-2">{policy.details}</p>
        <span
          className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
            statusColors[policy.status]
          }`}
        >
          {policy.status.toUpperCase()}
        </span>
      </div>
    </Link>
  );
};

export default PolicyItem;
