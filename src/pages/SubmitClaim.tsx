import { AlertCircle, PlusCircle, UploadIcon, X } from "lucide-react";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectClaims, submitClaim } from "../app/slices/claimsSlice";
import { fetchPolicies, selectPolicies } from "../app/slices/policiesSlice";
import { ClaimFormInputs } from "../types";

interface FilePreview {
  name: string;
  size: string;
}

const SubmitClaim: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ClaimFormInputs>();
  const claimsState = useAppSelector(selectClaims);
  const policiesState = useAppSelector(selectPolicies);
  const watchFiles = watch("files");

  useEffect(() => {
    if (policiesState.status === "idle") {
      dispatch(fetchPolicies());
    }
  }, [policiesState.status, dispatch]);

  const getFilePreviews = (): FilePreview[] => {
    if (!watchFiles) return [];
    return Array.from(watchFiles).map((file) => ({
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + " MB",
    }));
  };

  const onSubmit: SubmitHandler<ClaimFormInputs> = async (data) => {
    const uploadedFiles = Array.from(data.files).map((file) => file.name);

    const claimData = {
      userId: 0,
      policyId: data.policyId,
      claimType: data.claimType,
      description: data.description,
      files: uploadedFiles,
    };

    try {
      await dispatch(submitClaim(claimData)).unwrap();
      toast.success("Claim submitted successfully!");
      reset();
      navigate("/claims-history");
    } catch (error) {
      toast.error((error as string) || "Failed to submit claim.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center gap-3">
        <PlusCircle className="w-8 h-8 text-red-600" />
        <h2 className="text-2xl font-bold text-gray-900">Submit a New Claim</h2>
      </div>

      <ToastContainer />

      <div className="bg-white rounded-lg shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Policy Number <span className="text-red-500">*</span>
              </label>
              <select
                {...register("policyId", {
                  required: "Policy number is required",
                })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
              >
                <option value="">Select a Policy</option>
                {policiesState.policies.map((policy) => (
                  <option key={policy.id} value={policy.id}>
                    Policy #{policy.id} - {policy.type}
                  </option>
                ))}
              </select>
              {errors.policyId && (
                <p className="flex items-center gap-1 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.policyId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Claim Type <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("claimType", {
                  required: "Claim type is required",
                })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="e.g., Medical, Theft, Property Damage"
              />
              {errors.claimType && (
                <p className="flex items-center gap-1 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.claimType.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("description", {
                required: "Description is required",
                minLength: {
                  value: 50,
                  message: "Description should be at least 50 characters",
                },
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Please provide detailed information about your claim..."
              rows={6}
            />
            {errors.description && (
              <p className="flex items-center gap-1 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4" />
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Supporting Documents <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="file"
                  {...register("files", {
                    required: "At least one file is required",
                  })}
                  className="hidden"
                  id="file-upload"
                  multiple
                />
                <label
                  htmlFor="file-upload"
                  className="flex items-center justify-center w-full px-4 py-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-500 cursor-pointer transition-colors"
                >
                  <div className="text-center">
                    <UploadIcon className="w-8 h-8 text-red-500 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-700">
                      Drop files here or click to upload
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Support for images, PDFs, and documents
                    </p>
                  </div>
                </label>
              </div>
              {errors.files && (
                <p className="flex items-center gap-1 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.files.message}
                </p>
              )}
            </div>

            {getFilePreviews().length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  Selected Files:
                </p>
                <div className="space-y-2">
                  {getFilePreviews().map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <UploadIcon className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">
                          {file.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({file.size})
                        </span>
                      </div>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className={`px-6 py-3 text-white rounded-lg font-medium transition-colors ${
                claimsState.status === "loading"
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              }`}
              disabled={claimsState.status === "loading"}
            >
              {claimsState.status === "loading" ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                "Submit Claim"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitClaim;
