# AuthChallenge

## Overview
AuthChallenge is a robust authentication system designed to provide secure access control for web applications. It aims to simplify the implementation of authentication mechanisms such as user registration, login, password reset, and more.

## Features
- User Registration and Login
- Password Reset and Change
- Email Verification
- OAuth Integration (e.g., Google, Facebook)
- Multi-Factor Authentication (MFA)
- Secure Token Management
- Role-Based Access Control (RBAC)

## Installation

### Prerequisites
Before you begin, ensure you have met the following requirements:
- Node.js (>=14.x)
- npm (>=6.x) or yarn (>=1.x)
- MongoDB (>=4.x) or any other supported database

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/AuthChallenge.git
   cd AuthChallenge

### Install dependencies:
npm install
# or
yarn install

### Set up environment variables:

PORT=3000
DATABASE_URL=mongodb://localhost:27017/authchallenge
JWT_SECRET=your_jwt_secret
EMAIL_HOST=smtp.your-email.com
EMAIL_PORT=587
EMAIL_USER=your-email@domain.com
EMAIL_PASS=your-email-password

### Run the application:
npm start
# or
yarn start

### API list

# User Register
/api/v1/auth/register

# User Login
/api/v1/auth/login

# Change Existing Password - Need Auth Token
/api/v1/auth/changePassword

# Forgot Password
/api/v1/auth/forgotPassword

# Reset Password - Need linkId from forgot Password Link
/api/v1/auth/resetPassword

# Get Profile - Need Auth Token
/api/v1/users/myProfile

# Get All User List - Need Auth Token
/api/v1/users/list

# Kindly Fok Collection to hit API
https://auth66-7789.postman.co/workspace/auth-Workspace~053e9e66-8a6f-4515-8ba9-60a31c61f884/collection/34613950-e287e2e9-5a7e-45c2-a98d-d863d71aff82?action=share&creator=34613950