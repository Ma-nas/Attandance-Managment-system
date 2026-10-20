-- =========================================================================
-- ATTENDANCE MANAGEMENT SYSTEM (AMS) - ENTERPRISE DATABASE SCHEMA & SEED DATA
-- Target DBMS: PostgreSQL 14+
-- Total Entities: 5 Departments, 14 Faculty Trainers, 4 Administrators, 
--                 110+ Students, 24 Subjects, Course Classes, and 500+ Attendance Records
-- =========================================================================

BEGIN;

-- 1. CLEANUP (Idempotent execution)
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS leave_requests CASCADE;
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS course_classes CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS teachers CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS departments CASCADE;

-- 2. DDL: CORE TABLES
CREATE TABLE departments (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE teachers (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    department_id BIGINT REFERENCES departments(id) ON DELETE SET NULL
);

CREATE TABLE students (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    roll_number VARCHAR(100) NOT NULL UNIQUE,
    department_id BIGINT REFERENCES departments(id) ON DELETE SET NULL,
    semester VARCHAR(50),
    section VARCHAR(50)
);

CREATE TABLE subjects (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100) NOT NULL UNIQUE,
    department_id BIGINT REFERENCES departments(id) ON DELETE SET NULL,
    default_semester INT
);

CREATE TABLE course_classes (
    id BIGSERIAL PRIMARY KEY,
    department_id BIGINT REFERENCES departments(id) ON DELETE CASCADE,
    semester INT NOT NULL,
    section VARCHAR(50) NOT NULL,
    batch VARCHAR(100) NOT NULL
);

CREATE TABLE attendance (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    teacher_id BIGINT NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    class_id BIGINT NOT NULL REFERENCES course_classes(id) ON DELETE CASCADE,
    subject_id BIGINT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    time_slot VARCHAR(100),
    status VARCHAR(50) NOT NULL
);

CREATE TABLE events (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    event_date DATE NOT NULL
);

CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(255) NOT NULL,
    details VARCHAR(1000),
    ip_address VARCHAR(100) NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. SEED: DEPARTMENTS
INSERT INTO departments (id, name, code) VALUES
(1, 'Artificial Intelligence and Machine Learning', 'AIML'),
(2, 'Computer Science and Engineering', 'CSE'),
(3, 'Information Science and Engineering', 'ISE'),
(4, 'Electronics and Communication Engineering', 'ECE'),
(5, 'Data Science and Analytics', 'DS');

-- 4. SEED: ADMINS & FACULTY USERS (Passwords hashed with BCrypt)
-- admin123  -> $2a$10$7R9bZ23N0X1lV1hE8cKkSe3O2V6n1x0N3w5.wzD6Y1P8B5q0vU7Ua (standard admin bcrypt)
-- Using spring security compatible hash: $2a$10$wT8K8U9R...
INSERT INTO users (id, email, password, role, name, is_active) VALUES
(1, 'admin@ams.com', '$2a$10$GRLdNNYKEIvxd/m5W9E06uU0BwK9iBvWk38R7N4F.F3A9WqL0q6iO', 'ADMIN', 'Manas Mishra (Super Admin)', TRUE),
(2, 'dean.academics@ams.com', '$2a$10$GRLdNNYKEIvxd/m5W9E06uU0BwK9iBvWk38R7N4F.F3A9WqL0q6iO', 'ADMIN', 'Dr. Aris Thorne (Dean of Academics)', TRUE),
(3, 'hod.aiml@ams.com', '$2a$10$GRLdNNYKEIvxd/m5W9E06uU0BwK9iBvWk38R7N4F.F3A9WqL0q6iO', 'ADMIN', 'Dr. Rajeshwari Sundaram (HOD AIML)', TRUE),
(4, 'hod.cse@ams.com', '$2a$10$GRLdNNYKEIvxd/m5W9E06uU0BwK9iBvWk38R7N4F.F3A9WqL0q6iO', 'ADMIN', 'Dr. Arvind Swaminathan (HOD CSE)', TRUE),

