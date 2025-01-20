import { Check } from "lucide-react";
import React from "react";
import { ClaimStatus } from "../../types";

interface ClaimProgressBarProps {
  status: ClaimStatus;
}

const ClaimProgressBar: React.FC<ClaimProgressBarProps> = ({ status }) => {
  const stages = [
    { label: "Submitted", key: "submitted" },
    { label: "Under Review", key: "under_review" },
    { label: "Approved", key: "approved" },
    { label: "Rejected", key: "rejected" },
  ];

  const currentStageIndex = stages.findIndex((stage) => stage.key === status);
  const percentage = ((currentStageIndex + 1) / stages.length) * 100;

  return (
    <div className="mt-4">
      <div className="relative mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="h-2.5 rounded-full bg-green-500 transition-all duration-500"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="absolute top-0 left-0 w-full flex justify-between px-1">
          {stages.map((stage, index) => (
            <div key={stage.key} className="flex flex-col items-center mt-4">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-white ${
                  index <= currentStageIndex ? "bg-green-500" : "bg-gray-300"
                }`}
                aria-label={stage.label}
                title={stage.label}
              >
                {index <= currentStageIndex && (
                  <Check className="w-3 h-3" role="img" aria-hidden="true" />
                )}
              </div>
              <span className="text-xs mt-1 text-gray-600">{stage.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClaimProgressBar;
