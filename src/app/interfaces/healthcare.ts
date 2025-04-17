export interface Patient {
  BeneID: string;
  DOB: string;
  DOD?: any; // API returns NaN as an object
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

export interface PatientsResponse {
  page: number;
  per_page: number;
  total: number;
  patients: Patient[];
}

export interface Claim {
  _id: string; // Changed from id to _id based on API response
  ClaimID: string;
  BeneID: string;
  ClaimStartDt: string;
  ClaimEndDt: string;
  Provider: string;
  InscClaimAmtReimbursed: number;
  AttendingPhysician: string;
  OperatingPhysician: string;
  OtherPhysician?: any;
  AdmissionDt: string;
  ClmAdmitDiagnosisCode: string;
  DeductibleAmtPaid: number;
  DischargeDt: string;
  DiagnosisGroupCode: string;
  ClmDiagnosisCode_1?: string;
  ClmDiagnosisCode_2?: string;
  ClmDiagnosisCode_3?: string;
  ClmDiagnosisCode_4?: string;
  ClmDiagnosisCode_5?: string;
  ClmDiagnosisCode_6?: string;
  ClmDiagnosisCode_7?: string;
  ClmDiagnosisCode_8?: string;
  ClmDiagnosisCode_9?: string;
  ClmDiagnosisCode_10?: string;
  ClmProcedureCode_1?: number;
  ClmProcedureCode_2?: number;
  ClmProcedureCode_3?: any;
  ClmProcedureCode_4?: any;
  ClmProcedureCode_5?: any;
  ClmProcedureCode_6?: any;
}

export interface ClaimsResponse {
  claims: Claim[];
  page?: number;
  per_page?: number;
  total?: number;
}

// Basic fraud response from API
export interface BaseFraud {
  Provider: string;
  id?: string; // Added for compatibility
}

// Extended fraud interface for UI display with default values
export interface Fraud extends BaseFraud {
  id: string;
  ClaimID: string;
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