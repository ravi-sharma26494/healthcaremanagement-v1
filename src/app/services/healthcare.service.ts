import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { Patient, Claim, Fraud, UserStats } from '../interfaces/healthcare';

@Injectable({
  providedIn: 'root'
})
export class HealthcareService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.baseUrl}/patients`);
  }

  getPatient(id: string): Observable<Patient> {
    return this.http.get<Patient>(`${this.baseUrl}/patients/${id}`);
  }

  getClaims(): Observable<Claim[]> {
    return this.http.get<Claim[]>(`${this.baseUrl}/claims`);
  }

  getClaim(id: string): Observable<Claim> {
    return this.http.get<Claim>(`${this.baseUrl}/claims/${id}`);
  }

  getPatientClaims(beneId: string): Observable<Claim[]> {
    return this.http.get<Claim[]>(`${this.baseUrl}/claims?BeneID=${beneId}`);
  }

  getFrauds(): Observable<Fraud[]> {
    return this.http.get<Fraud[]>(`${this.baseUrl}/fraud`);
  }

  getFraud(id: string): Observable<Fraud> {
    return this.http.get<Fraud>(`${this.baseUrl}/fraud/${id}`);
  }

  getStats(): Observable<UserStats> {
    return forkJoin({
      patients: this.getPatients(),
      claims: this.getClaims(),
      fraud: this.getFrauds(),
      users: this.http.get<any[]>(`${this.baseUrl}/users`)
    }).pipe(
      map(response => ({
        patients: response.patients.length,
        claims: response.claims.length,
        fraud: response.fraud.length,
        users: response.users.length
      }))
    );
  }
}