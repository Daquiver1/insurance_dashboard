// src/components/policies/PolicyList.tsx
import React from "react";
import {
  Policy,
  PolicyType,
  PolicyStatus,
} from "../../app/slices/policiesSlice";
import PolicyItem from "./PolicyItem";

interface PolicyListProps {
  policies: Policy[];
}

const PolicyList: React.FC<PolicyListProps> = ({ policies }) => {
  // Group policies by type
  const groupedByType: Record<PolicyType, Policy[]> = {
    Health: [],
    Auto: [],
    Home: [],
  };

  policies.forEach((policy) => {
    groupedByType[policy.type].push(policy);
  });

  return (
    <div className="space-y-6">
      {Object.entries(groupedByType).map(([type, policiesOfType]) => (
        <div key={type}>
          <h3 className="text-xl font-bold mb-2">{type} Policies</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {policiesOfType.map((policy) => (
              <PolicyItem key={policy.id} policy={policy} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PolicyList;
