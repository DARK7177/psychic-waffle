# psychic-waffle

# QR Based Student Attendance System

A backend system for managing student attendance using QR code scanning.  
Teachers can create courses and subjects, start class sessions, and mark attendance by scanning student QR codes.

The system is built using **Node.js, Express.js, Prisma ORM, and PostgreSQL**.

---

# Features

## Teacher Features
- Register and login
- Create courses
- Create subjects under courses
- Start class sessions
- Mark student attendance via QR scanning

## Student Features
- Register and login
- Automatically generated QR code
- Belong to a course
- View attendance statistics

## System Features
- QR code based attendance
- JWT authentication
- Role-based access control
- Attendance percentage calculation
- Secure password hashing

---

# Tech Stack

### Backend
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL

### Authentication
- JWT (jsonwebtoken)
- bcrypt

### QR Code Generation
- qrcode npm package

---

# Project Structure

```
server
│
├── prisma
│   └── schema.prisma
│
├── src
│   ├── controllers
│   │   ├── authController.js
│   │   ├── attendanceController.js
│   │   ├── sessionController.js
│   │   └── subjectController.js
│   │
│   ├── middleware
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   │
│   ├── routes
│   │   ├── authRoutes.js
│   │   ├── attendanceRoutes.js
│   │   ├── sessionRoutes.js
│   │   └── subjectRoutes.js
│   │
│   ├── utils
│   │   └── asyncHandler.js
│   │
│   └── index.js
│
├── .env
├── package.json
└── README.md
```

---

# Database Models

## Teacher
- id
- name
- email
- password
- createdAt

## Course
- code
- name

## Subject
- id
- name
- courseCode
- teacherId

## Student
- id
- name
- email
- password
- courseCode
- photoUrl
- qrCode

## Session
- id
- subjectId
- teacherId
- date

## Attendance
- id
- studentId
- sessionId
- markedAt

---

# Installation

## 1 Clone Repository

```bash
git clone https://github.com/yourusername/qr-attendance-system.git
cd qr-attendance-system/server
```

---

## 2 Install Dependencies

```bash
npm install
```

---

## 3 Setup Environment Variables

Create a `.env` file in the root directory.

```
JWT_SECRET=Attendance
DATABASE_URL=your_postgres_database_url
```

Example:

```
DATABASE_URL="postgresql://username:password@host:port/database"
```

---

## 4 Setup Database

Run migration:

```bash
npx prisma migrate dev
```

Generate Prisma client:

```bash
npx prisma generate
```

---

## 5 Start Server

```bash
node src/index.js
```

Server runs on:

```
http://localhost:5000
```

---

# API Workflow

## 1 Register Teacher

```
POST /api/auth/teacher/register
```

Example body:

```json
{
  "name": "John",
  "email": "john@college.com",
  "password": "123456"
}
```

---

## 2 Login Teacher

```
POST /api/auth/login
```

Example body:

```json
{
  "email": "john@college.com",
  "password": "123456"
}
```

Returns JWT token.

---

## 3 Create Course

```
POST /courses
```

Body:

```json
{
  "code": "BCA",
  "name": "Bachelor of Computer Applications"
}
```

---

## 4 Create Subject

```
POST /subjects
```

Body:

```json
{
  "name": "Software Engineering",
  "courseCode": "BCA"
}
```

---

## 5 Start Session

```
POST /sessions
```

Body:

```json
{
  "subjectId": "subject_id"
}
```

---

## 6 Register Student

```
POST /api/auth/student/register
```

Body:

```json
{
  "name": "Rahul",
  "email": "rahul@student.com",
  "password": "123456",
  "courseCode": "BCA",
  "photoUrl": "image.png"
}
```

A QR code will be generated automatically for the student.

---

## 7 Mark Attendance

Teacher scans QR and sends:

```
POST /attendance/scan
```

Body:

```json
{
  "studentId": "student_id",
  "sessionId": "session_id"
}
```

---

## 8 Check Student Attendance

```
GET /attendance/student/:id
```

Example response:

```json
{
  "present": 10,
  "totalSessions": 12,
  "percentage": "83.33"
}
```

---

# Attendance Flow

```
Teacher login
↓
Create course
↓
Create subject
↓
Start session
↓
Student shows QR
↓
Teacher scans QR
↓
Attendance recorded
```

---

# Security

- Password hashing using bcrypt
- JWT authentication
- Role-based authorization
- Duplicate attendance prevention

---

# Future Improvements

- QR scanner frontend
- Student dashboard
- Teacher dashboard
- Session expiration
- Anti-proxy attendance detection
- Cloud image storage
- Admin panel

---

# Author - DARK7177

Developed as a full stack academic project.