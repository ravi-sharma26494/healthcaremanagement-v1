# Healthcare Management Application

A comprehensive Angular 18 application for healthcare management with authentication, featuring patient records, claims processing, fraud detection, and user management.

![Healthcare Management Dashboard](screenshots/dashboard.png)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Application Structure](#application-structure)
- [User Guide](#user-guide)
  - [Authentication](#authentication)
  - [Dashboard](#dashboard)
  - [Claims Management](#claims-management)
  - [Patient Records](#patient-records)
  - [Fraud Detection](#fraud-detection)
  - [User Management](#user-management)
- [API and Mock Data](#api-and-mock-data)
- [Contributing](#contributing)
- [License](#license)

## Overview

The Healthcare Management Application is a robust Angular-based web application designed for healthcare administrators to manage patient data, process claims, detect potential fraud cases, and manage system users. The application features a secure authentication system and a responsive user interface built with PrimeNG components.

## Features

- **User Authentication**: Secure login and registration with session management
- **Dashboard**: Overview of system statistics with quick navigation to key areas
- **Claims Management**: View and process healthcare claims with status indicators
- **Patient Records**: Comprehensive patient information including medical conditions
- **Fraud Detection**: Monitor and investigate potential fraud cases with confidence indicators
- **User Management**: Admin interface for managing system users

## Technology Stack

- **Frontend**: Angular 18 (Standalone Components)
- **UI Components**: PrimeNG 18
- **Styling**: CSS with PrimeNG themes
- **Backend**: JSON Server (for development/demo)
- **Authentication**: Custom token-based authentication

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (v18 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/healthcare-management.git
   cd healthcare-management
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the mock backend server:
   ```bash
   json-server --watch db.json
   ```

### Running the Application

1. Start the development server:
   ```bash
   ng serve
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:4200
   ```

3. Use the following demo credentials:
   - Email: admin@example.com
   - Password: admin123

## Application Structure

The application follows Angular's recommended structure:

- **Components**: Organized by feature (auth, dashboard, claims, patients, fraud, users)
- **Services**: Centralized for authentication, data management
- **Guards**: Route protection with authentication checks
- **Interfaces**: Type definitions for the application data
- **Routes**: Lazy-loaded for optimal performance

## User Guide

### Authentication

#### Login
1. Navigate to the login page
2. Enter your email and password
3. Click "SIGN IN"

![Login Screen](screenshots/login.png)

#### Registration
1. From the login page, click "Register"
2. Fill in your full name, email, and password
3. Confirm your password
4. Click "Register"

![Registration Screen](screenshots/register.png)

### Dashboard

The dashboard is the main hub of the application, showing:

- Total number of claims
- Registered patients count
- Fraud cases detected
- Active system users

From here, you can navigate to any major section of the application by clicking the "View Details" button in each card.

![Dashboard](screenshots/dashboard.png)

### Claims Management

The Claims Management section allows you to:

- View all healthcare claims in a paginated table
- See claim details including claim ID, patient ID, type, amount, status, date, and provider
- Status is color-coded for easy identification (Approved: green, Pending: yellow, Rejected: red)
- Navigate back to dashboard with the prominent "Back to Dashboard" button

![Claims Management](screenshots/claims.png)

### Patient Records

The Patient Records section provides:

- A comprehensive list of patients with detailed information
- Patient demographics (ID, DOB, gender, race)
- Medical conditions displayed as color-coded tags
- Annual reimbursement amounts
- Filters and sorting options for efficient data analysis

![Patient Records](screenshots/patients.png)

### Fraud Detection

The Fraud Detection module helps identify and investigate potential fraud cases:

- View fraud cases with details like case ID, claim ID, type, detection date, and status
- Monitor confidence levels with visual indicators
- Track investigation status (Confirmed, Under Investigation, Under Review)
- Sort and filter data for better analysis

![Fraud Detection](screenshots/fraud.png)

### User Management

The User Management section allows administrators to:

- View all system users
- See user status (active/inactive)
- User avatars with initials and color-coding for easy identification
- Manage user accounts (view details)

![User Management](screenshots/users.png)

## API and Mock Data

The application uses a JSON Server backend during development that provides the following endpoints:

- `/users` - User authentication and management
- `/claims` - Healthcare claims data
- `/patients` - Patient records
- `/fraud` - Fraud detection cases
- `/stats` - Dashboard statistics

To modify the mock data, edit the `db.json` file in the root directory.

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

© 2025 Healthcare Management System. All Rights Reserved.
