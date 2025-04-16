import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { TagModule } from 'primeng/tag';
import { HealthcareService } from '../../services/healthcare.service';
import { Patient } from '../../interfaces/healthcare';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, PaginatorModule, TagModule],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.css'
})
export class PatientsComponent implements OnInit {
  patients: Patient[] = [];
  userEmail: string | null = null;
  loading: boolean = true;
  
  constructor(
    private router: Router,
    private healthcareService: HealthcareService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userEmail = this.authService.getLoggedInUserEmail();
    this.loadPatients();
  }

  loadPatients() {
    this.loading = true;
    this.healthcareService.getPatients().subscribe({
      next: (data) => {
        this.patients = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching patients data', err);
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

  getGenderLabel(code: number): string {
    return code === 1 ? 'Male' : 'Female';
  }

  getRaceLabel(code: number): string {
    const races = ['White', 'Black', 'Hispanic', 'Asian', 'Other'];
    return races[code - 1] || 'Unknown';
  }

  getConditionStatus(value: number): string {
    return value === 1 ? 'Yes' : 'No';
  }
}