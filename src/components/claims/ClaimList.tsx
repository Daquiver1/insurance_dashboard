import React from "react";
import { Claim, ClaimStatus } from "../../types";
import ClaimItem from "./ClaimItem";

interface ClaimListProps {
  claims: Claim[];
  getStatusColor: (status: ClaimStatus) => string;
  onSelectClaim: (claim: Claim) => void;
}

const ClaimList: React.FC<ClaimListProps> = ({
  claims,
  getStatusColor,
  onSelectClaim,
}) => {
  return (
    <div className="grid gap-4">
      {claims.map((claim) => (
        <ClaimItem
          key={claim.id}
          claim={claim}
          getStatusColor={getStatusColor}
          onSelectClaim={onSelectClaim}
        />
      ))}
    </div>
  );
};

export default ClaimList;
