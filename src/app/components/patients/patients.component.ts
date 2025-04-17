import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { HealthcareService } from '../../services/healthcare.service';
import { Patient } from '../../interfaces/healthcare';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [
    CommonModule, 
    TableModule, 
    ButtonModule, 
    PaginatorModule, 
    TagModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    DropdownModule,
    CalendarModule
  ],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.css'
})
export class PatientsComponent implements OnInit {
  patients: Patient[] = [];
  userEmail: string | null = null;
  loading: boolean = true;
  
  // Dialog properties
  displayDialog: boolean = false;
  patientForm: FormGroup;
  isNewPatient: boolean = true;
  selectedPatient: Patient | null = null;

  // Dropdown options
  genderOptions = [
    { label: 'Male', value: 1 },
    { label: 'Female', value: 2 }
  ];
  
  raceOptions = [
    { label: 'White', value: 1 },
    { label: 'Black', value: 2 },
    { label: 'Hispanic', value: 3 },
    { label: 'Asian', value: 4 },
    { label: 'Other', value: 5 }
  ];
  
  conditionOptions = [
    { label: 'Yes', value: 1 },
    { label: 'No', value: 2 }
  ];
  
  constructor(
    private router: Router,
    private healthcareService: HealthcareService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.patientForm = this.fb.group({
      BeneID: ['', Validators.required],
      DOB: [null, Validators.required],
      Gender: [1, Validators.required],
      Race: [1, Validators.required],
      RenalDiseaseIndicator: ['0'],
      State: [0],
      County: [0],
      NoOfMonths_PartACov: [12],
      NoOfMonths_PartBCov: [12],
      ChronicCond_Alzheimer: [2],
      ChronicCond_Heartfailure: [2],
      ChronicCond_KidneyDisease: [2],
      ChronicCond_Cancer: [2],
      ChronicCond_ObstrPulmonary: [2],
      ChronicCond_Depression: [2],
      ChronicCond_Diabetes: [2],
      ChronicCond_IschemicHeart: [2],
      ChronicCond_Osteoporasis: [2],
      ChronicCond_rheumatoidarthritis: [2],
      ChronicCond_stroke: [2],
      IPAnnualReimbursementAmt: [0],
      IPAnnualDeductibleAmt: [0],
      OPAnnualReimbursementAmt: [0],
      OPAnnualDeductibleAmt: [0]
    });
  }

  ngOnInit() {
    this.userEmail = this.authService.getLoggedInUserEmail();
    this.loadPatients();
  }

  loadPatients() {
    this.loading = true;
    this.healthcareService.getPatients().subscribe({
      next: (data) => {
        this.patients = data;
        // Process patients to ensure numeric fields are properly set
        this.patients.forEach(patient => {
          // Set default values for null/undefined fields
          patient.IPAnnualReimbursementAmt = patient.IPAnnualReimbursementAmt || 0;
          patient.OPAnnualReimbursementAmt = patient.OPAnnualReimbursementAmt || 0;
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching patients data', err);
        this.loading = false;
      }
    });
  }

  openNew() {
    this.isNewPatient = true;
    this.selectedPatient = null;
    
    // Reset form with default values
    this.patientForm.reset({
      Gender: 1,
      Race: 1,
      RenalDiseaseIndicator: '0',
      State: 0,
      County: 0,
      NoOfMonths_PartACov: 12,
      NoOfMonths_PartBCov: 12,
      ChronicCond_Alzheimer: 2,
      ChronicCond_Heartfailure: 2,
      ChronicCond_KidneyDisease: 2,
      ChronicCond_Cancer: 2,
      ChronicCond_ObstrPulmonary: 2,
      ChronicCond_Depression: 2,
      ChronicCond_Diabetes: 2,
      ChronicCond_IschemicHeart: 2,
      ChronicCond_Osteoporasis: 2,
      ChronicCond_rheumatoidarthritis: 2,
      ChronicCond_stroke: 2,
      IPAnnualReimbursementAmt: 0,
      IPAnnualDeductibleAmt: 0,
      OPAnnualReimbursementAmt: 0,
      OPAnnualDeductibleAmt: 0
    });
    
    this.displayDialog = true;
  }

  editPatient(patient: Patient) {
    this.isNewPatient = false;
    this.selectedPatient = { ...patient };
    
    // Convert DOB string to Date object for the calendar component
    const dobDate = patient.DOB ? new Date(patient.DOB) : null;
    
    this.patientForm.patchValue({
      ...patient,
      DOB: dobDate
    });
    
    this.displayDialog = true;
  }

  savePatient() {
    if (this.patientForm.invalid) {
      return;
    }

    const patientData = this.patientForm.value;
    
    // Format date to string
    if (patientData.DOB instanceof Date) {
      patientData.DOB = patientData.DOB.toISOString().split('T')[0];
    }

    if (this.isNewPatient) {
      this.healthcareService.addPatient(patientData).subscribe({
        next: () => {
          this.loadPatients();
          this.displayDialog = false;
        },
        error: (err) => {
          console.error('Error adding patient', err);
        }
      });
    } else if (this.selectedPatient) {
      this.healthcareService.updatePatient(this.selectedPatient.BeneID, patientData).subscribe({
        next: () => {
          this.loadPatients();
          this.displayDialog = false;
        },
        error: (err) => {
          console.error('Error updating patient', err);
        }
      });
    }
  }

  deletePatient(patient: Patient) {
    if (confirm(`Are you sure you want to delete patient ${patient.BeneID}?`)) {
      this.healthcareService.deletePatient(patient.BeneID).subscribe({
        next: () => {
          this.loadPatients();
        },
        error: (err) => {
          console.error('Error deleting patient', err);
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

  // Handle null or NaN values in reimbursement calculation
  getTotalReimbursement(patient: Patient): number {
    const ipAmount = patient.IPAnnualReimbursementAmt || 0;
    const opAmount = patient.OPAnnualReimbursementAmt || 0;
    return ipAmount + opAmount;
  }
}