export interface Claim {
  id: number;
  claimType: string;
  status: ClaimStatus;
}

export interface Claim {
  id: number;
  userId: number;
  policyId: number;
  claimType: string;
  description: string;
  files: string[];
  status: ClaimStatus;
  submittedAt: string;
  history: ClaimHistory[];
}

export interface ClaimsState {
  claims: Claim[];
  currentClaim: Claim | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export interface ClaimFormInputs {
  policyId: number;
  claimType: string;
  description: string;
  files: FileList;
}

export type ClaimStatus =
  | "submitted"
  | "under_review"
  | "approved"
  | "rejected";

export interface ClaimHistory {
  stage: string;
  date: string;
  remarks: string;
}
