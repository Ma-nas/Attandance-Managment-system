# Attendance Management System (AMS)

### Enterprise Academic Attendance Governance Platform with Granular Role-Based Access Control

[![Java](https://img.shields.io/badge/Java-21-ED8B00?style=flat-square&logo=openjdk&logoColor=white)](https://openjdk.org)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=flat-square&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Spring Security](https://img.shields.io/badge/Spring_Security-RBAC-6DB33F?style=flat-square&logo=springsecurity&logoColor=white)](https://spring.io/projects/spring-security)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.x-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

[System Overview](#system-overview) | [Architecture](#system-architecture) | [RBAC Matrix](#role-based-access-control-matrix) | [API Endpoints](#rest-api-specification) | [Setup Guide](#setup--installation)

---

## System Overview

The Attendance Management System (AMS) is a full-stack, enterprise-grade academic administration platform engineered to automate attendance tracking, departmental structure management, and academic analytics. Built on Java 21, Spring Boot, and PostgreSQL with a decoupled React/TypeScript client, AMS replaces error-prone physical registers with authenticated, audit-logged digital records.

### Key Capabilities

- **Strict Role-Based Access Control (RBAC):** Three distinct operating portals (Administrator, Trainer/Faculty, and Student) with isolated permission boundaries.
- **Dynamic Attendance Roster:** Interactive session management allowing trainers to query specific course classes and batch-submit attendance records in real time.
- **Academic Hierarchy Management:** Relational data structures managing Departments, Course Classes, Subjects, Faculty assignments, and Student enrollments.
- **Live Student Telemetry:** Students monitor subject-wise attendance percentages against institutional minimum thresholds and review campus event bulletins.
- **Automated Mock Data Seeding:** Embedded data initialization pipeline populating realistic academic structures (including an AIML department roster of 29 students, schedules, and mock attendance history).

---

## System Architecture

```
+-------------------------------------------------------------------------+
|                  React 18 + TypeScript + Vite Client                    |
|       Admin Console    |    Faculty Marking Sheet   |   Student Portal  |
+-------------------------------------------------------------------------+
                                    |
                           HTTP REST (JSON Payloads)
                                    v
+-------------------------------------------------------------------------+
|                     Spring Boot 3.x Application Core                    |
|       Security Filter Chain  |  CORS Configuration  |  Global Handlers  |
+-------------------------------------------------------------------------+
          |                         |                         |
          v                         v                         v
+--------------------+    +--------------------+    +--------------------+
|  AdminController   |    |AttendanceController|    | StudentController  |
|  Department / User |    | Roster Submission  |    | Attendance History |
+--------------------+    +--------------------+    +--------------------+
          |                         |                         |
          +-------------------------+-------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                        Spring Data JPA Layer                            |
|             Hibernate ORM Entities & Transactional Services             |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                           PostgreSQL Database                           |
|          users | departments | subjects | course_classes | attendance   |
+-------------------------------------------------------------------------+
```

---

## Role-Based Access Control Matrix

| Permission / Workflow | Administrator | Trainer (Faculty) | Student |
| :--- | :---: | :---: | :---: |
| Authenticate via dedicated portal | Yes | Yes | Yes |
| Department & Course Class Management | Yes | No | No |
| User Provisioning (Students & Faculty) | Yes | No | No |
| Global Attendance Audit & Reporting | Yes | No | No |
| Fetch Assigned Class Rosters | Yes | Yes | No |
| Submit Session Attendance (Batch Present/Absent) | Yes | Yes | No |
| View Individual Attendance Percentages | Yes | Yes | Yes (Self Only) |
| Review Campus Event Announcements | Yes | Yes | Yes |

### Default Development Credentials

| Role | Email Identifier | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@ams.com` | `admin123` | Full administrative governance |
| **Trainer** | `trainer@ams.com` | `trainer123` | Faculty attendance marking |
| **Student (AIML)** | `23btrcl210@student.ams.com` | `Mishra_00` | Student profile and records |

---

## REST API Specification

### Authentication

- `POST /api/v1/auth/login` - Authenticate user credentials and return role-bound session data.
- `POST /api/v1/auth/register` - Create new user account (Admin scoped).

### Academic Administration

- `GET /api/v1/departments` - List all institutional departments.
- `POST /api/v1/departments` - Register a new department.
- `GET /api/v1/subjects` - Query subjects by department and semester.
- `POST /api/v1/subjects` - Register a new curriculum subject.
- `GET /api/v1/classes` - Retrieve active course classes and faculty allocations.
- `POST /api/v1/classes` - Create a new course section.

### Attendance Operations

- `POST /api/v1/attendance/mark` - Batch submit attendance status (PRESENT / ABSENT) for a course class session.
- `GET /api/v1/attendance/class/{classId}` - Retrieve historical attendance logs for a specific course class.
- `GET /api/v1/attendance/student/{studentId}` - Compute subject-wise attendance aggregates for an individual student.

### Student and Event Services

- `GET /api/v1/students/department/{deptId}` - List students enrolled under a specific department.
- `GET /api/v1/events` - Retrieve active campus event announcements.
- `POST /api/v1/events` - Publish campus bulletin (Admin scoped).

---

## Setup & Installation

### Prerequisites

- Java Development Kit (JDK 21 or higher)
- Node.js (v18.0.0 or higher) and npm
- PostgreSQL (v14 or higher) running locally on port `5432`

### 1. Database Configuration

Create a dedicated database instance in PostgreSQL:

```sql
CREATE DATABASE ams_db;
CREATE USER ams_user WITH ENCRYPTED PASSWORD 'ams_password';
GRANT ALL PRIVILEGES ON DATABASE ams_db TO ams_user;
```

*(Connection parameters can be adjusted in `backend/src/main/resources/application.properties`)*

### 2. Backend Service Launch

Navigate to the `backend/` directory:

```bash
cd backend

# Execute Maven wrapper build and run
./mvnw clean spring-boot:run
```

On first initialization, Hibernate creates table schemas and seeds the mock roster. The backend runs on `http://localhost:8080`.

### 3. Frontend Client Launch

In a separate terminal, navigate to the `frontend/` directory:

```bash
cd frontend

# Install Node dependencies
npm install

# Start Vite development server
npm run dev
```

The frontend client launches on `http://localhost:5173`.

---


---

## 24/7 Cloud Deployment Guide (Free Hosting)

To keep the Attendance Management System accessible online 24/7 for anyone with zero hosting cost, deploy using one of the following production setups:

### Method 1: Automated 1-Click Blueprint (Render)

This repository includes a ready-to-run [`render.yaml`](render.yaml) blueprint that automatically provisions a cloud PostgreSQL database, Dockerized Spring Boot backend, and React static frontend:

1. Sign up for a free account at [Render](https://render.com/).
2. Click **New +** -> **Blueprint**.
3. Connect your GitHub repository: `Ma-nas/Attandance-Managment-system`.
4. Render detects `render.yaml` and provisions:
   - `ams-db`: Free cloud PostgreSQL 15 database
   - `ams-backend`: Dockerized Spring Boot Web Service
   - `ams-frontend`: React Static Site with SPA routing
5. Click **Apply**. Once built, Render generates live URLs accessible 24/7 from anywhere in the world.

---

### Method 2: Vercel (Frontend) + Render/Railway (Backend) + Neon (Database)

#### 1. Free Cloud Database (Neon / Supabase)
- Create a free database at [Neon.tech](https://neon.tech/) or [Supabase](https://supabase.com/).
- Copy your PostgreSQL connection string: `postgresql://user:password@ep-xyz.neon.tech/ams_db`.

#### 2. Backend Service (Render or Railway)
- Create a new **Web Service** on Render or Railway pointing to the `backend/` folder.
- Select **Docker** (or Maven build).
- Add Environment Variables:
  - `SPRING_DATASOURCE_URL`: `jdbc:postgresql://ep-xyz.neon.tech/ams_db?sslmode=require`
  - `SPRING_DATASOURCE_USERNAME`: your Neon user
  - `SPRING_DATASOURCE_PASSWORD`: your Neon password
- The backend automatically initializes tables and mock data on boot.

#### 3. Frontend Client (Vercel)
- Sign in to [Vercel](https://vercel.com/) and click **Add New Project**.
- Select `Attandance-Managment-system`.
- In Project Settings:
  - **Root Directory:** `frontend`
  - **Framework Preset:** `Vite`
  - **Environment Variables:**
    - `VITE_API_BASE_URL`: `https://your-backend-service.onrender.com`
- Click **Deploy**. Vercel delivers a 24/7 global CDN URL (e.g. `https://ams-system.vercel.app`).

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for full details.

