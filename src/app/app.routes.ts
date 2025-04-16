import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { 
    path: 'claims', 
    loadComponent: () => import('./components/claims/claims.component').then(m => m.ClaimsComponent),
    canActivate: [authGuard] 
  },
  { 
    path: 'patients', 
    loadComponent: () => import('./components/patients/patients.component').then(m => m.PatientsComponent),
    canActivate: [authGuard] 
  },
  { 
    path: 'fraud', 
    loadComponent: () => import('./components/fraud/fraud.component').then(m => m.FraudComponent),
    canActivate: [authGuard] 
  },
  { 
    path: 'users', 
    loadComponent: () => import('./components/users/users.component').then(m => m.UsersComponent),
    canActivate: [authGuard] 
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
