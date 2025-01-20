import React from "react";
import { Claim, ClaimStatus } from "../../types";
import ClaimProgressBar from "./ClaimProgressBar";

interface ClaimItemProps {
  claim: Claim;
  getStatusColor: (status: ClaimStatus) => string;
  onSelectClaim: (claim: Claim) => void;
}

const ClaimItem: React.FC<ClaimItemProps> = ({
  claim,
  getStatusColor,
onSelectClaim,
}) => {
  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200 hover:border-red-200 transition-colors duration-200 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-lg font-semibold text-gray-900">
            Claim #{claim.id}
          </h3>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
              claim.status
            )}`}
          >
            {claim.status.replace("_", " ").toUpperCase()}
          </span>
        </div>
        <p className="text-gray-600">Type: {claim.claimType}</p>
      </div>

      <div className="my-4">
        <ClaimProgressBar status={claim.status} />
      </div>

      <div className="flex mt-8 justify-center">
        <button
          onClick={() => onSelectClaim(claim)}
          className="text-red-600 underline hover:text-red-700 transition-colors"
        >
          View Status
        </button>
      </div>
    </div>
  );
};

export default ClaimItem;
