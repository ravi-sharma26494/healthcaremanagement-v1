export interface Patient {
  id: number;
  BeneID: string;
  DOB: string;
  DOD?: string;
  Gender: number;
  Race: number;
  RenalDiseaseIndicator: string;
  State: number;
  County: number;
  NoOfMonths_PartACov: number;
  NoOfMonths_PartBCov: number;
  ChronicCond_Alzheimer: number;
  ChronicCond_Heartfailure: number;
  ChronicCond_KidneyDisease: number;
  ChronicCond_Cancer: number;
  ChronicCond_ObstrPulmonary: number;
  ChronicCond_Depression: number;
  ChronicCond_Diabetes: number;
  ChronicCond_IschemicHeart: number;
  ChronicCond_Osteoporasis: number;
  ChronicCond_rheumatoidarthritis: number;
  ChronicCond_stroke: number;
  IPAnnualReimbursementAmt?: number;
  IPAnnualDeductibleAmt?: number;
  OPAnnualReimbursementAmt?: number;
  OPAnnualDeductibleAmt?: number;
}

export interface Claim {
  id: string;
  ClaimID: string;
  BeneID: string;
  ClaimType: string;
  ClaimAmount: number;
  ClaimStatus: string;
  SubmissionDate: string;
  Provider: string;
}

export interface Fraud {
  id: string;
  ClaimID: string;
  BeneID: string;
  FraudType: string;
  DetectionDate: string;
  Status: string;
  Amount: number;
  Confidence: number;
}

export interface UserStats {
  claims: number;
  patients: number;
  fraud: number;
  users: number;
}