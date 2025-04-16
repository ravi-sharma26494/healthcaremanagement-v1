import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { HttpClient } from '@angular/common/http';
import { User } from '../../interfaces/auth';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule, 
    TableModule, 
    ButtonModule, 
    PaginatorModule, 
    TagModule,
    AvatarModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  userEmail: string | null = null;
  loading: boolean = true;
  
  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userEmail = this.authService.getLoggedInUserEmail();
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.http.get<User[]>('http://localhost:3000/users').subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching users data', err);
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

  getInitials(name: string): string {
    if (!name) return '?';
    
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  getRandomColor(id: string): string {
    const colors = [
      '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', 
      '#4CAF50', '#8BC34A', '#CDDC39', '#FFC107', '#FF9800',
      '#FF5722', '#795548', '#9C27B0', '#673AB7', '#E91E63'
    ];
    
    // Use the user ID to create a deterministic but seemingly random color
    const index = id ? parseInt(id.toString().substring(0, 5), 10) % colors.length : 0;
    return colors[index];
  }
}