import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { TagModule } from 'primeng/tag';
import { HealthcareService } from '../../services/healthcare.service';
import { Claim } from '../../interfaces/healthcare';
import { AuthService } from '../../services/auth.service';

// Define the PrimeNG Tag severity type
type PrimeNGTagSeverity = 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' | undefined;

@Component({
  selector: 'app-claims',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, PaginatorModule, TagModule],
  templateUrl: './claims.component.html',
  styleUrl: './claims.component.css'
})
export class ClaimsComponent implements OnInit {
  claims: Claim[] = [];
  userEmail: string | null = null;
  loading: boolean = true;
  
  constructor(
    private router: Router,
    private healthcareService: HealthcareService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userEmail = this.authService.getLoggedInUserEmail();
    this.loadClaims();
  }

  loadClaims() {
    this.loading = true;
    this.healthcareService.getClaims().subscribe({
      next: (data) => {
        this.claims = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching claims data', err);
        this.loading = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  logout() {
    this.authService.logout();
  }

  getSeverity(status: string): PrimeNGTagSeverity {
    switch (status) {
      case 'Approved':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Rejected':
        return 'danger';
      default:
        return 'info';
    }
  }
}