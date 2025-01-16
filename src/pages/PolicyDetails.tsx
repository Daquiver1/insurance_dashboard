// src/pages/PolicyDetails.tsx
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  fetchPolicyById,
  selectPolicies,
  clearCurrentPolicy,
} from "../app/slices/policiesSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { format } from "date-fns";
import { saveAs } from "file-saver";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PolicyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const policiesState = useAppSelector(selectPolicies);

  useEffect(() => {
    if (id) {
      dispatch(fetchPolicyById(Number(id)));
    }

    return () => {
      dispatch(clearCurrentPolicy());
    };
  }, [id, dispatch]);

  const handleDownload = () => {
    if (policiesState.currentPolicy) {
      // Simulate download by fetching the PDF and saving it
      // Since we don't have actual files, we'll create a dummy PDF blob
      const blob = new Blob(
        [`Policy Document for Policy ID: ${policiesState.currentPolicy.id}`],
        { type: "application/pdf" }
      );
      saveAs(blob, `Policy_${policiesState.currentPolicy.id}.pdf`);
      toast.success("Policy document downloaded successfully!");
    }
  };

  if (policiesState.status === "loading") {
    return <p>Loading policy details...</p>;
  }

  if (policiesState.status === "failed") {
    return <p className="text-red-500">{policiesState.error}</p>;
  }

  const policy = policiesState.currentPolicy;

  if (!policy) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
      <ToastContainer />
      <h2 className="text-2xl font-semibold mb-4">Policy Details</h2>
      <div className="space-y-2">
        <p>
          <strong>Policy ID:</strong> {policy.id}
        </p>
        <p>
          <strong>Type:</strong> {policy.type}
        </p>
        <p>
          <strong>Status:</strong> {policy.status}
        </p>
        <p>
          <strong>Start Date:</strong>{" "}
          {format(new Date(policy.startDate), "PPP")}
        </p>
        <p>
          <strong>End Date:</strong> {format(new Date(policy.endDate), "PPP")}
        </p>
        <p>
          <strong>Coverage Details:</strong> {policy.coverageDetails}
        </p>
        <p>
          <strong>Premium Amount:</strong> ${policy.premiumAmount}
        </p>
        <p>
          <strong>Details:</strong> {policy.details}
        </p>
      </div>
      <div className="mt-6">
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Download Policy Document
        </button>
      </div>
    </div>
  );
};

export default PolicyDetails;
