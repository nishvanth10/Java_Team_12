# University Management System

A full-stack application for managing university resources, bookings, and exams.

## Tech Stack
- **Backend:** Java Spring Boot, JPA, Spring Security, JWT
- **Frontend:** React (Vite), Tailwind CSS, Axios
- **Database:** MySQL

## Prerequisites
- Java 17+
- react.js 18+
- Maven
- MySQL Server 8.0+

## Setup & Running

### 1. Database Setup (MySQL)
1.  Ensure MySQL Server is running.
2.  Create a database named `university_management_system`.
    ```sql
    CREATE DATABASE university_management_system;
    ```
3.  Run the provided schema script to create the tables.
    -   File: `database/schema.sql`
    -   You can run this via MySQL Workbench or CLI:
        ```bash
        mysql -u root -p university_management_system < database/schema.sql
        ```

### 2. Backend Setup
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Configure Database Credentials:
    -   Open `src/main/resources/application.properties`.
    -   Update `spring.datasource.username` and `spring.datasource.password` with your MySQL credentials.
    -   Default configuration acts on `localhost:3306`.
3.  Build and Run the application:
    ```bash
    mvn spring-boot:run
    ```
    -   The backend server will start on `http://localhost:8082`.

### 3. Frontend Setup
1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
    -   The frontend will be accessible at `http://localhost:5173`.

## Features
- **Roles:** STUDENT, STAFF, ADMIN.
- **Authentication:** JWT-based login, auto-logout on token expiration (15 mins).
- **Security:** Account locking after 5 failed login attempts.
- **Student:** Book halls, View exams.
- **Staff:** Approve student bookings.
- **Admin:** Approve requests, Allot exams, Unlock users, User management.

## Usage Flow
1.  **Registration:** New users can register via the registration page.
    -   *Note:* Admin registration might be restricted based on configuration.
2.  **Login:** Use your registered credentials to log in.
3.  **Dashboard:** Based on your role (Student, Staff, or Admin), you will be redirected to the appropriate dashboard.

## Troubleshooting
-   **Database Connection Refused:** Ensure MySQL service is running and credentials in `application.properties` are correct.
-   **Port Conflicts:** Ensure ports 8082 (backend) and 5173 (frontend) are free.
