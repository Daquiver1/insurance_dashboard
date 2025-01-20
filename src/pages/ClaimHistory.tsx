import { AlertCircle, History } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchClaims, selectClaims } from "../app/slices/claimsSlice";
import ClaimHistoryModal from "../components/claims/ClaimHistoryModal";
import ClaimList from "../components/claims/ClaimList";
import EmptyState from "../components/common/EmptyState";
import SearchInput from "../components/common/SearchInput";
import { Claim, ClaimStatus } from "../types";

const statusColors: Record<ClaimStatus, string> = {
  submitted: "bg-amber-50 text-amber-700 border-amber-200",
  under_review: "bg-blue-50 text-blue-700 border-blue-200",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

const ClaimHistory = () => {
  const dispatch = useAppDispatch();
  const claimsState = useAppSelector(selectClaims);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);

  useEffect(() => {
    if (claimsState.status === "idle") {
      dispatch(fetchClaims());
    }
  }, [claimsState.status, dispatch]);

  const filteredClaims = claimsState.claims.filter((claim) => {
    const matchesSearch =
      claim.claimType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.id.toString().includes(searchTerm) ||
      claim.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      selectedType === "all" || claim.claimType.toLowerCase() === selectedType;
    return matchesSearch && matchesType;
  });

  const claimTypes = [
    "all",
    ...Array.from(
      new Set(claimsState.claims.map((claim) => claim.claimType.toLowerCase()))
    ),
  ];

  const getStatusColor = (status: string): string => {
    return (
      statusColors[status.toLowerCase() as ClaimStatus] ||
      "bg-gray-50 text-gray-700 border-gray-200"
    );
  };

  if (claimsState.status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mb-4" />
          <p className="text-gray-600">Loading claims...</p>
        </div>
      </div>
    );
  }

  if (claimsState.status === "failed") {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-center">
        <div>
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 font-medium">{claimsState.error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <History className="w-8 h-8 text-red-600" />
            <h2 className="text-2xl font-bold text-gray-900">Claims History</h2>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <SearchInput
            placeholder="Search claims..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
          >
            {claimTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {filteredClaims.length === 0 ? (
          <EmptyState
            type="claims"
            message={
              searchTerm || selectedType !== "all"
                ? "Try adjusting your search or filters."
                : undefined
            }
          />
        ) : (
          <ClaimList
            claims={filteredClaims}
            getStatusColor={getStatusColor}
            onSelectClaim={(claim) => setSelectedClaim(claim)}
          />
        )}
      </div>

      <ClaimHistoryModal
        claim={selectedClaim}
        onClose={() => setSelectedClaim(null)}
      />
    </>
  );
};

export default ClaimHistory;
