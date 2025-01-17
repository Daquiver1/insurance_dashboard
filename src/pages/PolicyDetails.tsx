import { format } from "date-fns";
import { saveAs } from "file-saver";
import { AlertCircle, Download, FileText } from "lucide-react";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  clearCurrentPolicy,
  fetchPolicyById,
  selectPolicies,
} from "../app/slices/policiesSlice";

const PolicyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const policiesState = useAppSelector(selectPolicies);

  useEffect(() => {
    if (id) {
      dispatch(fetchPolicyById(Number(id)))
        .unwrap()
        .catch((error) => {
          toast.error(error || "Failed to load policy details");
        });
    }

    return () => {
      dispatch(clearCurrentPolicy());
    };
  }, [id, dispatch]);

  const handleDownload = () => {
    if (policiesState.currentPolicy) {
      const blob = new Blob(
        [`Policy Document for Policy ID: ${policiesState.currentPolicy.id}`],
        { type: "application/pdf" }
      );
      saveAs(blob, `Policy_${policiesState.currentPolicy.id}.pdf`);
      toast.success("Policy document downloaded successfully!");
    }
  };

  if (policiesState.status === "loading") {
    return (
      <div className="max-w-4xl mx-auto my-8 p-6 bg-white rounded-lg shadow-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (policiesState.status === "failed") {
    return (
      <div className="max-w-4xl mx-auto my-8 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center gap-2 text-red-700">
          <AlertCircle className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Error Loading Policy</h2>
        </div>
        <p className="mt-2 text-red-600">{policiesState.error}</p>
      </div>
    );
  }

  const policy = policiesState.currentPolicy;

  if (!policy) {
    return null;
  }

  const getStatusColor = (status: string) => {
    const statusColors = {
      active: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      expired: "bg-red-100 text-red-800",
      default: "bg-gray-100 text-gray-800",
    } as const;
    return (
      statusColors[status.toLowerCase() as keyof typeof statusColors] ||
      statusColors.default
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-t-lg border-b border-gray-200">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-red-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Policy Details</h2>
            <p className="text-gray-600 mt-1">Policy ID: {policy.id}</p>
          </div>
          <span
            className={`ml-auto px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
              policy.status
            )}`}
          >
            {policy.status}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white p-6 rounded-b-lg shadow-sm">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700">
                  Policy Type
                </h3>
                <p className="mt-1 text-base text-gray-900">{policy.type}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700">
                  Start Date
                </h3>
                <p className="mt-1 text-base text-gray-900">
                  {format(new Date(policy.startDate), "PPP")}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700">End Date</h3>
                <p className="mt-1 text-base text-gray-900">
                  {format(new Date(policy.endDate), "PPP")}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700">
                  Premium Amount
                </h3>
                <p className="mt-1 text-base text-gray-900">
                  ${policy.premiumAmount.toLocaleString()}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700">
                  Coverage Details
                </h3>
                <p className="mt-1 text-base text-gray-900">
                  {policy.coverageDetails}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700">
              Additional Details
            </h3>
            <p className="mt-1 text-base text-gray-900">{policy.details}</p>
          </div>

          {/* Download Button */}
          <div className="flex justify-end pt-4">
            <button
              onClick={handleDownload}
              className="flex items-center px-6 py-3 text-white bg-red-600 rounded-lg font-medium hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Policy Document
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyDetails;
