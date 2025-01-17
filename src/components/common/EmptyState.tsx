import React from "react";
import { FileText } from "lucide-react";

interface EmptyStateProps {
  type: string;
  message?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ type, message }) => {
  return (
    <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No {type.charAt(0).toUpperCase() + type.slice(1)} Found
      </h3>
      <p className="text-gray-500">
        {message || `No ${type} have been submitted yet.`}
      </p>
    </div>
  );
};

export default EmptyState;
