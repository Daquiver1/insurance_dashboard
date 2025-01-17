import React from "react";
import PolicyItem from "./PolicyItem";
import { Policy } from "../../types";

interface PolicyListProps {
  policies: Policy[];
}

const PolicyList: React.FC<PolicyListProps> = ({ policies }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {policies.map((policy) => (
        <PolicyItem key={policy.id} policy={policy} />
      ))}
    </div>
  );
};

export default PolicyList;
