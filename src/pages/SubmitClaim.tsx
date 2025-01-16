// src/pages/SubmitClaim.tsx
import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { submitClaim, selectClaims } from "../app/slices/claimsSlice";
import { fetchPolicies, selectPolicies } from "../app/slices/policiesSlice";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ClaimFormInputs {
  policyId: number;
  claimType: string;
  description: string;
  files: FileList;
}

const SubmitClaim: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ClaimFormInputs>();
  const claimsState = useAppSelector(selectClaims);
  const policiesState = useAppSelector(selectPolicies);

  useEffect(() => {
    if (policiesState.status === "idle") {
      dispatch(fetchPolicies());
    }
  }, [policiesState.status, dispatch]);

  const onSubmit: SubmitHandler<ClaimFormInputs> = async (data) => {
    // Simulate file upload by converting to base64 or similar
    const uploadedFiles = Array.from(data.files).map((file) => file.name); // Simplified

    const claimData = {
      userId: 0, // Will be set in the thunk
      policyId: data.policyId,
      claimType: data.claimType,
      description: data.description,
      files: uploadedFiles,
    };

    try {
      await dispatch(submitClaim(claimData)).unwrap();
      toast.success("Claim submitted successfully!");
      reset();
      navigate("/dashboard");
    } catch (error) {
      toast.error((error as string) || "Failed to submit claim.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <ToastContainer />
      <h2 className="text-2xl font-semibold mb-4">Submit a New Claim</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Policy Number Dropdown */}
        <div>
          <label className="block mb-1">Policy Number</label>
          <select
            {...register("policyId", { required: "Policy number is required" })}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select a Policy</option>
            {policiesState.policies.map((policy) => (
              <option key={policy.id} value={policy.id}>
                {policy.id} - {policy.type}
              </option>
            ))}
          </select>
          {errors.policyId && (
            <p className="text-red-500 text-sm">{errors.policyId.message}</p>
          )}
        </div>

        {/* Claim Type */}
        <div>
          <label className="block mb-1">Claim Type</label>
          <input
            type="text"
            {...register("claimType", { required: "Claim type is required" })}
            className="w-full px-3 py-2 border rounded"
            placeholder="e.g., Medical, Theft"
          />
          {errors.claimType && (
            <p className="text-red-500 text-sm">{errors.claimType.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1">Description</label>
          <textarea
            {...register("description", {
              required: "Description is required",
            })}
            className="w-full px-3 py-2 border rounded"
            placeholder="Describe the incident..."
            rows={4}
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>

        {/* Upload Files */}
        <div>
          <label className="block mb-1">Upload Files</label>
          <input
            type="file"
            {...register("files", {
              required: "At least one file is required",
            })}
            className="w-full"
            multiple
          />
          {errors.files && (
            <p className="text-red-500 text-sm">{errors.files.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className={`w-full px-4 py-2 text-white rounded ${
              claimsState.status === "loading"
                ? "bg-gray-500"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={claimsState.status === "loading"}
          >
            {claimsState.status === "loading"
              ? "Submitting..."
              : "Submit Claim"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubmitClaim;
