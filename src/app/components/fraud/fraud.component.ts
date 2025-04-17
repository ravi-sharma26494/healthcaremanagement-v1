import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { HealthcareService } from '../../services/healthcare.service';
import { Fraud, BaseFraud } from '../../interfaces/healthcare';
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
    ProgressBarModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    DropdownModule,
    CalendarModule
  ],
  templateUrl: './fraud.component.html',
  styleUrl: './fraud.component.css'
})
export class FraudComponent implements OnInit {
  frauds: Fraud[] = [];
  userEmail: string | null = null;
  loading: boolean = true;
  
  // Add dialog controls
  displayDialog: boolean = false;
  fraudForm: FormGroup;
  isNewFraud: boolean = true;
  selectedFraud: Fraud | null = null;
  statusOptions = [
    { label: 'Confirmed', value: 'Confirmed' },
    { label: 'Under Investigation', value: 'Under Investigation' },
    { label: 'Under Review', value: 'Under Review' }
  ];
  fraudTypeOptions = [
    { label: 'Billing', value: 'Billing Fraud' },
    { label: 'Identity', value: 'Identity Theft' },
    { label: 'Prescription', value: 'Prescription Fraud' },
    { label: 'Service', value: 'Unnecessary Services' }
  ];
  
  constructor(
    private router: Router,
    private healthcareService: HealthcareService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.fraudForm = this.fb.group({
      id: [''],
      ClaimID: ['', Validators.required],
      Provider: ['', Validators.required],
      FraudType: ['', Validators.required],
      DetectionDate: [new Date(), Validators.required],
      Status: ['Under Review', Validators.required],
      Amount: [0, Validators.min(0)],
      Confidence: [0.5, [Validators.min(0), Validators.max(1)]]
    });
  }

  ngOnInit() {
    this.userEmail = this.authService.getLoggedInUserEmail();
    this.loadFrauds();
  }

  loadFrauds() {
    this.loading = true;
    this.healthcareService.getFrauds().subscribe({
      next: (data) => {
        // Map the basic fraud data to the extended format needed by UI
        this.frauds = data.map((basicFraud: BaseFraud, index) => {
          return {
            id: `FRAUD${10000 + index}`,
            ClaimID: `CLM${Math.floor(10000 + Math.random() * 90000)}`,
            Provider: basicFraud.Provider,
            FraudType: this.getRandomFraudType(),
            DetectionDate: this.getRandomDate(),
            Status: this.getRandomStatus(),
            Amount: Math.floor(1000 + Math.random() * 9000),
            Confidence: Number((0.5 + Math.random() * 0.5).toFixed(2))
          } as Fraud;
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching fraud data', err);
        this.loading = false;
      }
    });
  }

  // Helper methods to generate random data for display purposes
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

  openNew() {
    this.isNewFraud = true;
    this.selectedFraud = null;
    this.fraudForm.reset({
      Status: 'Under Review',
      DetectionDate: new Date(),
      Confidence: 0.5
    });
    this.displayDialog = true;
  }

  editFraud(fraud: Fraud) {
    this.isNewFraud = false;
    this.selectedFraud = { ...fraud };
    this.fraudForm.patchValue({
      ...fraud,
      DetectionDate: fraud.DetectionDate ? new Date(fraud.DetectionDate) : new Date()
    });
    this.displayDialog = true;
  }

  saveFraud() {
    if (this.fraudForm.invalid) {
      return;
    }

    const fraudData = this.fraudForm.value;
    if (fraudData.DetectionDate instanceof Date) {
      fraudData.DetectionDate = fraudData.DetectionDate.toISOString().split('T')[0];
    }

    if (this.isNewFraud) {
      this.healthcareService.addFraud(fraudData).subscribe({
        next: () => {
          this.loadFrauds();
          this.displayDialog = false;
        },
        error: (err) => {
          console.error('Error adding fraud case', err);
        }
      });
    } else if (this.selectedFraud) {
      this.healthcareService.updateFraud(this.selectedFraud.id, fraudData).subscribe({
        next: () => {
          this.loadFrauds();
          this.displayDialog = false;
        },
        error: (err) => {
          console.error('Error updating fraud case', err);
        }
      });
    }
  }

  deleteFraud(fraud: Fraud) {
    if (confirm(`Are you sure you want to delete fraud case ${fraud.id}?`)) {
      this.healthcareService.deleteFraud(fraud.id).subscribe({
        next: () => {
          this.loadFrauds();
        },
        error: (err) => {
          console.error('Error deleting fraud case', err);
        }
      });
    }
  }

  hideDialog() {
    this.displayDialog = false;
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