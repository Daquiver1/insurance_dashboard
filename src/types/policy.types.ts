export interface Policy {
  id: string;
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
