import React from "react";
import { Claim, ClaimHistory } from "../../types";
import { formatDate } from "../../utils/helpers";

interface ClaimHistoryModalProps {
  claim: Claim | null;
  onClose: () => void;
}

const ClaimHistoryModal: React.FC<ClaimHistoryModalProps> = ({
  claim,
  onClose,
}) => {
  if (!claim) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-25 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative w-full max-w-lg transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
          {/* Close Button */}
          <div className="absolute right-4 top-4">
            <button
              onClick={onClose}
              className="rounded-full p-1 hover:bg-gray-100 transition-colors"
            >
              <span className="sr-only">Close</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5 text-gray-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Modal Content */}
          <div className="space-y-6 p-6">
            {/* Claim Header */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900">
                Claim: {claim.claimType}
              </h3>
              <p className="text-sm text-gray-500">Claim ID: #{claim.id}</p>
            </div>

            {/* Timeline */}
            <div className="relative">
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-300" />
              {claim.history.map((entry: ClaimHistory, index: number) => (
                <div
                  key={index}
                  className="relative flex items-start gap-4 mb-8"
                >
                  {/* Timeline Marker */}
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      index <= claim.history.length - 1
                        ? "bg-green-500 text-white"
                        : "bg-gray-300 text-gray-500"
                    }`}
                  >
                    {index + 1}
                  </div>

                  {/* Timeline Content */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-800">
                        {entry.stage}
                      </span>
                    </div>
                    <p className="text-gray-600">{entry.remarks}</p>
                    <span className="text-sm text-gray-500">
                      {formatDate(entry.date)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimHistoryModal;
