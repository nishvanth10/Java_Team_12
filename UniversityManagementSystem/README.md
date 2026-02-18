# University Management System

A full-stack application for managing university resources, bookings, and exams.

## Tech Stack
- **Backend:** Java Spring Boot, JPA, Spring Security, JWT
- **Frontend:** React (Vite), Tailwind CSS, Axios
- **Database:** Supabase (PostgreSQL)

## Prerequisites
- Java 17+
- Node.js 18+
- Maven

## Setup & Running

### 1. Database
The database schema is provided in `database/schema.sql`.
Run this SQL script in your Supabase SQL Editor to create the necessary tables.

### 2. Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Update `src/main/resources/application.properties` if your Supabase credentials change.
3. Run the application:
   ```bash
   mvn spring-boot:run
   ```
   The backend will start on `http://localhost:8080`.

### 3. Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   The frontend will start on `http://localhost:5173`.

## Features
- **Roles:** STUDENT, STAFF, ADMIN.
- **Authentication:** JWT-based login, auto-logout on token expiration (15 mins).
- **Security:** Account locking after 5 failed attempts.
- **Student:** Book halls, View exams.
- **Staff:** Approve student bookings.
- **Admin:** Approve requests, Allot exams, Unlock users, User management.

## Default Login
You can register a new user on the Login page with a specific role.
- **Student Flow:** Register as STUDENT -> Login -> Book Hall.
- **Staff Flow:** Register as STAFF -> Login -> Approve Bookings.
- **Admin Flow:** Register as ADMIN -> Login -> Manage System.