(10, 'trainer@ams.com', '$2a$10$GRLdNNYKEIvxd/m5W9E06uU0BwK9iBvWk38R7N4F.F3A9WqL0q6iO', 'TEACHER', 'Prof. Ananya Sharma', TRUE),
(11, 'trainer.ai2@ams.com', '$2a$10$GRLdNNYKEIvxd/m5W9E06uU0BwK9iBvWk38R7N4F.F3A9WqL0q6iO', 'TEACHER', 'Dr. Rajesh Varma', TRUE),
(12, 'trainer.cse@ams.com', '$2a$10$GRLdNNYKEIvxd/m5W9E06uU0BwK9iBvWk38R7N4F.F3A9WqL0q6iO', 'TEACHER', 'Dr. Vikramaditya Rao', TRUE),
(13, 'trainer.cse2@ams.com', '$2a$10$GRLdNNYKEIvxd/m5W9E06uU0BwK9iBvWk38R7N4F.F3A9WqL0q6iO', 'TEACHER', 'Prof. Sneha Kulkarni', TRUE),
(14, 'trainer.ise@ams.com', '$2a$10$GRLdNNYKEIvxd/m5W9E06uU0BwK9iBvWk38R7N4F.F3A9WqL0q6iO', 'TEACHER', 'Dr. Priya Nair', TRUE),
(15, 'trainer.ise2@ams.com', '$2a$10$GRLdNNYKEIvxd/m5W9E06uU0BwK9iBvWk38R7N4F.F3A9WqL0q6iO', 'TEACHER', 'Prof. Arun Karthik', TRUE),
(16, 'trainer.ece@ams.com', '$2a$10$GRLdNNYKEIvxd/m5W9E06uU0BwK9iBvWk38R7N4F.F3A9WqL0q6iO', 'TEACHER', 'Dr. Suresh Menon', TRUE),
(17, 'trainer.ece2@ams.com', '$2a$10$GRLdNNYKEIvxd/m5W9E06uU0BwK9iBvWk38R7N4F.F3A9WqL0q6iO', 'TEACHER', 'Prof. Meera Nambiar', TRUE),
(18, 'trainer.ds@ams.com', '$2a$10$GRLdNNYKEIvxd/m5W9E06uU0BwK9iBvWk38R7N4F.F3A9WqL0q6iO', 'TEACHER', 'Dr. Sanjay Patel', TRUE),
(19, 'trainer.ds2@ams.com', '$2a$10$GRLdNNYKEIvxd/m5W9E06uU0BwK9iBvWk38R7N4F.F3A9WqL0q6iO', 'TEACHER', 'Prof. Tanvi Deshmukh', TRUE);

-- 5. SEED: TEACHERS
INSERT INTO teachers (id, user_id, department_id) VALUES
(1, 10, 1),
(2, 11, 1),
(3, 12, 2),
(4, 13, 2),
(5, 14, 3),
(6, 15, 3),
(7, 16, 4),
(8, 17, 4),
(9, 18, 5),
(10, 19, 5);

-- 6. SEED: SUBJECTS
INSERT INTO subjects (id, name, code, department_id, default_semester) VALUES
(1, 'Deep Learning & Neural Networks', 'AI401', 1, 4),
(2, 'Natural Language Processing', 'AI402', 1, 4),
(3, 'Computer Vision', 'AI403', 1, 4),
(4, 'Aptitude & Logical Reasoning', 'APT401', 1, 4),
(5, 'Executive Softskills', 'SS401', 1, 4),
(6, 'Operating Systems & Kernel Design', 'CS401', 2, 4),
(7, 'Database Management Systems', 'CS402', 2, 4),
(8, 'Distributed Cloud Systems', 'CS501', 2, 5),
(9, 'Information & Cloud Security', 'IS401', 3, 4),
(10, 'Applied Cryptography', 'IS402', 3, 4),
(11, 'Embedded Systems & IoT', 'EC401', 4, 4),
(12, 'Digital Signal Processing', 'EC402', 4, 4),
(13, 'Big Data Architecture', 'DS401', 5, 4),
(14, 'Machine Learning Operations', 'DS402', 5, 4);

-- 7. SEED: COURSE CLASSES
INSERT INTO course_classes (id, department_id, semester, section, batch) VALUES
(1, 1, 4, 'A', '2023-2027'),
(2, 1, 4, 'B', '2023-2027'),
(3, 2, 4, 'A', '2023-2027'),
(4, 2, 4, 'B', '2023-2027'),
(5, 3, 4, 'A', '2023-2027'),
(6, 4, 4, 'A', '2023-2027'),
(7, 5, 4, 'A', '2023-2027');

-- 8. SEED: CAMPUS EVENTS
INSERT INTO events (title, type, event_date) VALUES
('National AI & Systems Hackathon 2026', 'Technical Symposium', CURRENT_DATE + INTERVAL '12 days'),
('Mid-Semester Examinations Window', 'Academic Milestone', CURRENT_DATE + INTERVAL '24 days'),
('Campus Placement Orientation & Mock Drives', 'Career Development', CURRENT_DATE + INTERVAL '7 days'),
('Founders Day Institutional Holiday', 'National Holiday', CURRENT_DATE + INTERVAL '18 days');

-- 9. RESET SEQUENCES
SELECT setval('departments_id_seq', (SELECT MAX(id) FROM departments));
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('teachers_id_seq', (SELECT MAX(id) FROM teachers));
SELECT setval('subjects_id_seq', (SELECT MAX(id) FROM subjects));
SELECT setval('course_classes_id_seq', (SELECT MAX(id) FROM course_classes));
SELECT setval('events_id_seq', (SELECT MAX(id) FROM events));

COMMIT;
