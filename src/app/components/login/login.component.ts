import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CardModule,
    InputTextModule,
    FormsModule,
    PasswordModule,
    ButtonModule,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  login = {
    email: '',
    password: '',
  };
  loading = false;

  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);
  
  onLogin() {
    const { email, password } = this.login;
    this.loading = true;
    
    this.authService.login(email, password).subscribe({
      next: (success) => {
        this.loading = false;
        if (success) {
          this.router.navigate(['home']);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Login Failed',
            detail: 'Invalid email or password',
          });
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Login error:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Something went wrong during login',
        });
      }
    });
  }
}
