import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterPostData, LoginPostData, AuthResponse, User } from '../interfaces/auth';
import { Observable, throwError, catchError, map, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:5001';  // Updated to match API spec
  private tokenKey = 'auth_token';
  private userDataKey = 'user_data';
  
  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  registerUser(postData: RegisterPostData): Observable<AuthResponse> {
    // Use the auth/register endpoint as specified in API
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/register`, postData).pipe(
      tap(response => {
        // Store the token for authentication
        if (response.token) {
          this.setToken(response.token);
          
          // Extract user data if available (email from registration data)
          const userData: User = {
            id: this.generateUserId(), // Generate a temporary ID since API might not return it
            email: postData.email,
            fullName: postData.fullName
          };
          this.setUserData(userData);
        }
      }),
      catchError(this.handleError)
    );
  }

  login(email: string, password: string): Observable<boolean> {
    const loginData: LoginPostData = { email, password };
    
    // Use the auth/login endpoint as specified in API
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, loginData).pipe(
      map(response => {
        if (response && response.token) {
          this.setToken(response.token);
          
          // Extract user data if available (at least the email from login)
          const userData: User = {
            id: this.generateUserId(), // Generate a temporary ID since API might not return it
            email: email,
          };
          this.setUserData(userData);
          
          return true;
        }
        return false;
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => new Error('Invalid login credentials'));
      })
    );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userDataKey);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getLoggedInUserEmail(): string | null {
    const userData = this.getUserData();
    return userData ? userData.email : null;
  }

  // Helper methods
  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private setUserData(user: User): void {
    localStorage.setItem(this.userDataKey, JSON.stringify(user));
  }

  private getUserData(): User | null {
    const userData = localStorage.getItem(this.userDataKey);
    return userData ? JSON.parse(userData) : null;
  }

  private generateUserId(): string {
    // Generate a random ID if the API doesn't provide one
    return 'user_' + Math.random().toString(36).substr(2, 9);
  }

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
