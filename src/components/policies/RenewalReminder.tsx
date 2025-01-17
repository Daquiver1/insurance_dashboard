import { AlertCircle, Bell, ChevronRight } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectPoliciesNearExpiry } from "../../app/slices/policiesSlice";

const RenewalReminder: React.FC = () => {
  const policiesNearExpiry = useAppSelector((state) =>
    selectPoliciesNearExpiry(state, 30)
  );

  if (policiesNearExpiry.length === 0) {
    return (
      <div className="bg-green-50 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Bell className="h-5 w-5 text-green-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-green-700">
              All policies are up to date
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-red-50 rounded-lg p-4 max-w-2xl">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-600" />
        </div>
        <div className="ml-3 w-full">
          <h3 className="text-sm font-medium text-red-800">
            Policies Requiring Renewal
          </h3>
          <div className="mt-2 space-y-2">
            {policiesNearExpiry.map((policy) => {
              const daysLeft = Math.ceil(
                (new Date(policy.endDate).getTime() - new Date().getTime()) /
                  (1000 * 60 * 60 * 24)
              );
              return (
                <div
                  key={policy.id}
                  className="bg-white rounded-md p-3 shadow-sm border border-red-100 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {policy.type} Policy #{policy.id}
                    </p>
                    <p className="text-sm text-red-600">
                      Expires in {daysLeft} days
                    </p>
                  </div>
                  <Link
                    to={`/policies/${policy.id}`}
                    className="flex items-center text-sm font-medium text-red-600 hover:text-red-700"
                  >
                    View Details
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenewalReminder;
