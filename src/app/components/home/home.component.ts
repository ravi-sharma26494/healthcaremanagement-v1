import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { HealthcareService } from '../../services/healthcare.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ButtonModule, CardModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  userEmail: string | null = null;
  stats = {
    claims: 0,
    patients: 0,
    fraud: 0,
    users: 0
  };

  constructor(
    private router: Router,
    private healthcareService: HealthcareService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userEmail = this.authService.getLoggedInUserEmail();
    this.loadStats();
  }

  loadStats() {
    this.healthcareService.getStats().subscribe(stats => {
      this.stats = stats;
    });
  }

  logout() {
    this.authService.logout();
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
