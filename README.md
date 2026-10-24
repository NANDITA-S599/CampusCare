# CampusCare — Smart Campus Complaint and Grievance Management System

A full-stack student project built with React + Vite, Express, MySQL, JWT, bcrypt and Multer. It provides role-based student, department staff and administrator workflows for reporting and resolving campus issues.

## Features

- Register/login with hashed passwords and JWT authentication
- Roles: `student`, `department_staff`, `admin`
- Create complaints with category, priority and optional image attachment
- Automatic ticket IDs (`CC-YYYY-00001`) and category-to-department routing
- Complaint ownership checks and department-scoped staff access
- Status updates with notes and an audit/history timeline
- Resolution feedback (1–5 stars, one submission per resolved ticket)
- Dashboard counts, category/status analytics and resolution-time metrics
- Admin complaint assignment/reassignment, user listing, department listing and CSV export
- Responsive sidebar layout, search and status/category filters

## Prerequisites

- Node.js 20+ and npm
- MySQL 8+
- VS Code (recommended)

## Setup in VS Code

1. Extract/open the `CampusCare` folder in VS Code.
2. Create the database and tables by running `database/schema.sql` in MySQL Workbench or the MySQL CLI:

   ```bash
   mysql -u root -p < database/schema.sql
   ```

3. Copy `.env.example` to `server/.env` and set your MySQL password and a strong `JWT_SECRET`.
4. Install dependencies from the project root:

   ```bash
   npm run install:all
   ```

5. Create development demo accounts and sample departments:

   ```bash
   npm run seed
   ```

6. Start the API and frontend:

   ```bash
   npm run dev
   ```

7. Open `http://localhost:5173`. The API runs at `http://localhost:5000/api`.

### Demo accounts

The seed script creates these **development-only** accounts (change passwords before any deployment):

| Role | Email | Password |
|---|---|---|
| Administrator | `admin@campuscare.local` | `CampusCare@123` |
| Department staff | `facilities@campuscare.local` | `CampusCare@123` |
| Student | `student@campuscare.local` | `CampusCare@123` |

## API overview

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/auth/register` | Public | Register a student/staff account |
| POST | `/auth/login` | Public | Log in and receive JWT |
| GET | `/auth/me` | Authenticated | Current user profile |
| GET | `/departments` | Authenticated | List departments |
| GET | `/complaints` | Authenticated | List complaints permitted for the current role |
| POST | `/complaints` | Student/staff | Submit a complaint, optional `image` field |
| GET | `/complaints/:id` | Authorized user | Complaint details and history |
| PATCH | `/complaints/:id/status` | Department staff/admin | Update status and add history note |
| PATCH | `/complaints/:id/assign` | Admin | Assign department/staff |
| POST | `/complaints/:id/feedback` | Original complainant | Submit feedback after resolution |
| GET | `/dashboard/summary` | Authenticated | Role-aware dashboard metrics |
| GET | `/dashboard/analytics` | Admin/staff | Analytics aggregates |
| GET | `/reports/complaints.csv` | Admin | Export complaints as CSV |
| GET | `/users` | Admin | List user accounts |

## Complaint workflow

`Submitted → In Progress → Resolved` (or `Rejected`). Reopening is represented by returning a resolved ticket to `In Progress` with a review note. Every status change and assignment is recorded in `complaint_history`.

## Testing

- Log in as the student, submit a complaint and confirm the generated ticket ID.
- Log in as department staff and update a complaint assigned to that department.
- Log in as admin, assign/reassign a complaint and export a CSV report.
- Confirm a student cannot access another user's complaint by changing the ID in the URL.
- Confirm feedback is accepted only for a resolved complaint and cannot be duplicated.
- Confirm unsupported upload types and oversized files are rejected.

A Postman collection is provided at `docs/CampusCare.postman_collection.json`.

## Troubleshooting

- **Database connection error:** ensure MySQL is running and `server/.env` credentials match your local setup.
- **Unknown database:** run `database/schema.sql` first.
- **Port in use:** change `PORT` in `server/.env` or stop the process using port 5000.
- **Frontend cannot reach API:** check `VITE_API_URL` in `client/.env` (default is `http://localhost:5000/api`) and `CLIENT_URL` in `server/.env`.

## Deployment notes

This is a learning/development prototype. Before production, use HTTPS, rotate all secrets, use a managed database, move uploads to private object storage, add email-based password reset and rate limiting, configure backups, review privacy requirements, and replace the demo accounts. Do not deploy with demo credentials.
