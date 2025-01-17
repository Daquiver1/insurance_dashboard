import { format } from "date-fns";
import { AlertCircle, Calendar, Clock } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { Policy, PolicyStatus } from "../../types";

interface PolicyItemProps {
  policy: Policy;
}

const statusConfig: Record<
  PolicyStatus,
  { color: string; bgColor: string; borderColor: string }
> = {
  active: {
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
  },
  expired: {
    color: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  },
};

const PolicyItem: React.FC<PolicyItemProps> = ({ policy }) => {
  const status = statusConfig[policy.status];
  const daysRemaining = Math.ceil(
    (new Date(policy.endDate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <Link to={`/policies/${policy.id}`} className="block group">
      <div className="relative h-full p-6 bg-white rounded-xl border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-red-200">
        {/* Status Badge */}
        <div
          className={`absolute right-6 top-6 px-3 py-1 rounded-full text-sm font-medium ${status.color} ${status.bgColor} ${status.borderColor} border`}
        >
          {policy.status.charAt(0).toUpperCase() + policy.status.slice(1)}
        </div>

        {/* Policy Type & Details */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <h4 className="text-lg font-semibold text-gray-900">
              {policy.type} Policy
            </h4>
          </div>
          <p className="text-gray-600 line-clamp-2">{policy.details}</p>
        </div>

        {/* Price Section */}
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-gray-600">Premium:</span>
          <span className="text-sm font-semibold text-gray-900">
            ${policy.premiumAmount.toFixed(2)}
          </span>
        </div>

        {/* Dates Section */}
        <div className="space-y-3 mt-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-red-500" />
            <span>
              Start: {format(new Date(policy.startDate), "MMM d, yyyy")}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-red-500" />
            <span>End: {format(new Date(policy.endDate), "MMM d, yyyy")}</span>
          </div>
        </div>

        {/* Time Remaining Indicator */}
        {daysRemaining > 0 && policy.status !== "expired" && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-red-500" />
              <span className="text-gray-600">
                {daysRemaining} days remaining
              </span>
            </div>
          </div>
        )}

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 border-2 border-transparent rounded-xl transition-colors duration-300 group-hover:border-red-500/20" />
      </div>
    </Link>
  );
};

export default PolicyItem;

