# Attendance Management System

A highly polished, modern, full-stack Attendance Management System built with **Spring Boot** and **React**. Designed to provide a premium user experience for Students, Trainers, and Administrators, with fully role-based access control and dynamic dashboard functionality.

##  Features

- **Role-Based Access Control (RBAC):** Secure login portals tailored for Admins, Teachers, and Students.
- **Premium UI/UX:** Responsive, modern interfaces styled with Tailwind CSS, utilizing glassmorphism, soft shadows, and a clean white-and-navy aesthetic.
- **Admin Center:** Comprehensive dashboards to manage Departments, Students, Trainers, and review Attendance records effortlessly.
- **Dynamic Trainer Roster:** Interactive attendance-taking workflow allowing trainers to select specific classes and mark present/absent students instantly.
- **Real-time Student Dashboard:** Students can securely view their personal attendance statistics and dynamically loaded campus events.
- **Automated Mock Data Seeding:** Instantly spins up realistic data (such as an Artificial Intelligence and Machine Learning roster with 29 students, complete with events and mock attendance).

##  Technology Stack

- **Frontend:** React (Vite), TypeScript, Tailwind CSS, TanStack Query, React Router, Lucide React (Icons).
- **Backend:** Java 21, Spring Boot (REST API), Spring Security (JWT authentication ready architecture), Spring Data JPA.
- **Database:** PostgreSQL.

###  Administrator
- **Email:** `admin@ams.com`
- **Password:** `admin123`

###  Trainer
- **Email:** `trainer@ams.com`
- **Password:** `trainer123`

###  Student (AIML Roster)
- **Email:** `23btrcl210@student.ams.com` (Manas Mishra)
- **Password:** `Mishra_00`
- *(Other mock students follow the format `[usn]@student.ams.com` / `student123`)*

##  Local Setup Instructions

### 1. Prerequisites
- **Java 21** or higher.
- **Node.js** (v18+ recommended).
- **PostgreSQL** running locally on default port 5432.

### 2. Database Configuration
1. Open PostgreSQL and create a database named `ams_db`.
2. Ensure you have a user with credentials:
   - Username: `ams_user`
   - Password: `ams_password`
*(You can modify these defaults in `backend/src/main/resources/application.properties`)*

### 3. Start the Backend (Spring Boot)
Open a terminal in the `backend/` directory:
```bash
cd backend
./mvnw clean spring-boot:run
```
*(On the very first run, it will automatically build the schema and seed the AIML mock roster).*

### 4. Start the Frontend (React)
Open a separate terminal in the `frontend/` directory:
```bash
cd frontend
npm install
npm run dev
```
Navigate to `http://localhost:5173` in your web browser.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check [issues page](#) if you want to contribute.

## 📝 License
This project is [MIT](https://choosealicense.com/licenses/mit/) licensed.
