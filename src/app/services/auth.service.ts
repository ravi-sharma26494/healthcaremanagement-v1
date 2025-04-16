import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterPostData, User } from '../interfaces/auth';
import { Observable, map, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:3000';
  
  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  registerUser(postData: RegisterPostData) {
    return this.http.post<User>(`${this.baseUrl}/users`, postData).pipe(
      tap(user => {
        // Auto-login after registration
        this.setSession(user);
      })
    );
  }

  getUserDetails(email: string, password: string): Observable<User[]> {
    return this.http.get<User[]>(
      `${this.baseUrl}/users?email=${email}&password=${password}`
    );
  }

  login(email: string, password: string): Observable<boolean> {
    return this.getUserDetails(email, password).pipe(
      map(users => {
        if (users.length > 0) {
          this.setSession(users[0]);
          return true;
        }
        return false;
      })
    );
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('email');
  }

  getLoggedInUserEmail(): string | null {
    return sessionStorage.getItem('email');
  }

  private setSession(user: User) {
    sessionStorage.setItem('id', user.id.toString());
    sessionStorage.setItem('fullName', user.fullName);
    sessionStorage.setItem('email', user.email);
  }
}
