import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { HealthcareService } from '../../services/healthcare.service';
import { Fraud } from '../../interfaces/healthcare';
import { AuthService } from '../../services/auth.service';

// Define the PrimeNG Tag severity type
type PrimeNGTagSeverity = 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' | undefined;

@Component({
  selector: 'app-fraud',
  standalone: true,
  imports: [
    CommonModule, 
    TableModule, 
    ButtonModule, 
    PaginatorModule, 
    TagModule, 
    ProgressBarModule
  ],
  templateUrl: './fraud.component.html',
  styleUrl: './fraud.component.css'
})
export class FraudComponent implements OnInit {
  frauds: Fraud[] = [];
  userEmail: string | null = null;
  loading: boolean = true;
  
  constructor(
    private router: Router,
    private healthcareService: HealthcareService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userEmail = this.authService.getLoggedInUserEmail();
    this.loadFrauds();
  }

  loadFrauds() {
    this.loading = true;
    this.healthcareService.getFrauds().subscribe({
      next: (data) => {
        this.frauds = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching fraud data', err);
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
      case 'Confirmed':
        return 'danger';
      case 'Under Investigation':
        return 'warning';
      case 'Under Review':
        return 'info';
      default:
        return 'secondary';
    }
  }

  getConfidenceColor(confidence: number): string {
    if (confidence >= 0.9) return '#FF5252';
    if (confidence >= 0.7) return '#FFC107';
    return '#4CAF50';
  }
}