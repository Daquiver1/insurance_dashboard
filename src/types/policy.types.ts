export interface Policy {
  id: number;
  type: PolicyType;
  status: PolicyStatus;
  details: string;
  startDate: string;
  endDate: string;
  coverageDetails: string;
  premiumAmount: number;
  documentUrl: string;
}

export type PolicyType = "Health" | "Auto" | "Home";
export type PolicyStatus = "active" | "expired";
