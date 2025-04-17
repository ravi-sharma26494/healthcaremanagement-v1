import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, map, throwError, catchError } from 'rxjs';
import { Patient, Claim, Fraud, BaseFraud, UserStats, PatientsResponse, ClaimsResponse } from '../interfaces/healthcare';

@Injectable({
  providedIn: 'root'
})
export class HealthcareService {
  private baseUrl = 'http://localhost:5001';  // Updated base URL to match API spec

  constructor(private http: HttpClient) {}

  // Patient CRUD operations
  getPatients(): Observable<Patient[]> {
    return this.http.get<PatientsResponse>(`${this.baseUrl}/patients/`).pipe(
      map(response => response.patients || []),
      catchError(this.handleError)
    );
  }

  getPatientById(beneId: string): Observable<Patient> {
    return this.http.get<Patient>(`${this.baseUrl}/patients/${beneId}`).pipe(
      catchError(this.handleError)
    );
  }

  addPatient(patient: Partial<Patient>): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/patients/`, patient).pipe(
      catchError(this.handleError)
    );
  }

  updatePatient(id: string, changes: Partial<Patient>): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/patients/${id}`, changes).pipe(
      catchError(this.handleError)
    );
  }

  deletePatient(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/patients/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Claims CRUD operations
  getClaims(): Observable<Claim[]> {
    return this.http.get<ClaimsResponse>(`${this.baseUrl}/claims/`).pipe(
      map(response => response.claims || []),
      catchError(this.handleError)
    );
  }

  getClaimsByPatient(beneId: string): Observable<Claim[]> {
    return this.http.get<ClaimsResponse>(`${this.baseUrl}/claims/patient/${beneId}`).pipe(
      map(response => response.claims || []),
      catchError(this.handleError)
    );
  }

  addClaim(claim: Partial<Claim>): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/claims/`, claim).pipe(
      catchError(this.handleError)
    );
  }

  updateClaim(id: string, changes: Partial<Claim>): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/claims/${id}`, changes).pipe(
      catchError(this.handleError)
    );
  }

  deleteClaim(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/claims/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Fraud operations - updated to handle the simple fraud object structure from API
  getFraudCases(): Observable<Fraud[]> {
    return this.http.get<BaseFraud[]>(`${this.baseUrl}/fraud/`).pipe(
      map(frauds => this.transformFraudData(frauds)),
      catchError(this.handleError)
    );
  }

  // Alias method to maintain compatibility with existing component calls
  getFrauds(): Observable<Fraud[]> {
    return this.getFraudCases();
  }

  getFraud(id: string): Observable<Fraud> {
    return this.http.get<BaseFraud>(`${this.baseUrl}/fraud/${id}`).pipe(
      map(fraud => this.transformSingleFraud(fraud, id)),
      catchError(this.handleError)
    );
  }

  addFraud(fraud: Partial<Fraud>): Observable<any> {
    // Extract only the Provider field for the API
    const baseFraud: BaseFraud = {
      Provider: fraud.Provider || ''
    };

    return this.http.post<any>(`${this.baseUrl}/fraud/`, baseFraud).pipe(
      catchError(this.handleError)
    );
  }

  updateFraud(id: string, changes: Partial<Fraud>): Observable<any> {
    // Extract only the Provider field for the API
    const baseFraud: BaseFraud = {
      Provider: changes.Provider || ''
    };

    return this.http.put<any>(`${this.baseUrl}/fraud/${id}`, baseFraud).pipe(
      catchError(this.handleError)
    );
  }

  deleteFraud(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/fraud/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Transform basic fraud data to full fraud records with UI-required fields
  private transformFraudData(baseFrauds: BaseFraud[]): Fraud[] {
    return baseFrauds.map((fraud, index) => this.transformSingleFraud(fraud, `FRAUD${10000 + index}`));
  }

  private transformSingleFraud(baseFraud: BaseFraud, id: string): Fraud {
    // Generate random values for the UI fields not provided by the API
    return {
      id: id,
      Provider: baseFraud.Provider,
      ClaimID: `CLM${Math.floor(10000 + Math.random() * 90000)}`,
      FraudType: this.getRandomFraudType(),
      DetectionDate: this.getRandomDate(),
      Status: this.getRandomStatus(),
      Amount: Math.floor(1000 + Math.random() * 9000),
      Confidence: Number((0.5 + Math.random() * 0.5).toFixed(2))
    };
  }

  // Helper methods for generating random fraud data
  private getRandomFraudType(): string {
    const types = ['Billing Fraud', 'Identity Theft', 'Prescription Fraud', 'Unnecessary Services'];
    return types[Math.floor(Math.random() * types.length)];
  }

  private getRandomStatus(): string {
    const statuses = ['Confirmed', 'Under Investigation', 'Under Review'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  }

  private getRandomDate(): string {
    const now = new Date();
    const pastDate = new Date(now.setMonth(now.getMonth() - Math.floor(Math.random() * 6)));
    return pastDate.toISOString().split('T')[0];
  }

  // User operations
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/users/`).pipe(
      catchError(this.handleError)
    );
  }

  // Dashboard statistics
  getDashboardStats(): Observable<UserStats> {
    return forkJoin({
      patients: this.http.get<PatientsResponse>(`${this.baseUrl}/patients/`),
      claims: this.http.get<ClaimsResponse>(`${this.baseUrl}/claims/`),
      fraud: this.http.get<BaseFraud[]>(`${this.baseUrl}/fraud/`),
      users: this.http.get<any[]>(`${this.baseUrl}/users/`)
    }).pipe(
      map(results => ({
        patients: results.patients.total || 0,
        claims: results.claims.claims?.length || 0,
        fraud: results.fraud.length || 0,
        users: results.users.length || 0
      })),
      catchError(this.handleError)
    );
  }

  // Alias method to maintain compatibility with existing component calls
  getStats(): Observable<UserStats> {
    return this.getDashboardStats();
  }

  // Error handling
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}